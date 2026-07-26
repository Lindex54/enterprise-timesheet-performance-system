import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type DashboardShellProps = {
  children: ReactNode;
};

export default function DashboardShell({
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="lg:pl-64">
        <Topbar />

        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}