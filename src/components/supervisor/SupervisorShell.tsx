import { ReactNode } from "react";
import SupervisorSidebar from "./SupervisorSidebar";
import SupervisorTopbar from "./SupervisorTopbar";

type SupervisorShellProps = {
  children: ReactNode;
};

export default function SupervisorShell({
  children,
}: SupervisorShellProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <SupervisorSidebar />

      <div className="lg:pl-64">
        <SupervisorTopbar />

        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}