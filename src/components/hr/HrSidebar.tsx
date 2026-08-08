"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  FileText,
  Gauge,
  LogOut,
  Network,
  UserRound,
  UsersRound,
} from "lucide-react";

const hrNavigation = [
  { name: "Dashboard", href: "/hr/dashboard", icon: Gauge },
  { name: "Employee Records", href: "/hr/employees", icon: UsersRound },
  { name: "Departments", href: "/hr/departments", icon: Building2 },
  { name: "Reporting Lines", href: "/hr/reporting-lines", icon: Network },
  { name: "Performance Setup", href: "/hr/performance", icon: BarChart3 },
  { name: "HR Reports", href: "/hr/reports", icon: FileText },
  { name: "Profile", href: "/hr/profile", icon: UserRound },
];

export default function HrSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-slate-950 text-white lg:flex">
      <div className="flex h-20 items-center border-b border-slate-800 px-6">
        <Link href="/hr/dashboard" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
            <UsersRound size={23} />
          </div>
          <div>
            <p className="font-bold text-white">HR Workspace</p>
            <p className="text-xs text-slate-400">Timesheet &amp; Performance</p>
          </div>
        </Link>
      </div>

      <div className="scrollbar-hidden flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Human Resources
        </p>
        <nav className="space-y-2">
          {hrNavigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon size={19} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800 p-4">
        <Link
          href="/login"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={19} />
          Logout
        </Link>
      </div>
    </aside>
  );
}
