import type { ReactNode } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 [font-family:var(--font-geist-sans)]">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminTopbar />
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
