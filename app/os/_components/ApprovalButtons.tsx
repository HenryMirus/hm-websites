"use client";

import { useTransition } from "react";
import { decideApproval } from "@/app/os/actions";

export default function ApprovalButtons({ approvalId }: { approvalId: string }) {
  const [isPending, startTransition] = useTransition();

  function decide(decision: "approved" | "rejected") {
    startTransition(() => {
      decideApproval(approvalId, decision);
    });
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => decide("approved")}
        disabled={isPending}
        className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium rounded hover:bg-emerald-500/20 disabled:opacity-40 transition-colors"
      >
        Approve
      </button>
      <button
        onClick={() => decide("rejected")}
        disabled={isPending}
        className="px-3 py-1.5 bg-accent/10 border border-accent/30 text-accent text-xs font-medium rounded hover:bg-accent/20 disabled:opacity-40 transition-colors"
      >
        Reject
      </button>
    </div>
  );
}
