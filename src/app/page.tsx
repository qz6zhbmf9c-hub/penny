import type { Metadata } from "next";
import Link from "next/link";
import LiveSandbox from "@/components/LiveSandbox";
import "./globals.css";
import "./landing.css";

const SITE = "https://mypenny.net";
const CONTACT_EMAIL = "supportapp.penny@gmail.com";
const FOUNDER = "Yessine Ghariani";
const YEAR = 2026;
const PRO_PRICE = "19.00";

const SAME_AS: string[] = [];

export const metadata: Metadata = {
  title: { absolute: "Penny: Minimalist AI Personal Finance Tracker | mypenny.net" },
  description:
    "Penny (mypenny.net) is a minimalist AI personal finance and expense tracker by Yessine Ghariani. Log expenses by voice or receipt photo, set monthly budgets, and track savings goals. Free to start, Pro is a one-time $19.",
  applicationName: "Penny",
  authors: [{ name: FOUNDER, url: SITE }],
  creator: FOUNDER,
  icons: {
    icon: "/icon.png?v=3",
    apple: "/icon.png?v=3",
  },
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
    title: "Penny: The minimalist AI personal finance tracker",
    description:
      "Log expenses by voice or receipt photo, stay on budget and hit savings goals. Free to start, one-time $19 Pro upgrade.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Penny: The minimalist AI personal finance tracker",
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

const ROWS: [string, boolean, boolean][] = [
  ["Unlimited transactions", true, true],
  ["Overview dashboard and charts", true, true],
  ["Spending by category", true, true],
  ["Multi-currency display", true, true],
  ["Monthly budgets per category", false, true],
  ["Savings goals", false, true],
  ["Smart spending insights", false, true],
  ["AI voice logging", false, true],
  ["AI receipt scanner", false, true],
  ["AI spending roast", false, true],
  ["CSV export", false, true],
  ["Daily streak with monthly restore", false, true],
];

const FAQS = [
  {
    q: "What is Penny (mypenny.net)?",
    a: "Penny (https://mypenny.net) is an independent minimalist AI personal finance and expense tracker web application created by Yessine Ghariani. You log income and expenses by typing, speaking, or photographing a receipt, then track where your money goes with visual charts, monthly category budgets, and savings goals. Penny is free to start, and Penny Pro is a one-time $19 lifetime upgrade with no recurring subscription.",
  },
  {
    q: "How is Penny different from traditional budgeting apps like YNAB, Copilot, or Rocket Money?",
    a: "Most budgeting apps charge $80 to $120 per year in subscriptions and require linking your private bank login credentials. Penny requires no bank linking for complete privacy and instant setup, uses AI voice and receipt scanning to make manual entry effortless, and charges a single one-time payment of $19 for Pro instead of a monthly subscription.",
  },
  {
    q: "How does AI voice logging work?",
    a: "Tap the microphone in the Transactions tab and say something like “I spent 40 bucks on gas yesterday”. Your browser's speech recognition turns your voice into text, and Google's Gemini AI parses that sentence into an amount, category, note, and date. Penny fills in the form for you to review before saving.",
  },
  {
    q: "How does the AI receipt scanner work?",
    a: "Take or upload a photo of any paper receipt. Penny compresses the image in your browser and uses Gemini Vision AI to extract the merchant name, date, category, and final grand total automatically.",
  },
  {
    q: "How much does Penny Pro cost?",
    a: "Penny Pro is a one-time payment of $19 USD with no subscription. It unlocks monthly budgets, savings goals, smart insights, AI voice logging, the AI receipt scanner, AI spending roasts, CSV export, and the Daily Streak with monthly restore.",
  },
  {
    q: "Is Penny free to use?",
    a: "Yes. The free plan includes unlimited transaction tracking, an overview dashboard with charts, spending by category, and multi-currency display forever. You only pay if you want to unlock the AI and Pro budgeting features.",
  },
  {
    q: "Does Penny connect to my bank account?",
    a: "No. Penny never asks for your bank credentials. You log transactions yourself in seconds via voice, receipt photo, or quick typing, which works globally with any bank or cash currency.",
  },
  {
    q: "What is the Daily Streak?",
    a: "The Daily Streak tracks consecutive days you check in on your finances to build a lasting money habit. Pro members also get a once-a-month streak restore if they miss a day.",
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
      ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
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
      browserRequirements: "Requires JavaScript. Works in Chrome, Safari, Edge, and modern mobile browsers.",
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

const TICKER = [
  "No bank login required",
  "Gemini AI voice logging",
  "Instant receipt vision",
  "Multi-currency support",
  "$19 one-time forever",
  "Zero subscriptions",
];

const STEPS = [
  ["1. Sign in instantly", "Continue with Google or create an account with your email. No credit card or bank login needed."],
  ["2. Log what you spend", "Type it, speak it, or scan a paper receipt. Penny fills in the details and you confirm."],
  ["3. See and save", "Watch your balance, categories, and budgets update in real time, and keep your daily streak alive."],
];

const Mark = ({ on }: { on: boolean }) =>
  on ? (
    <>
      <span className="yes" aria-hidden="true">✓</span>
      <span className="sr">Included</span>
    </>
  ) : (
    <>
      <span className="no" aria-hidden="true">—</span>
      <span className="sr">Not included</span>
    </>
  );

function BentoVisual({ index }: { index: number }) {
  switch (index) {
    case 0:
      return (
        <div className="b-vis b-vis-bars" aria-hidden="true">
          <div className="mini-stat">
            <span>Savings Rate</span>
            <b className="mono pos">+34.2%</b>
          </div>
          <div className="mini-bars">
            <i style={{ height: "38%" }} />
            <i style={{ height: "56%" }} />
            <i style={{ height: "44%" }} />
            <i style={{ height: "78%" }} />
            <i className="hi" style={{ height: "100%" }} />
          </div>
        </div>
      );
    case 1:
      return (
        <div className="b-vis b-vis-wave" aria-hidden="true">
          <div className="mini-wave">
            {Array.from({ length: 9 }, (_, k) => (
              <i key={k} />
            ))}
          </div>
          <span className="mini-pill mono">“$40 on gas” → ⛽ Transport</span>
        </div>
      );
    case 2:
      return (
        <div className="b-vis b-vis-scan" aria-hidden="true">
          <div className="mini-receipt">
            <span className="mini-laser" />
            <div className="mini-r-row">
              <span>WHOLE FOODS</span>
              <b className="mono">$64.80</b>
            </div>
            <div className="mini-r-lines">
              <i />
              <i />
            </div>
          </div>
        </div>
      );
    case 3:
      return (
        <div className="b-vis b-vis-meter" aria-hidden="true">
          <div className="mini-budget">
            <div><span>Groceries</span><b className="mono">$310 / $450</b></div>
            <u className="b-fill ok-fill" style={{ width: "68%" }} />
          </div>
          <div className="mini-budget">
            <div><span>Emergency Goal</span><b className="mono">85%</b></div>
            <u className="b-fill v-fill" style={{ width: "85%" }} />
          </div>
        </div>
      );
    case 4:
      return (
        <div className="b-vis b-vis-streak" aria-hidden="true">
          <div className="streak-days">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, idx) => (
              <span key={idx} className={idx < 6 ? "d-on" : "d-shield"}>
                <b>{d}</b>
                <i>{idx < 6 ? "✓" : "🛡️"}</i>
              </span>
            ))}
          </div>
        </div>
      );
    default:
      return (
        <div className="b-vis b-vis-roast" aria-hidden="true">
          <div className="roast-bubble">
            <span className="mono">AI ROAST · OCT</span>
            <p>“47 iced lattes this month. At this point, buy the espresso machine.”</p>
          </div>
        </div>
      );
  }
}

