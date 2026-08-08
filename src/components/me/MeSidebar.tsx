"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Building2,
  ClipboardCheck,
  DatabaseZap,
  FileText,
  Gauge,
  Lightbulb,
  ListTodo,
  LogOut,
  ScrollText,
  SlidersHorizontal,
  Target,
  UserRound,
} from "lucide-react";

const meNavigation = [
  { name: "Dashboard", href: "/me/dashboard", icon: Gauge },
  { name: "Indicators", href: "/me/indicators", icon: SlidersHorizontal },
  { name: "Institutional Targets", href: "/me/targets", icon: Target },
  { name: "Performance Monitoring", href: "/me/monitoring", icon: Activity },
  { name: "All Timesheets", href: "/me/timesheets", icon: ScrollText },
  { name: "All Tasks", href: "/me/tasks", icon: ListTodo },
  { name: "Department Comparison", href: "/me/departments", icon: Building2 },
  { name: "Reporting Compliance", href: "/me/compliance", icon: ClipboardCheck },
  { name: "Data Quality", href: "/me/data-quality", icon: DatabaseZap },
  { name: "M&E Reports", href: "/me/reports", icon: FileText },
  { name: "Recommendations", href: "/me/recommendations", icon: Lightbulb },
  { name: "Profile", href: "/me/profile", icon: UserRound },
];

export default function MeSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-slate-950 text-white lg:flex">
      <div className="flex h-20 items-center border-b border-slate-800 px-6">
        <Link href="/me/dashboard" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
            <BarChart3 size={23} />
          </div>
          <div>
            <p className="font-bold text-white">M&amp;E Workspace</p>
            <p className="text-xs text-slate-400">Monitoring &amp; Evaluation</p>
          </div>
        </Link>
      </div>

      <div className="scrollbar-hidden flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Performance Oversight
        </p>
        <nav className="space-y-2">
          {meNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link key={item.name} href={item.href} className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-900 hover:text-white"}`}>
                <Icon size={19} />{item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800 p-4">
        <Link href="/login" className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-300 transition hover:bg-red-500/10 hover:text-red-400">
          <LogOut size={19} />Logout
        </Link>
      </div>
    </aside>
  );
}
