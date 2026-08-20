import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";
import Link from "next/link";
import StatusChip from "@/components/StatusChip";
import DeleteProjectButton from "@/components/DeleteProjectButton";

export const revalidate = 0;

export default async function ManageProjectsPage() {
  const supabase = createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Project[]>();

  const allProjects = projects ?? [];

  return (
    <>
      <header className="mb-10 border-b border-outline-variant pb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-sans font-bold text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Projects
          </h1>
          <p className="font-mono text-mono-label text-on-surface-variant mt-2">
            {allProjects.length} total
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary">
          + Add Project
        </Link>
      </header>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-outline-variant font-mono text-mono-label text-on-surface-variant">
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Featured</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allProjects.map((project) => (
              <tr key={project.id} className="border-b border-outline-variant last:border-0">
                <td className="p-4 text-body-base text-on-surface">{project.title}</td>
                <td className="p-4 font-mono text-mono-label text-on-surface-variant">
                  {project.category}
                </td>
                <td className="p-4">
                  <StatusChip status={project.status} />
                </td>
                <td className="p-4 text-body-base text-on-surface-variant">
                  {project.featured ? "Yes" : "—"}
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
                <td colSpan={5} className="p-6 text-center text-body-base text-on-surface-variant">
                  No projects yet — add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
