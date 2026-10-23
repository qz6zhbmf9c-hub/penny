import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://mypenny.net"),
  title: {
    default: "Penny: Minimalist AI Personal Finance Tracker",
    template: "%s | Penny",
  },
  description:
    "Penny (mypenny.net) is a minimalist AI personal finance tracker. Log expenses by voice or receipt photo, set monthly budgets, and track savings goals.",
  applicationName: "Penny",
  keywords: [
    "Penny",
    "mypenny.net",
    "personal finance tracker",
    "AI expense tracker",
    "budget planner",
    "AI receipt scanner",
    "voice expense logging",
    "savings goals",
  ],
  authors: [{ name: "Penny", url: "https://mypenny.net" }],
  creator: "Penny",
  publisher: "Penny",
  category: "finance",
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: "/icon.png?v=3",
    apple: "/icon.png?v=3",
  },
  openGraph: {
    type: "website",
    siteName: "Penny",
    url: "https://mypenny.net",
    locale: "en_US",
    title: "Penny: The minimalist AI personal finance tracker",
    description:
      "Log expenses by voice or receipt photo, stay on budget and hit savings goals.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Penny: The minimalist AI personal finance tracker",
    description:
      "Log expenses by voice or receipt photo, stay on budget and hit savings goals.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A1733",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}