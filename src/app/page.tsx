import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const SITE = "https://mypenny.net";
const CONTACT_EMAIL = "supportapp.penny@gmail.com";
const FOUNDER = "Yessine Ghariani";
const YEAR = 2026;
const PRO_PRICE = "19.00";

export const metadata: Metadata = {
  title: { absolute: "Penny — Money, simplified | mypenny.net" },
  description:
    "Penny (mypenny.net) is a minimalist AI personal finance and expense tracker by Yessine Ghariani. Log expenses by voice or receipt photo, set monthly budgets, and track savings goals. Free to start, Pro is a one-time $19.",
  applicationName: "Penny",
  authors: [{ name: FOUNDER, url: SITE }],
  creator: FOUNDER,
  keywords: [
    "Penny", "mypenny.net", "Penny finance app", "Yessine Ghariani", "personal finance tracker",
    "AI expense tracker", "expense tracker app", "budget planner", "AI receipt scanner",
    "voice expense logging", "no subscription budget app", "one-time payment budget app",
  ],
  alternates: { canonical: SITE },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Penny",
    title: "Penny — Money, simplified",
    description:
      "Log expenses by voice or receipt photo, stay on budget and hit savings goals. Free to start, one-time $19 Pro upgrade.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Penny — Money, simplified",
    description: "Log expenses by voice or receipt photo, stay on budget and hit savings goals.",
  },
};

const FEATURES = [
  {
    h: "Expense Tracking", tag: "Free",
    p: "Log income and expenses with a category, note and date. Search your history and see your balance, savings rate and spending by category on one clean overview.",
  },
  {
    h: "Gemini AI Voice Logging", tag: "Pro",
    p: "Say “I spent 40 bucks on gas yesterday” and Penny fills in the amount, category, note and date for you. You review it, then save.",
  },
  {
    h: "AI Receipt Scanner", tag: "Pro",
    p: "Snap a photo of any receipt. Penny reads the merchant, date and grand total and prepares the transaction, so you never type one out by hand.",
  },
  {
    h: "Smart Budgets & Goals", tag: "Pro",
    p: "Set a monthly limit for each category and watch progress bars warn you before you overspend. Add savings goals and track how close you are.",
  },
  {
    h: "Gamified Daily Streak", tag: "Pro",
    p: "Build the habit of tracking with a daily streak, and restore a broken streak once a month so one missed day doesn't wipe your progress.",
  },
  {
    h: "AI Spending Roast", tag: "Pro",
    p: "Get a short, savage, shareable roast of your month's spending, written by AI from your real numbers.",
  },
] as const;

const FAQS = [
  {
    q: "What is Penny (mypenny.net)?",
    a: "Penny (https://mypenny.net) is an independent minimalist AI personal finance and expense tracker web application created by Yessine Ghariani. You log income and expenses by typing, speaking, or photographing a receipt, then track where your money goes with visual charts, monthly category budgets, and savings goals. Penny is free to start, and Penny Pro is a one-time $19 lifetime upgrade with no recurring subscription.",
  },
  {
    q: "How is Penny different from traditional budgeting apps?",
    a: "Most budgeting apps charge $80 to $120 per year in subscriptions and require linking your private bank login credentials. Penny requires no bank linking for complete privacy and instant setup, uses AI voice and receipt scanning to make manual entry effortless, and charges a single one-time payment of $19 for Pro instead of a monthly subscription.",
  },
  {
    q: "How does AI voice logging and receipt scanning work?",
    a: "In the Transactions tab, tap the mic to speak a sentence or tap the camera to snap a photo of a receipt. Google's Gemini AI extracts the amount, category, merchant note, and date, filling the form automatically for you to review and add.",
  },
  {
    q: "How much does Penny Pro cost?",
    a: "Penny Pro is a one-time payment of $19 USD with no subscription. It unlocks monthly budgets, savings goals, smart insights, AI voice logging, the AI receipt scanner, AI spending roasts, CSV export, and the Daily Streak with monthly restore.",
  },
] as const;

