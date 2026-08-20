import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-grow lg:ml-64 p-margin-mobile md:p-margin-desktop w-full max-w-max-width mx-auto">
        {children}
      </main>
    </div>
  );
}
