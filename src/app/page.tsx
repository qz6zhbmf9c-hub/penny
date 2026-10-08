import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight, Check, Download, LineChart, Lock, PiggyBank,
  PieChart, ReceiptText, ShieldCheck, Sparkles, Target, Wallet,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Penny – Money, simplified",
  description:
    "Track every transaction, set monthly budgets and reach your savings goals with Penny, a simple personal finance dashboard.",
};

const FEATURES = [
  {
    icon: ReceiptText,
    title: "Transactions",
    text: "Log income and expenses in seconds. Search, filter by category and see exactly where your money goes.",
    tag: "Free",
  },
  {
    icon: PieChart,
    title: "Budgets",
    text: "Set a monthly limit for each category and watch progress bars warn you before you overspend.",
    tag: "Pro",
  },
  {
    icon: Target,
    title: "Savings goals",
    text: "Create goals like an emergency fund or a trip, add money as you go and track your progress.",
    tag: "Pro",
  },
];

const PRO_PERKS = [
  { icon: Wallet, text: "Monthly budgets for every category" },
  { icon: PiggyBank, text: "Unlimited savings goals with progress tracking" },
  { icon: Sparkles, text: "Smart insights and month-end spending forecast" },
  { icon: Download, text: "CSV export of all your transactions" },
];

