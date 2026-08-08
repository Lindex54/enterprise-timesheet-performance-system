import type { ReactNode } from "react";
import HrSidebar from "../../components/hr/HrSidebar";
import HrTopbar from "../../components/hr/HrTopbar";

export default function HrLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-slate-100 [font-family:var(--font-geist-sans)]"><HrSidebar /><div className="lg:pl-64"><HrTopbar /><main className="p-5 lg:p-8">{children}</main></div></div>;
}