export default function Home() {
  return (
    <div className="lp">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />

      <header className="nav">
        <div style={{ maxWidth: 980, margin: "0 auto", position: "relative" }}>
          {/* Unclipped logo that floats above the eaten toolbar */}
          <Link href="/" className="brand float-brand" aria-label="Penny home">
            Penny<i>.</i>
            <span className="sparkle" aria-hidden="true">✦</span>
          </Link>

          <div className="pill">
            {/* Hidden placeholder to keep the flexbox layout perfect */}
            <div className="brand" style={{ opacity: 0, pointerEvents: "none", userSelect: "none" }}>Penny<i>.</i></div>
            
            <span className="status">
              <span className="live" aria-hidden="true" />
              Live · Gemini AI
            </span>
            <nav aria-label="Primary">
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
            </nav>
            <Link href="/dashboard" className="btn cta sm">
              Open app
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="aurora" aria-hidden="true">
            <i />
            <i />
          </div>
          <div className="wrap hero-in">
            <span className="eyebrow">mypenny.net · Zero Bank Linking · $19 Lifetime Pro</span>
            <h1 id="hero-title">
              Penny: The <em>minimalist AI</em> personal finance tracker <em>without the bank login</em>.
            </h1>
            <p className="lead">
              Log expenses by voice or receipt photo, stay on budget and hit your savings goals—with no bank linking, no spreadsheets, and no monthly subscription.
            </p>
            <div className="ctas">
              <Link href="/dashboard" className="btn cta">
                Get started free
              </Link>
              <a href="#pricing" className="btn ghost">
                See pricing
              </a>
            </div>
            <ul className="metrics" aria-label="Key facts">
              <li>
                <b className="mono">$0</b>
                <span>to start forever</span>
              </li>
              <li>
                <b className="mono">$19</b>
                <span>Pro, paid once</span>
              </li>
              <li>
                <b className="mono">0</b>
                <span>bank logins required</span>
              </li>
            </ul>
          </div>

          <LiveSandbox />
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="track">
            {[0, 1].map((k) => (
              <ul key={k}>
                {TICKER.map((t) => (
                  <li key={t + k}>{t}</li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <section className="wrap sec" aria-labelledby="what-title">
          <h2 id="what-title">What is Penny?</h2>
          <p className="def">
            <strong>Penny (mypenny.net)</strong> is an independent web-based personal finance and expense tracker built by <strong>{FOUNDER}</strong>. It helps you record income and expenses in any currency, see where your money goes, set monthly category budgets, and hit savings goals. Built-in Gemini AI lets you log transactions hands-free by speaking a sentence or snapping a photo of a receipt—without ever asking for your bank login.
          </p>
        </section>

        <section id="features" className="wrap sec" aria-labelledby="features-title">
          <h2 id="features-title">
            Features of the Penny <em>personal finance</em> app
          </h2>
          <p className="sub">Everything you need to track spending and save more, without the clutter.</p>
          <div className="bento">
            {FEATURES.map((f, i) => (
              <article className={`gl bn b${i + 1}`} key={f.h}>
                <div className="bn-copy">
                  <span className={"tag mono" + (f.tag === "Pro" ? " pro" : "")}>{f.tag}</span>
                  <h3>{f.h}</h3>
                  <p>{f.p}</p>
                </div>
                <BentoVisual index={i} />
              </article>
            ))}
          </div>
        </section>

        <section className="wrap sec" aria-labelledby="how-title">
          <h2 id="how-title">How Penny works</h2>
          <p className="sub">From first sign-in to your first insight in under a minute.</p>
          <ol className="steps">
            {STEPS.map(([h, p], i) => (
              <li className="gl" key={h}>
                <b className="mono num">0{i + 1}</b>
                <h3>{h}</h3>
                <p>{p}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="pricing" className="wrap sec" aria-labelledby="pricing-title">
          <h2 id="pricing-title">
            Penny pricing: Free vs Pro, <em>one-time $19</em>
          </h2>
          <p className="sub">
            Subscription budgeting apps typically charge $80 to $120 every single year. Start Penny free forever, or unlock Pro once for life.
          </p>
          <div className="plans">
            <div className="gl plan">
              <h3>Free Forever</h3>
              <p className="price mono">$0</p>
              <p>Unlimited transactions, overview dashboard, visual charts, and multi-currency support forever.</p>
            </div>
            <div className="gl plan beam">
              <h3>Penny Pro Lifetime</h3>
              <p className="price mono">
                $19 <small>one-time payment</small>
              </p>
              <p>Everything in Free plus Gemini AI voice logging, receipt scanner, budgets, goals, AI roasts, CSV export, and streak restore.</p>
            </div>
          </div>
          <div className="tablewrap">
            <table className="matrix">
              <caption className="sr">Penny Free plan versus Penny Pro plan feature comparison</caption>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">
                    Free <b className="mono">$0</b> <span>forever</span>
                  </th>
                  <th scope="col">
                    Pro <b className="mono">$19</b> <span>one-time</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([name, free, pro]) => (
                  <tr key={name}>
                    <th scope="row">{name}</th>
                    <td>
                      <Mark on={free} />
                    </td>
                    <td>
                      <Mark on={pro} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="ctas">
            <Link href="/dashboard" className="btn ghost">
              Start free
            </Link>
            <Link href="/dashboard" className="btn cta">
              Get Pro for $19
            </Link>
          </div>
          <p className="fine">Secure checkout. One-time payment in USD. No recurring fees.</p>
        </section>

        <section id="faq" className="wrap sec" aria-labelledby="faq-title">
          <h2 id="faq-title">Frequently asked questions about Penny</h2>
          <p className="sub">Straight answers about features, pricing, and privacy.</p>
          <div className="faq">
            {FAQS.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>
                  <h3>{f.q}</h3>
                  <span className="pm" aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="wrap sec">
          <div className="finale">
            <h2>
              Take control of your money, <em>today</em>
            </h2>
            <p className="sub">Create your free Penny account in under a minute.</p>
            <Link href="/dashboard" className="btn cta">
              Get started free
            </Link>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <nav aria-label="Legal and navigation">
            <Link href="/dashboard">Open App</Link>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/refund">Refund Policy</Link>
            <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
          </nav>
          <p>
            © {YEAR} Penny (mypenny.net) · Built by <strong style={{ color: "var(--tx)" }}>{FOUNDER}</strong>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}