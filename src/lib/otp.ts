import crypto from "crypto";
import nodemailer from "nodemailer";

const TTL_MS = 10 * 60 * 1000; // 10 minutes

export type Pending = {
  e: string;        // email
  n: string | null; // name
  p: string;        // bcrypt hash of the password
  o: string;        // HMAC of the OTP
  x: number;        // expiry (ms)
};

function key() {
  const s = process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("NEXTAUTH_SECRET is missing");
  return crypto.createHash("sha256").update("penny-otp-v1:" + s).digest();
}

// AES-256-GCM: the token is both encrypted (the client can't read the password hash) and tamper-proof.
export function seal(data: Pending): string {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([c.update(JSON.stringify(data), "utf8"), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), enc]).toString("base64url");
}

export function open(token: string): Pending | null {
  try {
    const buf = Buffer.from(token, "base64url");
    if (buf.length < 29) return null;
    const d = crypto.createDecipheriv("aes-256-gcm", key(), buf.subarray(0, 12));
    d.setAuthTag(buf.subarray(12, 28));
    const json = Buffer.concat([d.update(buf.subarray(28)), d.final()]).toString("utf8");
    const data = JSON.parse(json) as Pending;
    return data.x > Date.now() ? data : null;
  } catch {
    return null; // tampered, malformed or wrong key
  }
}

export const makeCode = () => crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
export const expiry = () => Date.now() + TTL_MS;

export const codeHash = (email: string, code: string) =>
  crypto.createHmac("sha256", key()).update(`${email}:${code}`).digest("hex");

export function codeMatches(email: string, code: string, expected: string) {
  const a = Buffer.from(codeHash(email, code));
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const tokenId = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex").slice(0, 32);

// Best-effort limiter (in memory: resets on cold starts and isn't shared between serverless instances)
const hits = new Map<string, { n: number; t: number }>();
export function allow(k: string, max: number, windowMs: number) {
  const now = Date.now();
  if (hits.size > 5000) hits.clear();
  const h = hits.get(k);
  if (!h || now - h.t > windowMs) { hits.set(k, { n: 1, t: now }); return true; }
  if (h.n >= max) return false;
  h.n++;
  return true;
}

export async function sendOtpEmail(to: string, code: string) {
  const user = process.env.SMTP_EMAIL;
  const pass = process.env.SMTP_PASSWORD;
  if (!user || !pass) throw new Error("SMTP is not configured");

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  await transport.sendMail({
    from: `"Penny" <${user}>`,
    to,
    subject: `${code} is your Penny verification code`,
    text: `Your Penny verification code is ${code}. It expires in 10 minutes. If you didn't request it, you can ignore this email.`,
    html: `<div style="background:#0d0f15;padding:32px;font-family:Arial,sans-serif">
      <div style="max-width:420px;margin:auto;background:#171a23;border:1px solid #272b38;border-radius:16px;padding:28px;color:#eef0f6">
        <div style="font-size:24px;font-weight:800">Penny<span style="color:#818cf8">.</span></div>
        <p style="color:#8f97a8;margin:18px 0 8px">Your verification code</p>
        <div style="font-size:36px;font-weight:800;letter-spacing:10px;color:#a78bfa">${code}</div>
        <p style="color:#8f97a8;font-size:13px;margin-top:18px">It expires in 10 minutes. If you didn't request this, ignore this email.</p>
      </div></div>`,
  });
}