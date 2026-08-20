import { createClient } from "@/lib/supabase/server";
import type { Project, AnalyticsEvent } from "@/lib/types";
import Link from "next/link";
import StatusChip from "@/components/StatusChip";
import DeleteProjectButton from "@/components/DeleteProjectButton";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [{ data: projects }, { data: events }] = await Promise.all([
    supabase.from("projects").select("*").order("created_at", { ascending: false }).returns<Project[]>(),
    supabase.from("analytics_events").select("*").returns<AnalyticsEvent[]>(),
  ]);

  const allProjects = projects ?? [];
  const allEvents = events ?? [];

  const visitorCount = new Set(allEvents.map((e) => e.session_id)).size;
  const projectViews = allEvents.filter((e) => e.event_type === "PROJECT_VIEW").length;
  const demoClicks = allEvents.filter((e) => e.event_type === "DEMO_CLICK").length;

  const viewsByProject = new Map<string, number>();
  allEvents
    .filter((e) => e.event_type === "PROJECT_VIEW" && e.project_id)
    .forEach((e) => {
      viewsByProject.set(e.project_id!, (viewsByProject.get(e.project_id!) ?? 0) + 1);
    });

  const stats = [
    { label: "Projects", value: allProjects.length },
    { label: "Visitors", value: visitorCount },
    { label: "Project Views", value: projectViews },
    { label: "Demo Clicks", value: demoClicks },
  ];

  return (
    <>
      <header className="mb-10 border-b border-outline-variant pb-6">
        <h1 className="font-sans font-bold text-headline-lg-mobile md:text-headline-lg text-on-surface">
          Portfolio Admin
        </h1>
        <p className="font-mono text-mono-label text-on-surface-variant mt-2">
          Control Room // Status: Online
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-6">
            <p className="font-mono text-mono-label text-on-surface-variant mb-2">{stat.label.toUpperCase()}</p>
            <p className="font-sans text-headline-lg-mobile text-on-surface">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mb-12">
        <Link href="/admin/projects/new" className="btn-primary">
          + Add Project
        </Link>
        <Link href="/admin/projects" className="btn-secondary">
          Manage Projects
        </Link>
        <Link href="/admin/analytics" className="btn-secondary">
          Analytics
        </Link>
      </div>

      <h2 className="font-sans text-headline-md text-on-surface mb-6">Recent Projects</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-outline-variant font-mono text-mono-label text-on-surface-variant">
              <th className="p-4">Name</th>
              <th className="p-4">Status</th>
              <th className="p-4">Views</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allProjects.slice(0, 8).map((project) => (
              <tr key={project.id} className="border-b border-outline-variant last:border-0">
                <td className="p-4 text-body-base text-on-surface">{project.title}</td>
                <td className="p-4">
                  <StatusChip status={project.status} />
                </td>
                <td className="p-4 text-body-base text-on-surface-variant">
                  {viewsByProject.get(project.id) ?? 0}
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="text-on-surface-variant hover:text-primary transition-colors text-body-sm"
                    >
                      Edit
                    </Link>
                    <DeleteProjectButton projectId={project.id} projectTitle={project.title} />
                  </div>
                </td>
              </tr>
            ))}
            {allProjects.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-body-base text-on-surface-variant">
                  No projects yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
