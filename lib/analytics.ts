"use client";

import { createClient } from "@/lib/supabase/client";
import type { EventType } from "@/lib/types";

const SESSION_KEY = "portfolio_os_session_id";

// Session id lives only in memory + sessionStorage — no PII, just
// enough to dedupe a single visit for the "visitors" count.
function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export async function track(eventType: EventType, projectId?: string) {
  try {
    const supabase = createClient();
    await supabase.from("analytics_events").insert({
      event_type: eventType,
      project_id: projectId ?? null,
      session_id: getSessionId(),
      referrer: typeof document !== "undefined" ? document.referrer || "Direct" : null,
    });
  } catch {
    // Analytics should never break the visitor's experience.
  }
}