const ORG_ID = `${SITE}/#organization`;
const APP_ID = `${SITE}/#app`;
const SITE_ID = `${SITE}/#website`;
const FOUNDER_ID = `${SITE}/#founder`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": FOUNDER_ID,
      name: FOUNDER,
      url: SITE,
      jobTitle: "Founder & Software Developer",
    },
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Penny",
      alternateName: ["Penny Personal Finance", "Penny by mypenny.net", "mypenny.net"],
      url: SITE,
      founder: { "@id": FOUNDER_ID },
      description: "Penny is the maker of the minimalist AI personal finance and expense tracker web app at mypenny.net.",
      disambiguatingDescription:
        "Penny (https://mypenny.net), founded by Yessine Ghariani, is an independent consumer personal finance and budgeting application, distinct from any enterprise software or developer AI memory tools.",
      contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: CONTACT_EMAIL },
    },
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      url: SITE,
      name: "Penny",
      alternateName: "Penny Personal Finance Tracker",
      inLanguage: "en",
      publisher: { "@id": ORG_ID },
      creator: { "@id": FOUNDER_ID },
    },
    {
      "@type": "SoftwareApplication",
      "@id": APP_ID,
      name: "Penny",
      alternateName: ["Penny Personal Finance Tracker", "MyPenny Finance App"],
      url: SITE,
      applicationCategory: "FinanceApplication",
      applicationSubCategory: "Personal Finance, Expense Tracker, Budget Planner",
      operatingSystem: "Web, iOS, Android, macOS, Windows (Browser-based)",
      inLanguage: "en",
      description:
        "Penny (mypenny.net) is a minimalist AI personal finance tracker. Log expenses by typing, voice, or receipt photo, set monthly budgets, and track savings goals without linking a bank account.",
      disambiguatingDescription:
        "Independent consumer personal finance and expense tracking web application created by Yessine Ghariani and hosted exclusively at https://mypenny.net.",
      featureList: [
        ...FEATURES.map((f) => `${f.h}: ${f.p}`),
        "CSV export of all transactions",
      ],
      author: { "@id": FOUNDER_ID },
      creator: { "@id": FOUNDER_ID },
      publisher: { "@id": ORG_ID },
      offers: [
        {
          "@type": "Offer",
          name: "Penny Free",
          price: "0",
          priceCurrency: "USD",
          url: `${SITE}/#pricing`,
          availability: "https://schema.org/InStock",
          description: "Unlimited transactions, overview dashboard and charts, spending by category, multi-currency display.",
        },
        {
          "@type": "Offer",
          name: "Penny Pro (Lifetime)",
          price: PRO_PRICE,
          priceCurrency: "USD",
          url: `${SITE}/#pricing`,
          availability: "https://schema.org/InStock",
          seller: { "@id": ORG_ID },
          description:
            "One-time payment of $19 USD, no subscription. Unlocks budgets, savings goals, insights, AI voice logging, AI receipt scanner, AI roasts, CSV export, and the Daily Streak.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE}/#faq`,
      url: SITE,
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

const jsonLdString = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />

      <div className="top">
        <Link href="/" className="logo" style={{ color: "inherit", textDecoration: "none" }}>
          Penny<i>.</i>
        </Link>
        <nav>
          <a href="#features" style={{ color: "inherit", textDecoration: "none", padding: "6px 12px" }}>Features</a>
          <a href="#pricing" style={{ color: "inherit", textDecoration: "none", padding: "6px 12px" }}>Pricing</a>
          <a href="#faq" style={{ color: "inherit", textDecoration: "none", padding: "6px 12px" }}>FAQ</a>
        </nav>
        <Link href="/dashboard">
          <button className="p">Open app</button>
        </Link>
      </div>

      <main>
        <div className="card hero" style={{ textAlign: "center", padding: "48px 24px", marginBottom: 14 }}>
          <h3>MYPENNY.NET · AI PERSONAL FINANCE TRACKER</h3>
          <div className="big" style={{ fontSize: "clamp(28px, 5vw, 44px)", margin: "10px 0" }}>
            Money, simplified.
          </div>
          <p className="sub" style={{ maxWidth: 560, margin: "0 auto 20px", fontSize: 15 }}>
            Penny turns your income and expenses into a clear dashboard—with AI voice logging, receipt scanning, budgets that keep you on track, and goals that get you saving.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard"><button className="p">Get started free</button></Link>
            <a href="#pricing"><button className="s">See pricing</button></a>
          </div>
        </div>

        <div id="features" className="grid g2" style={{ marginTop: 14 }}>
          {FEATURES.map((f) => (
            <div className="card" key={f.h}>
              <h3>{f.tag === "Pro" ? `✨ ${f.h} (PRO)` : f.h}</h3>
              <p className="sub" style={{ margin: "6px 0 0", lineHeight: 1.5 }}>{f.p}</p>
            </div>
          ))}
        </div>

        <div id="pricing" className="grid g2" style={{ marginTop: 14 }}>
          <div className="card">
            <h3>FREE PLAN</h3>
            <div className="big">$0 <span className="sub">forever</span></div>
            <p className="sub" style={{ margin: "10px 0" }}>
              ✓ Unlimited transactions<br />
              ✓ Overview dashboard &amp; charts<br />
              ✓ Spending by category<br />
              ✓ Multi-currency display
            </p>
            <Link href="/dashboard"><button className="s" style={{ marginTop: 8 }}>Start free</button></Link>
          </div>

          <div className="card hero">
            <h3>✨ PENNY PRO</h3>
            <div className="big">$19 <span className="sub">one-time payment</span></div>
            <p className="sub" style={{ margin: "10px 0" }}>
              ✓ Everything in Free<br />
              ✓ 🎙️ AI Voice Logging &amp; 📸 Receipt Scanner<br />
              ✓ 💀 AI Spending Roast &amp; Smart Insights<br />
              ✓ Monthly Budgets, Goals, CSV &amp; 🔥 Daily Streak
            </p>
            <Link href="/dashboard"><button className="p" style={{ marginTop: 8 }}>Upgrade in app</button></Link>
          </div>
        </div>

        <div id="faq" className="card" style={{ marginTop: 14 }}>
          <h3>FREQUENTLY ASKED QUESTIONS</h3>
          <div className="grid" style={{ gap: 14, marginTop: 10 }}>
            {FAQS.map((f) => (
              <div key={f.q}>
                <b>{f.q}</b>
                <p className="sub" style={{ margin: "4px 0 0", lineHeight: 1.5 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <footer className="sub" style={{ textAlign: "center", padding: "28px 0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" style={{ color: "inherit" }}>Open App</Link>
            <a href="#features" style={{ color: "inherit" }}>Features</a>
            <a href="#pricing" style={{ color: "inherit" }}>Pricing</a>
            <a href="#faq" style={{ color: "inherit" }}>FAQ</a>
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "inherit" }}>Contact ({CONTACT_EMAIL})</a>
          </div>
          <div>
            © {YEAR} Penny (mypenny.net) · Built by <b style={{ color: "var(--tx)" }}>{FOUNDER}</b>. All rights reserved.
          </div>
        </footer>
      </main>
    </>
  );
}