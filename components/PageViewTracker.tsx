"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export default function PageViewTracker({ projectId }: { projectId?: string }) {
  useEffect(() => {
    track("PAGE_VIEW", projectId);
    if (projectId) track("PROJECT_VIEW", projectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
