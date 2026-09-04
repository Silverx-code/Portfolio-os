import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StatusChip from "@/components/StatusChip";
import PageViewTracker from "@/components/PageViewTracker";
import TrackedLink from "@/components/TrackedLink";
import { siteConfig } from "@/lib/site-config";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", params.slug)
    .single<Project>();

  if (!project) notFound();

  return (
    <>
      <PageViewTracker projectId={project.id} />
      <Nav />
      <main className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-12 pb-24">
        <Link href="/#projects" className="font-mono text-mono-label text-primary hover:underline inline-flex items-center gap-1 mb-8">
          ← Back to Projects
        </Link>

        <div className="flex items-start justify-between gap-6 flex-wrap mb-8">
          <h1 className="font-sans font-bold text-headline-lg-mobile md:text-headline-lg text-on-surface">
            {project.title}
          </h1>
          <StatusChip status={project.status} />
        </div>

        <div className="flex flex-wrap gap-4 mb-12">
          {project.live_url && (
            <TrackedLink href={project.live_url} event="DEMO_CLICK" projectId={project.id} className="btn-primary">
              Click here
            </TrackedLink>
          )}
          {project.github_url && (
            <TrackedLink href={project.github_url} event="GITHUB_CLICK" projectId={project.id} className="btn-secondary">
              GitHub
            </TrackedLink>
          )}
        </div>

        {project.thumbnail_url && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-outline-variant mb-12">
            <Image src={project.thumbnail_url} alt={project.title} fill className="object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="md:col-span-2">
            <h2 className="font-mono text-mono-label text-on-surface-variant mb-3">ABOUT</h2>
            <p className="text-body-base text-on-surface-variant whitespace-pre-line">
              {project.description}
            </p>
          </div>
          <div>
            <h2 className="font-mono text-mono-label text-on-surface-variant mb-3">TECHNOLOGIES</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-mono-label text-on-surface px-3 py-1.5 rounded bg-surface-container-high border border-outline-variant"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer
        github={siteConfig.links.github}
        linkedin={siteConfig.links.linkedin}
        email={siteConfig.links.email}
      />
    </>
  );
}
