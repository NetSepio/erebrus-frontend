"use client";

import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { accentButtonClass, Card, Eyebrow } from "@/components/v3/ui";

export type PaymentResultStatus = "success" | "failure";

const STATUS_UI: Record<
  PaymentResultStatus,
  {
    icon: React.ReactNode;
    color: string;
    title: string;
    description: string;
    primary: { href: string; label: string };
    secondary: { href: string; label: string };
  }
> = {
  success: {
    icon: <CheckCircle2 className="h-7 w-7" />,
    color: "var(--success)",
    title: "Payment successful",
    description:
      "Your payment went through and your plan is being activated. You can track access and billing from your dashboard.",
    primary: { href: "/dashboard", label: "Go to dashboard" },
    secondary: { href: "/subscribe", label: "View plan" },
  },
  failure: {
    icon: <XCircle className="h-7 w-7" />,
    color: "var(--danger)",
    title: "Payment failed",
    description:
      "We couldn't complete your payment and no subscription was activated. You can safely try again.",
    primary: { href: "/pricing", label: "Try again" },
    secondary: { href: "/dashboard", label: "Back to dashboard" },
  },
};

/**
 * Presentational post-payment result card. `status` is supplied by the caller —
 * this component performs no status resolution, auth, or session access.
 */
export function PaymentResultContent({
  status,
  reference,
}: {
  status: PaymentResultStatus;
  reference?: string | null;
}) {
  const ui = STATUS_UI[status];
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 text-center sm:py-16">
      <Card className="p-5 sm:p-8">
        <div role="status" aria-live="polite" aria-atomic="true">
          <div
            aria-hidden="true"
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              color: ui.color,
              background: `color-mix(in srgb, ${ui.color} 12%, transparent)`,
              boxShadow: `0 0 28px color-mix(in srgb, ${ui.color} 25%, transparent)`,
            }}
          >
            {ui.icon}
          </div>
          <Eyebrow className="mb-2">Payment</Eyebrow>
          <h1 className="text-xl font-semibold tracking-tight">{ui.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-2)]">
            {ui.description}
          </p>
        </div>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={ui.primary.href} className={accentButtonClass("primary", "w-full sm:w-auto")}>
            {ui.primary.label}
          </Link>
          <Link href={ui.secondary.href} className={accentButtonClass("ghost", "w-full sm:w-auto")}>
            {ui.secondary.label}
          </Link>
        </div>
        {reference && (
          <p className="mt-6 break-all font-mono text-[10px] text-[var(--text-3)]">
            Reference: {reference}
          </p>
        )}
      </Card>
    </div>
  );
}
