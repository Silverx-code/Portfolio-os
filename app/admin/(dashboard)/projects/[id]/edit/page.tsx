import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";
import ProjectForm from "@/components/ProjectForm";

export const revalidate = 0;

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single<Project>();

  if (!project) notFound();

  return (
    <>
      <header className="mb-10 border-b border-outline-variant pb-6">
        <Link href="/admin/projects" className="font-mono text-mono-label text-primary hover:underline inline-flex items-center gap-1 mb-4">
          ← Back to Projects
        </Link>
        <h1 className="font-sans font-bold text-headline-lg-mobile md:text-headline-lg text-on-surface">
          Edit {project.title}
        </h1>
      </header>
      <ProjectForm project={project} />
    </>
  );
}
