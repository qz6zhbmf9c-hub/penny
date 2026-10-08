import Link from "next/link";

export default function LandingPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundColor: '#09090b', color: 'white', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
      
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1.5rem', letterSpacing: '-0.05em' }}>
        Penny.
      </h1>
      
      <p style={{ fontSize: '1.125rem', color: '#a1a1aa', maxWidth: '32rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
        Your complete personal finance companion. Track expenses, set monthly budgets, and hit your financial goals effortlessly.
      </p>
      
      <Link 
        href="/dashboard" 
        style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '0.5rem', fontWeight: '600', textDecoration: 'none', transition: 'background-color 0.2s' }}
      >
        Sign in to Dashboard
      </Link>
      
    </main>
  );
}