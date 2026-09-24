import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

// ── Fonts ─────────────────────────────────────────────────────────────────────

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// ── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "The Vetting Loop | Kenyan Parliamentary Accountability",
  description:
    "Source-linked nominee dossiers, citizen question queues, hearing records, and per-MP vote trails for every public appointment in Kenya. Close the loop between citizens and Parliament.",
  metadataBase: new URL("https://vettingloop.ke"),
  openGraph: {
    title: "The Vetting Loop | Kenyan Parliamentary Accountability",
    description:
      "Close the loop between citizens and Parliament — before the hearing, during, and after the vote.",
    url: "https://vettingloop.ke",
    siteName: "The Vetting Loop",
    locale: "en_KE",
    type: "website",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "The Vetting Loop — Kenyan Parliamentary Accountability",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Vetting Loop | Kenyan Parliamentary Accountability",
    description:
      "Parliamentary vetting accountability for Kenya. Nominee dossiers, citizen questions, hearing records, MP vote trails.",
    images: ["/og-default.jpg"],
  },
};

// ── Google Analytics ──────────────────────────────────────────────────────────
//
// To enable Google Analytics, add your measurement ID to .env.local:
//   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
//
// Then uncomment the <Script> blocks below and import Script from 'next/script'.
//
// import Script from "next/script";
//
// Inside <body>:
//   <Script
//     src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
//     strategy="afterInteractive"
//   />
//   <Script id="ga-init" strategy="afterInteractive">
//     {`
//       window.dataLayer = window.dataLayer || [];
//       function gtag(){dataLayer.push(arguments);}
//       gtag('js', new Date());
//       gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
//     `}
//   </Script>

// ── Layout ────────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        dir="ltr"
        className={`${inter.variable} ${jetbrainsMono.variable}`}
      >
        <body className="bg-[#0a0a0a] text-neutral-100 antialiased font-sans min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-1">{children}</main>

          {/* ── Footer ──────────────────────────────────────────────────── */}
          <footer className="border-t border-neutral-800 bg-neutral-950 py-8 px-6 mt-16">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
              <p className="font-mono text-xs">
                © 2026 The Vetting Loop · Built with{" "}
                <a
                  href="https://agent9.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-400 transition-colors"
                >
                  Agent9
                </a>{" "}
                · MIT License
              </p>
              <nav className="flex items-center gap-5 font-mono text-xs">
                <a
                  href="/about"
                  className="hover:text-neutral-300 transition-colors"
                >
                  About
                </a>
                <a
                  href="/data-policy"
                  className="hover:text-neutral-300 transition-colors"
                >
                  Data Policy
                </a>
                <a
                  href="mailto:corrections@vettingloop.ke"
                  className="hover:text-neutral-300 transition-colors"
                >
                  corrections@vettingloop.ke
                </a>
              </nav>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
