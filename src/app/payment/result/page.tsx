"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuroraBackground } from "@/components/v3/AuroraBackground";
import { PaymentResultContent } from "@/components/v3/billing/PaymentResultContent";

function ResultFromParams() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const reference = searchParams.get("reference") ?? searchParams.get("attempt_id");
  return (
    <PaymentResultContent
      status={status === "success" ? "success" : "failure"}
      reference={reference}
    />
  );
}

export default function PaymentResultPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--bg)] text-[var(--text)]">
      <AuroraBackground />
      <main className="relative z-[2] w-full py-12">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 aria-hidden="true" className="h-8 w-8 animate-spin text-[var(--accent)]" />
              <span role="status" className="sr-only">Loading payment result…</span>
            </div>
          }
        >
          <ResultFromParams />
        </Suspense>
      </main>
    </div>
  );
}
