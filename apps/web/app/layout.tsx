import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

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
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-neutral-950 text-neutral-100 antialiased">
          <NavBar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
