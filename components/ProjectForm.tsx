"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Project, ProjectCategory, ProjectStatus } from "@/lib/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = Boolean(project);

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(project?.description ?? "");
  const [category, setCategory] = useState<ProjectCategory>(project?.category ?? "web");
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? "in-progress");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [liveUrl, setLiveUrl] = useState(project?.live_url ?? "");
  const [githubUrl, setGithubUrl] = useState(project?.github_url ?? "");
  const [technologies, setTechnologies] = useState<string[]>(project?.technologies ?? []);
  const [techInput, setTechInput] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(project?.thumbnail_url ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function addTech() {
    const value = techInput.trim();
    if (value && !technologies.includes(value)) {
      setTechnologies([...technologies, value]);
    }
    setTechInput("");
  }

  function removeTech(tech: string) {
    setTechnologies(technologies.filter((t) => t !== tech));
  }

  function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let thumbnail_url = project?.thumbnail_url ?? null;

      if (thumbnailFile) {
        const ext = thumbnailFile.name.split(".").pop();
        const path = `${slug || crypto.randomUUID()}-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("project-thumbnails")
          .upload(path, thumbnailFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: publicUrl } = supabase.storage.from("project-thumbnails").getPublicUrl(path);
        thumbnail_url = publicUrl.publicUrl;
      }

      const payload = {
        title,
        slug,
        description,
        category,
        status,
        featured,
        live_url: liveUrl || null,
        github_url: githubUrl || null,
        technologies,
        thumbnail_url,
      };

      if (isEdit && project) {
        const { error: updateError } = await supabase.from("projects").update(payload).eq("id", project.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("projects").insert(payload);
        if (insertError) throw insertError;
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-gutter pb-24 md:pb-0">
      {/* Main column */}
      <div className="lg:col-span-2 space-y-8 card p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label-base" htmlFor="title">
              Project Name
            </label>
            <input
              id="title"
              className="input-base"
              placeholder="e.g. SilverLink"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-base" htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              className="input-base"
              placeholder="e.g. silverlink"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              required
            />
            <p className="help-text">Used for the URL path: /projects/{slug || "your-slug"}</p>
          </div>
        </div>

        <div>
          <label className="label-base" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="input-base resize-none"
            rows={5}
            placeholder="Detailed project overview..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="label-base">Thumbnail</label>
          <label
            htmlFor="thumbnail"
            className="w-full h-48 border-2 border-dashed border-outline-variant rounded-lg bg-[#0F0F0F] flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden relative"
          >
            {thumbnailPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <p className="text-body-sm text-on-surface-variant">Click to upload</p>
                <p className="font-mono text-mono-label text-outline mt-1">1920×1080 recommended</p>
              </>
            )}
            <input id="thumbnail" type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label-base" htmlFor="liveUrl">
              Live URL
            </label>
            <input
              id="liveUrl"
              type="url"
              className="input-base"
              placeholder="https://..."
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="label-base" htmlFor="githubUrl">
              GitHub URL
            </label>
            <input
              id="githubUrl"
              type="url"
              className="input-base"
              placeholder="https://github.com/..."
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Sidebar column */}
      <div className="space-y-6">
        <div className="card p-6">
          <h3 className="font-sans text-headline-md text-on-surface mb-6">Status</h3>
          <div className="space-y-4">
            <div>
              <label className="label-base" htmlFor="status">
                Project Status
              </label>
              <select
                id="status"
                className="input-base"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              >
                <option value="in-progress">In Progress</option>
                <option value="live">Live</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="pt-4 border-t border-outline-variant">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                  />
                  <div className="w-10 h-6 bg-[#0F0F0F] border border-outline-variant rounded-full peer-checked:bg-primary peer-checked:border-primary transition-all" />
                  <div className="absolute left-1 top-1 w-4 h-4 bg-outline-variant rounded-full peer-checked:translate-x-4 peer-checked:bg-[#00285d] transition-all" />
                </div>
                <span className="text-body-base text-on-surface">Featured Project</span>
              </label>
              <p className="help-text ml-[52px]">Show on home page</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-sans text-headline-md text-on-surface mb-6">Taxonomy</h3>
          <div className="space-y-6">
            <div>
              <label className="label-base" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                className="input-base"
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
              >
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="backend">Backend</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label-base" htmlFor="technologies">
                Technologies
              </label>
              <input
                id="technologies"
                className="input-base mb-2"
                placeholder="Add tag + Enter"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTech();
                  }
                }}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-surface-container-high border border-outline-variant font-mono text-mono-label text-on-surface"
                  >
                    {tech}
                    <button type="button" onClick={() => removeTech(tech)} className="hover:text-error transition-colors">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && <p className="text-body-sm text-error font-mono">{error}</p>}

        <div className="hidden md:flex gap-4">
          <button type="button" onClick={() => router.back()} className="btn-secondary flex-1">
            Discard
          </button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? "Saving…" : "Save Project"}
          </button>
        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container p-4 border-t border-outline-variant z-40 flex gap-4">
        <button type="button" onClick={() => router.back()} className="btn-secondary flex-1">
          Discard
        </button>
        <button type="submit" disabled={saving} className="btn-primary flex-1">
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
