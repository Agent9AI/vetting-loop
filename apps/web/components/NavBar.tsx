import * as React from 'react';
import Link from 'next/link';
import { SignInButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';

export function NavBar() {
  return (
    <nav className="border-b border-neutral-800 bg-neutral-950 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-lg tracking-tight text-neutral-100 hover:text-emerald-400 transition-colors">
          The Vetting Loop
        </Link>
        <Link href="/nominees" className="text-sm font-mono text-neutral-400 hover:text-neutral-200 transition-colors">
          Active Vettings
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <a href="https://github.com/agent9ai/vetting-loop" target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-neutral-400 hover:text-neutral-200 transition-colors">
          GitHub
        </a>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <div className="text-sm font-medium bg-neutral-100 text-neutral-950 px-3 py-1.5 rounded hover:bg-neutral-200 transition-colors">
            <SignInButton mode="modal" />
          </div>
        </SignedOut>
      </div>
    </nav>
  );
}
