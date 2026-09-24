import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NavBar } from "@/components/NavBar";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });

// Clerk is optional so the public, read-only pages build and preview without keys.
const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export const metadata: Metadata = {
  title: "The Vetting Loop — Parliamentary Accountability for Kenya",
  description:
    "Source-linked nominee dossiers, citizen question queues, hearing records, and per-MP vote trails for every public appointment in Kenya.",
  openGraph: {
    title: "The Vetting Loop",
    description: "Close the loop between citizens and Parliament — before the hearing, during, and after the vote.",
    url: "https://vettingloop.ke",
    siteName: "The Vetting Loop",
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Vetting Loop",
    description: "Parliamentary vetting accountability for Kenya.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const page = (
    <html lang="en" className={montserrat.variable}>
      <body className="font-sans antialiased">
        <NavBar authEnabled={clerkEnabled} />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
  return clerkEnabled ? <ClerkProvider>{page}</ClerkProvider> : page;
}
