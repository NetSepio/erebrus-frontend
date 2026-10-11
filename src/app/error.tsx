"use client";

import Link from "next/link";
import { ActionButton, Card } from "@/components/v3/ui";

export default function PageError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-12">
      <Card className="p-6 text-center">
        <h1 className="text-xl font-semibold">This page could not be displayed</h1>
        <p role="alert" className="mt-3 text-sm leading-relaxed text-[var(--text-2)]">
          Try loading it again. If you were completing a payment, check workspace billing before starting another purchase.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <ActionButton onClick={reset}>Try again</ActionButton>
          <Link href="/workspace" className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--accent-hi)] underline">Open workspaces</Link>
          <Link href="/" className="inline-flex min-h-11 items-center text-sm text-[var(--text-2)] underline">Home</Link>
        </div>
      </Card>
    </div>
  );
}
