import type { ReactNode } from "react";
import MeSidebar from "../../components/me/MeSidebar";
import MeTopbar from "../../components/me/MeTopbar";

export default function MeLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-slate-100 [font-family:var(--font-geist-sans)]"><MeSidebar /><div className="lg:pl-64"><MeTopbar /><main className="p-5 lg:p-8">{children}</main></div></div>;
}
