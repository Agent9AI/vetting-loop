import * as React from "react";
import Link from "next/link";
import { AuthControls } from "./AuthControls";

const MZ = "https://mzalendo.com";

// Mirrors mzalendo.com's primary navigation so the tool sits naturally
// under "Civic Tech Tools" when embedded.
const MENU: Array<{ label: string; href: string; children?: Array<{ label: string; href: string; badge?: string }> }> = [
  { label: "About", href: `${MZ}/about/` },
  { label: "MPs Performance", href: `${MZ}/mps-performance/` },
  { label: "Elections Watch 2027", href: `${MZ}/elections-2027/` },
  {
    label: "Civic Tech Tools",
    href: "/civic-tech",
    children: [
      { label: "Integrity Index", href: "/integrity", badge: "New" },
      { label: "The Vetting Loop", href: "/" },
      { label: "Promise Tracker", href: "https://tracker.mzalendo.com" },
      { label: "Bonga na Mzalendo", href: `${MZ}/democracy-tools/bonga/` },
      { label: "Hansard", href: `${MZ}/democracy-tools/hansard/` },
    ],
  },
  { label: "Research & Knowledge", href: `${MZ}/research-and-knowledge/` },
  { label: "Contact", href: `${MZ}/contact/` },
];

export function NavBar({ authEnabled = false }: { authEnabled?: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-mz-border bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mz-red text-lg font-extrabold text-white">
            VL
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold text-mz-red">The Vetting Loop</span>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-mz-green">
              Civic Tech Tools · Prototype
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {MENU.map((item) => (
            <li key={item.label} className="group relative">
              <Link
                href={item.href}
                className="block px-3 py-2 text-sm font-medium text-mz-text hover:text-mz-red group-hover:text-mz-red"
              >
                {item.label}
                {item.children && <span className="ml-1 text-[10px] text-mz-muted">▾</span>}
              </Link>
              {item.children && (
                <ul className="invisible absolute left-0 top-full min-w-[240px] rounded-mz border border-mz-border bg-white py-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                  {item.children.map((c) => (
                    <li key={c.label}>
                      <Link href={c.href} className="flex items-center justify-between px-4 py-2 text-sm hover:bg-mz-subtle hover:text-mz-red">
                        {c.label}
                        {c.badge && (
                          <span className="rounded-mz bg-mz-green px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                            {c.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/integrity"
            className="rounded-mz bg-mz-red px-3 py-2 text-sm font-semibold text-white hover:bg-mz-red-dark lg:hidden"
          >
            Integrity Index
          </Link>
          {authEnabled && <AuthControls />}
        </div>
      </nav>
    </header>
  );
}
