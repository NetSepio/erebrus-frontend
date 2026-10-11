import { Suspense } from "react";
import { BillingReturnContent } from "@/components/v3/billing/BillingReturnContent";

export default function BillingReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-[var(--text-2)]">
          Loading billing status…
        </div>
      }
    >
      <BillingReturnContent />
    </Suspense>
  );
}
