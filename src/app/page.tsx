import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-zinc-950 text-white text-center">
      <h1 className="text-6xl font-bold mb-6 tracking-tight">Penny.</h1>
      <p className="text-lg text-zinc-400 max-w-lg mb-8">
        Your complete personal finance companion. Track expenses, set monthly budgets, and hit your financial goals effortlessly.
      </p>
      <Link 
        href="/dashboard" 
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
      >
        Sign in to Dashboard
      </Link>
    </main>
  );
}