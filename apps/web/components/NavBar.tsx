"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

// ── Shield / Check Icon ───────────────────────────────────────────────────────

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.75}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
      />
    </svg>
  );
}

// ── Hamburger Icon ────────────────────────────────────────────────────────────

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.75}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.75}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}

// ── NavLink ───────────────────────────────────────────────────────────────────

function NavLink({
  href,
  external,
  children,
  onClick,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const cls =
    "font-mono text-sm text-neutral-400 hover:text-emerald-400 transition-colors";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} onClick={onClick}>
      {children}
    </Link>
  );
}

// ── NavBar ────────────────────────────────────────────────────────────────────

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
      <nav
        className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-neutral-100 hover:text-emerald-400 transition-colors"
          aria-label="The Vetting Loop — Home"
        >
          <ShieldCheckIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span className="font-bold text-base tracking-tight whitespace-nowrap">
            The Vetting Loop
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="/about">About</NavLink>
          <NavLink href="/#active">Active Vettings</NavLink>
          <NavLink
            href="https://github.com/Agent9AI/vetting-loop"
            external
          >
            GitHub
          </NavLink>
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-7 h-7",
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <div className="text-sm font-medium font-mono bg-emerald-600 hover:bg-emerald-500 text-neutral-950 px-3 py-1.5 rounded transition-colors cursor-pointer">
              <SignInButton mode="modal" />
            </div>
          </SignedOut>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-neutral-400 hover:text-neutral-200 transition-colors p-1"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <CloseIcon className="w-5 h-5" />
          ) : (
            <HamburgerIcon className="w-5 h-5" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950 px-6 py-4 space-y-4">
          <NavLink href="/about" onClick={closeMobile}>
            About
          </NavLink>
          <NavLink href="/#active" onClick={closeMobile}>
            Active Vettings
          </NavLink>
          <NavLink
            href="https://github.com/Agent9AI/vetting-loop"
            external
            onClick={closeMobile}
          >
            GitHub
          </NavLink>
          <div className="pt-2 border-t border-neutral-800">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <div className="inline-block text-sm font-medium font-mono bg-emerald-600 hover:bg-emerald-500 text-neutral-950 px-3 py-1.5 rounded transition-colors cursor-pointer">
                <SignInButton mode="modal" />
              </div>
            </SignedOut>
          </div>
        </div>
      )}
    </header>
  );
}
