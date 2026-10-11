"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { OrgDetailPanel } from "@/components/v3/workspace/OrgDetailPanel";

function OrgDetailPageInner() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") ?? undefined;
  if (!id) return null;
  return <OrgDetailPanel orgId={id} initialTab={initialTab} />;
}

export default function OrgDetailPage() {
  return (
    <Suspense fallback={null}>
      <OrgDetailPageInner />
    </Suspense>
  );
}
