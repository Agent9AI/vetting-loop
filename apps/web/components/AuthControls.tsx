import * as React from "react";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

/** Rendered only when a Clerk publishable key is configured. */
export function AuthControls() {
  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <div className="rounded-mz border border-mz-red px-3 py-1.5 text-sm font-semibold text-mz-red hover:bg-mz-red hover:text-white">
          <SignInButton mode="modal" />
        </div>
      </SignedOut>
    </>
  );
}
