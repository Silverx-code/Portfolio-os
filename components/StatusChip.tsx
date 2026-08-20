import type { ProjectStatus } from "@/lib/types";

const STYLES: Record<ProjectStatus, { label: string; classes: string }> = {
  live: {
    label: "Live",
    classes: "bg-secondary/10 text-secondary",
  },
  "in-progress": {
    label: "Active",
    classes: "bg-primary/10 text-primary",
  },
  archived: {
    label: "Archived",
    classes: "bg-outline/10 text-outline",
  },
};

export default function StatusChip({ status }: { status: ProjectStatus }) {
  const { label, classes } = STYLES[status];
  return (
    <span className={`status-chip ${classes}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
