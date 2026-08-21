import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import PageViewTracker from "@/components/PageViewTracker";
import TrackedLink from "@/components/TrackedLink";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 0;

export default async function ShowroomPage() {
  const supabase = createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .returns<Project[]>();

  const all = projects ?? [];
  const featured = all.filter((p) => p.featured);
  const rest = all.filter((p) => !p.featured);

  return (
    <>
      <PageViewTracker />
      <Nav />
      <main className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Hero */}
        <section className="py-24 md:py-40 flex flex-col items-center text-center gap-8">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-primary/40 p-1 bg-background shadow-[0_0_40px_rgba(173,198,255,0.25)]">
            {siteConfig.avatarUrl ? (
              <img
                src={siteConfig.avatarUrl}
                alt={siteConfig.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full rounded-full flex items-center justify-center bg-surface-container-high font-sans font-bold text-headline-md text-on-surface">
                {siteConfig.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
          </div>

          <div className="max-w-3xl">
            <h1 className="font-sans font-bold text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
              {siteConfig.name}
            </h1>
            <p className="font-sans text-headline-md text-on-surface-variant max-w-2xl mx-auto mb-2">
              {siteConfig.headline}
            </p>
            <p className="text-body-base text-on-surface-variant max-w-xl mx-auto">
              {siteConfig.subheadline}
            </p>
          </div>

          <a
            href="#projects"
            className="btn-primary shadow-[0_0_20px_rgba(0,90,194,0.4)]"
          >
            Explore my work ↓
          </a>
        </section>

        {/* Featured Work */}
        <section id="projects" className="py-16 border-t border-outline-variant">
          <h2 className="font-sans text-headline-md text-on-surface mb-8">Featured Work</h2>
          {featured.length === 0 && rest.length === 0 && (
            <p className="text-body-base text-on-surface-variant">
              No projects yet — add your first one from{" "}
              <a href="/admin" className="text-primary hover:underline">
                /admin
              </a>
              .
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {rest.length > 0 && (
            <>
              <h3 className="font-sans text-body-base text-on-surface-variant mt-16 mb-6 font-mono text-mono-label">
                ALL PROJECTS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {rest.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* About */}
        <section id="about" className="py-16 border-t border-outline-variant">
          <h2 className="font-sans text-headline-md text-on-surface mb-6">About</h2>
          <p className="text-body-base text-on-surface-variant max-w-2xl mb-6">
            {siteConfig.about}
          </p>
          <div className="flex flex-wrap gap-2">
            {siteConfig.skills.map((skill) => (
              <span
                key={skill}
                className="font-mono text-mono-label text-on-surface px-3 py-1.5 rounded bg-surface-container-high border border-outline-variant"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-16 border-t border-outline-variant">
          <h2 className="font-sans text-headline-md text-on-surface mb-6">Contact</h2>
          <div className="flex flex-wrap gap-4">
            {siteConfig.links.github && (
              <TrackedLink href={siteConfig.links.github} event="GITHUB_CLICK" className="btn-secondary">
                GitHub
              </TrackedLink>
            )}
            {siteConfig.links.linkedin && (
              <TrackedLink href={siteConfig.links.linkedin} event="CONTACT_CLICK" className="btn-secondary">
                LinkedIn
              </TrackedLink>
            )}
            {siteConfig.links.instagram && (
              <TrackedLink href={siteConfig.links.instagram} event="CONTACT_CLICK" className="btn-secondary">
                Instagram
              </TrackedLink>
            )}
            {siteConfig.links.email && (
              <TrackedLink
                href={`mailto:${siteConfig.links.email}`}
                event="CONTACT_CLICK"
                className="btn-secondary"
              >
                Email
              </TrackedLink>
            )}
            {siteConfig.links.cv && (
              <TrackedLink href={siteConfig.links.cv} event="CONTACT_CLICK" className="btn-secondary">
                CV
              </TrackedLink>
            )}
          </div>
        </section>
      </main>
      <Footer
        github={siteConfig.links.github}
        linkedin={siteConfig.links.linkedin}
        email={siteConfig.links.email}
      />
    </>
  );
}