function DashboardPreview() {
  const bars = [38, 62, 48, 80, 66, 96];
  return (
    <div className="relative mx-auto mt-16 max-w-4xl">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-indigo-500/30 to-violet-500/30 blur-3xl" />
      <div className="relative rounded-2xl border border-[#272b38] bg-[#171a23]/90 p-4 shadow-2xl backdrop-blur sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400/70" />
          <span className="h-3 w-3 rounded-full bg-amber-400/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
          <span className="ml-3 text-xs text-[#8f97a8]">Penny · Overview</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="col-span-2 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-400 p-4 text-[#0d0f15] sm:col-span-1">
            <div className="text-xs font-semibold uppercase tracking-wide opacity-70">Balance</div>
            <div className="mt-1 text-2xl font-extrabold">$12,480</div>
          </div>
          {[
            ["Income", "$3,400", "text-emerald-400"],
            ["Spending", "$2,115", "text-[#eef0f6]"],
            ["Savings rate", "38%", "text-emerald-400"],
          ].map(([l, v, c]) => (
            <div key={l} className="rounded-xl border border-[#272b38] bg-[#0d0f15] p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-[#8f97a8]">{l}</div>
              <div className={`mt-1 text-2xl font-extrabold ${c}`}>{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[#272b38] bg-[#0d0f15] p-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8f97a8]">Last 6 months</div>
            <div className="flex h-24 items-end gap-3">
              {bars.map((h, i) => (
                <div key={i} className="flex-1 rounded-md bg-gradient-to-t from-indigo-500 to-violet-400" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-[#272b38] bg-[#0d0f15] p-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8f97a8]">Budgets</div>
            {[
              ["Food", 72, "bg-amber-400"],
              ["Transport", 45, "bg-cyan-400"],
              ["Fun", 91, "bg-pink-400"],
            ].map(([n, p, c]) => (
              <div key={n as string} className="mb-3 last:mb-0">
                <div className="mb-1 flex justify-between text-xs text-[#8f97a8]"><span>{n}</span><span>{p}%</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-[#272b38]">
                  <div className={`h-full rounded-full ${c}`} style={{ width: `${p}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d0f15] text-[#eef0f6] antialiased selection:bg-indigo-400/30">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[#272b38]/70 bg-[#0d0f15]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            Penny<span className="bg-gradient-to-br from-indigo-400 to-violet-400 bg-clip-text text-transparent">.</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-[#8f97a8] md:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#pricing" className="transition hover:text-white">Pricing</a>
          </nav>
          <Link href="/dashboard" className="rounded-xl bg-gradient-to-br from-indigo-400 to-violet-400 px-4 py-2 text-sm font-semibold text-[#0d0f15] transition hover:opacity-90">
            Open dashboard
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-5 pb-24 pt-20 sm:pt-28">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />
          <div className="relative mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#272b38] bg-[#171a23] px-3 py-1 text-xs font-medium text-[#8f97a8]">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" /> Personal finance, without the spreadsheet
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
              Know where your money goes.{" "}
              <span className="bg-gradient-to-br from-indigo-400 to-violet-400 bg-clip-text text-transparent">Keep more of it.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-[#8f97a8]">
              Penny turns your income and expenses into a clear dashboard, with budgets that keep you on track and goals that get you saving.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/dashboard" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-400 px-6 py-3 font-semibold text-[#0d0f15] shadow-lg shadow-indigo-500/20 transition hover:opacity-90">
                Get started free <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <a href="#pricing" className="rounded-xl border border-[#272b38] bg-[#171a23] px-6 py-3 font-semibold transition hover:border-indigo-400/50">
                See pricing
              </a>
            </div>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-[#8f97a8]">
              <ShieldCheck className="h-4 w-4" /> Sign in with Google. No credit card required.
            </p>
          </div>
          <DashboardPreview />
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Everything you need to take control</h2>
            <p className="mt-3 text-[#8f97a8]">Three simple tools that work together, with no bank linking or complicated setup.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text, tag }) => (
              <div key={title} className="group rounded-2xl border border-[#272b38] bg-[#171a23] p-6 transition hover:-translate-y-1 hover:border-indigo-400/50">
                <div className="flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-400 text-[#0d0f15]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tag === "Pro" ? "bg-violet-400/15 text-violet-300" : "bg-emerald-400/15 text-emerald-300"}`}>{tag}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8f97a8]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-4xl scroll-mt-20 px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Simple pricing</h2>
            <p className="mt-3 text-[#8f97a8]">Start free. Upgrade once, with no subscription.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {/* Free */}
            <div className="rounded-2xl border border-[#272b38] bg-[#171a23] p-7">
              <h3 className="text-lg font-bold">Free</h3>
              <div className="mt-3 text-4xl font-extrabold">$0</div>
              <p className="mt-1 text-sm text-[#8f97a8]">For getting a clear picture.</p>
              <ul className="mt-6 space-y-3 text-sm">
                {["Unlimited transactions", "Overview dashboard & charts", "Spending by category", "Multi-currency support"].map((t) => (
                  <li key={t} className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 flex-none text-emerald-400" />{t}</li>
                ))}
              </ul>
              <Link href="/dashboard" className="mt-8 block rounded-xl border border-[#272b38] py-3 text-center font-semibold transition hover:border-indigo-400/50">
                Start for free
              </Link>
            </div>
            {/* Pro */}
            <div className="relative rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-400 p-[1.5px]">
              <div className="h-full rounded-[calc(1rem-1px)] bg-[#171a23] p-7">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-bold"><Sparkles className="h-4 w-4 text-violet-400" /> Pro</h3>
                  <span className="rounded-full bg-violet-400/15 px-2.5 py-0.5 text-xs font-semibold text-violet-300">One-time payment</span>
                </div>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-4xl font-extrabold">$19</span>
                  <span className="pb-1 text-sm text-[#8f97a8]">once, yours for good</span>
                </div>
                <p className="mt-1 text-sm text-[#8f97a8]">Everything in Free, plus:</p>
                <ul className="mt-6 space-y-3 text-sm">
                  {PRO_PERKS.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3"><Icon className="mt-0.5 h-4 w-4 flex-none text-violet-400" />{text}</li>
                  ))}
                </ul>
                <Link href="/dashboard" className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-400 py-3 text-center font-semibold text-[#0d0f15] transition hover:opacity-90">
                  <Lock className="h-4 w-4" /> Get Pro
                </Link>
                <p className="mt-3 text-center text-xs text-[#8f97a8]">Secure checkout by Lemon Squeezy.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 pb-24">
          <div className="mx-auto max-w-4xl rounded-3xl border border-[#272b38] bg-gradient-to-br from-indigo-500/15 to-violet-500/15 px-6 py-14 text-center">
            <LineChart className="mx-auto h-8 w-8 text-violet-300" />
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Start saving smarter today</h2>
            <p className="mx-auto mt-3 max-w-md text-[#8f97a8]">Create your free account in under a minute.</p>
            <Link href="/dashboard" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-400 px-6 py-3 font-semibold text-[#0d0f15] transition hover:opacity-90">
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#272b38]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-[#8f97a8] sm:flex-row">
          <div>© 2026 Penny by Yessine Ghariani. Built in Sfax, Tunisia. All rights reserved.</div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/privacy" className="transition hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="transition hover:text-white">Terms of Service</Link>
            <Link href="/refund" className="transition hover:text-white">Refund Policy</Link>
            <a href="mailto:supportapp.penny@gmail.com" className="transition hover:text-white">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}