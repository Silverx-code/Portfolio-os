import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/types";
import StatusChip from "@/components/StatusChip";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card overflow-hidden group hover:border-[#404040] hover:-translate-y-0.5 block"
    >
      <div className="relative w-full aspect-video bg-surface-container-high overflow-hidden">
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-mono text-mono-label text-outline">
            NO PREVIEW
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 className="font-sans text-headline-md text-on-surface">{project.title}</h3>
          <StatusChip status={project.status} />
        </div>
        <p className="text-body-base text-on-surface-variant mb-4 line-clamp-2">
          {project.description}
        </p>
        {project.technologies.length > 0 && (
          <p className="font-mono text-mono-label text-outline">
            {project.technologies.join("  ·  ")}
          </p>
        )}
      </div>
    </Link>
  );
}
