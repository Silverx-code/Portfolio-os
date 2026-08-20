"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteProjectButton({
  projectId,
  projectTitle,
}: {
  projectId: string;
  projectTitle: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${projectTitle}"? This can't be undone.`)) return;
    setBusy(true);
    await supabase.from("projects").delete().eq("id", projectId);
    setBusy(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      className="text-on-surface-variant hover:text-error transition-colors text-body-sm disabled:opacity-50"
    >
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}
