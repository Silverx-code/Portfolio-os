"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="bg-surface-container hidden lg:flex flex-col h-screen fixed left-0 top-0 w-64 p-4 border-r border-outline-variant z-50">
      <div className="mb-8">
        <h1 className="font-sans font-bold text-headline-md text-primary">Portfolio Admin</h1>
        <p className="font-mono text-mono-label text-on-surface-variant mt-2">System Controller</p>
      </div>
      <ul className="space-y-2 flex-grow">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg font-mono text-mono-label transition-all ${
                  active
                    ? "bg-primary-container text-on-primary-container"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto border-t border-outline-variant pt-4">
        <Link href="/admin/projects/new" className="btn-primary w-full mb-2">
          + Add Project
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-on-surface-variant p-3 hover:bg-surface-container-high hover:text-on-surface transition-all rounded-lg font-mono text-mono-label w-full"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
