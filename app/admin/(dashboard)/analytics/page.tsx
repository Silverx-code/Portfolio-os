import { createClient } from "@/lib/supabase/server";
import type { AnalyticsEvent, Project } from "@/lib/types";

export const revalidate = 0;

function topN(counts: Map<string, number>, n = 10) {
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

export default async function AnalyticsPage() {
  const supabase = createClient();
  const [{ data: events }, { data: projects }] = await Promise.all([
    supabase.from("analytics_events").select("*").returns<AnalyticsEvent[]>(),
    supabase.from("projects").select("*").returns<Project[]>(),
  ]);

  const allEvents = events ?? [];
  const projectsById = new Map((projects ?? []).map((p) => [p.id, p.title]));

  const visitorCount = new Set(allEvents.map((e) => e.session_id)).size;

  const viewsByProject = new Map<string, number>();
  const clicksByProject = new Map<string, number>();
  const byReferrer = new Map<string, number>();

  allEvents.forEach((e) => {
    if (e.event_type === "PROJECT_VIEW" && e.project_id) {
      const name = projectsById.get(e.project_id) ?? "Unknown";
      viewsByProject.set(name, (viewsByProject.get(name) ?? 0) + 1);
    }
    if (e.event_type === "DEMO_CLICK" && e.project_id) {
      const name = projectsById.get(e.project_id) ?? "Unknown";
      clicksByProject.set(name, (clicksByProject.get(name) ?? 0) + 1);
    }
    if (e.event_type === "PAGE_VIEW") {
      const ref = e.referrer && e.referrer !== "" ? e.referrer : "Direct";
      const bucket = /instagram/i.test(ref)
        ? "Instagram"
        : /linkedin/i.test(ref)
        ? "LinkedIn"
        : /whatsapp/i.test(ref)
        ? "WhatsApp"
        : ref === "Direct"
        ? "Direct"
        : "Other";
      byReferrer.set(bucket, (byReferrer.get(bucket) ?? 0) + 1);
    }
  });

  const sections = [
    { title: "Which projects did they view?", rows: topN(viewsByProject) },
    { title: "Which demos did they click?", rows: topN(clicksByProject) },
    { title: "Where did visitors come from?", rows: topN(byReferrer) },
  ];

  return (
    <>
      <header className="mb-10 border-b border-outline-variant pb-6">
        <h1 className="font-sans font-bold text-headline-lg-mobile md:text-headline-lg text-on-surface">
          Analytics
        </h1>
        <p className="font-mono text-mono-label text-on-surface-variant mt-2">
          {visitorCount} visitors // {allEvents.length} events tracked
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {sections.map((section) => (
          <div key={section.title} className="card p-6">
            <h2 className="font-mono text-mono-label text-on-surface-variant mb-6">
              {section.title.toUpperCase()}
            </h2>
            <div className="space-y-3">
              {section.rows.length === 0 && (
                <p className="text-body-sm text-on-surface-variant">No data yet.</p>
              )}
              {section.rows.map(([label, count]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-body-base text-on-surface">{label}</span>
                  <span className="font-mono text-mono-label text-primary">{count}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
