"use client";

import { track } from "@/lib/analytics";
import type { EventType } from "@/lib/types";

export default function TrackedLink({
  href,
  event,
  projectId,
  className,
  children,
}: {
  href: string;
  event: EventType;
  projectId?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={() => track(event, projectId)}
    >
      {children}
    </a>
  );
}
