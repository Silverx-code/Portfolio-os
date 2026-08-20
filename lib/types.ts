export type ProjectCategory = "web" | "mobile" | "backend" | "other";
export type ProjectStatus = "in-progress" | "live" | "archived";

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: ProjectCategory;
  technologies: string[];
  thumbnail_url: string | null;
  live_url: string | null;
  github_url: string | null;
  status: ProjectStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export type EventType =
  | "PAGE_VIEW"
  | "PROJECT_VIEW"
  | "DEMO_CLICK"
  | "GITHUB_CLICK"
  | "CONTACT_CLICK";

export interface AnalyticsEvent {
  id: string;
  event_type: EventType;
  project_id: string | null;
  session_id: string;
  referrer: string | null;
  created_at: string;
}
