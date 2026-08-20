import Link from "next/link";
import ProjectForm from "@/components/ProjectForm";

export default function NewProjectPage() {
  return (
    <>
      <header className="mb-10 border-b border-outline-variant pb-6">
        <Link href="/admin/projects" className="font-mono text-mono-label text-primary hover:underline inline-flex items-center gap-1 mb-4">
          ← Back to Projects
        </Link>
        <h1 className="font-sans font-bold text-headline-lg-mobile md:text-headline-lg text-on-surface">
          New Project
        </h1>
      </header>
      <ProjectForm />
    </>
  );
}
