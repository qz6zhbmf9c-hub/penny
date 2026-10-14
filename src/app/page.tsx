import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "./landing.css";

const SITE = "https://mypenny.net";
const CONTACT_EMAIL = "support@mypenny.net";
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

export default function Home() {
  return (
    <div className="lp">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />

      <header className="lp-head">
        <div className="lp-wrap">
          <Link href="/" className="logo" style={{ textDecoration: "none", color: "inherit" }} aria-label="Penny home">
            Penny<i>.</i>
          </Link>
          <nav className="lp-nav" aria-label="Primary">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <Link href="/dashboard" className="p">Open app</Link>
        </div>
      </header>

      <main>
        <section className="lp-wrap lp-hero" aria-labelledby="hero-title">
          <span className="lp-eyebrow">mypenny.net · AI Personal Finance App</span>
          <h1 id="hero-title">
            Penny: The <span className="lp-grad">minimalist AI</span> personal finance tracker.
          </h1>
          <p className="lp-sub">
            Log expenses by voice or receipt photo, stay on budget and hit your savings goals—with no bank linking, no spreadsheets, and no monthly subscription.
          </p>
          <div className="lp-cta">
            <Link href="/dashboard" className="p big">Get started free</Link>
            <a href="#pricing" className="s big">See pricing</a>
          </div>
          <p className="lp-note">Free forever plan · Pro is a one-time $19 · Sign in with Google or email</p>
        </section>

        <section className="lp-wrap lp-sec" aria-labelledby="what-title">
          <h2 id="what-title">What is Penny?</h2>
          <p className="lp-def">
            <strong>Penny</strong> (mypenny.net) is an independent web-based personal finance and expense tracker. It helps you record income and expenses in any currency, see where your money goes, set monthly category budgets, and hit savings goals. Built-in Gemini AI lets you log transactions hands-free by speaking a sentence or snapping a photo of a receipt.
          </p>
        </section>

        <section id="features" className="lp-wrap lp-sec" aria-labelledby="features-title">
          <h2 id="features-title">Features of the Penny personal finance app</h2>
          <p className="lp-lead">Everything you need to track spending and save more, without the clutter.</p>
          <div className="lp-feats">
            {FEATURES.map((f) => (
              <article className="card" key={f.h}>
                <span className={"lp-tag" + (f.tag === "Pro" ? " pro" : "")}>{f.tag}</span>
                <h3>{f.h}</h3>
                <p>{f.p}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="lp-wrap lp-sec" aria-labelledby="how-title">
          <h2 id="how-title">How Penny works</h2>
          <p className="lp-lead">From first sign-in to your first insight in under a minute.</p>
          <ol className="lp-steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              ["1. Sign in instantly", "Continue with Google or create an account with your email. No credit card or bank login needed."],
              ["2. Log what you spend", "Type it, speak it, or scan a paper receipt. Penny fills in the details and you confirm."],
              ["3. See and save", "Watch your balance, categories, and budgets update in real time, and keep your daily streak alive."],
            ].map(([h, p]) => (
              <li className="card" key={h}>
                <h3>{h}</h3>
                <p>{p}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="pricing" className="lp-wrap lp-sec" aria-labelledby="pricing-title">
          <h2 id="pricing-title">Penny pricing: Free vs Pro</h2>
          <p className="lp-lead">Start free forever. Upgrade once for $19 and keep Pro for life with no subscription.</p>
          <div className="lp-tablewrap">
            <table className="lp-table">
              <caption className="sr">Penny Free plan versus Penny Pro plan feature comparison</caption>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Free<b>$0</b><span>forever</span></th>
                  <th scope="col">Pro<b>$19</b><span>one-time payment</span></th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([name, free, pro]) => (
                  <tr key={name}>
                    <th scope="row">{name}</th>
                    <td>{free ? <><span className="yes" aria-hidden>✓</span><span className="sr">Included</span></> : <><span className="no" aria-hidden>—</span><span className="sr">Not included</span></>}</td>
                    <td>{pro ? <><span className="yes" aria-hidden>✓</span><span className="sr">Included</span></> : <><span className="no" aria-hidden>—</span><span className="sr">Not included</span></>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="lp-cta">
            <Link href="/dashboard" className="s big">Start free</Link>
            <Link href="/dashboard" className="p big">Get Pro for $19</Link>
          </div>
          <p className="lp-note" style={{ textAlign: "center" }}>Secure checkout. One-time payment in USD.</p>
        </section>

        <section id="faq" className="lp-wrap lp-sec" aria-labelledby="faq-title">
          <h2 id="faq-title">Frequently asked questions about Penny</h2>
          <p className="lp-lead">Straight answers about features, pricing, and privacy.</p>
          <div className="lp-faq">
            {FAQS.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary><h3>{f.q}</h3></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="lp-wrap lp-sec">
          <div className="lp-final">
            <h2 style={{ marginBottom: 8 }}>Take control of your money today</h2>
            <p className="lp-lead" style={{ marginBottom: 20 }}>Create your free Penny account in under a minute.</p>
            <Link href="/dashboard" className="p big">Get started free</Link>
          </div>
        </section>
      </main>

      <footer className="lp-foot">
        <div className="lp-wrap">
          <nav aria-label="Legal and navigation">
            <Link href="/dashboard">Open App</Link>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
          </nav>
          <div>
            © {YEAR} Penny (mypenny.net) · Built by <strong style={{ color: "var(--tx)" }}>{FOUNDER}</strong>. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}