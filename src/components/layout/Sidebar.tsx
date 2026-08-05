"use client";

import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  FileText,
  Gauge,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Gauge,
  },
  {
    name: "Daily Activities",
    href: "/activities",
    icon: ClipboardList,
  },
  {
    name: "Weekly Activities",
    href: "/weekly-activities",
    icon: CalendarDays,
  },
  {
    name: "Task Tracker",
    href: "/task-tracker",
    icon: CheckSquare,
  },
  {
    name: "Performance",
    href: "/performance",
    icon: BarChart3,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    name: "Printable Timesheet",
    href: "/printable-timesheet",
    icon: FileText,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-slate-950 text-white lg:flex">
      <div className="border-b border-slate-800 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 font-bold">
            TP
          </div>

          <div>
            <h1 className="text-sm font-semibold">Timesheet System</h1>
            <p className="text-xs text-slate-400">Performance Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {/* <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Main menu
        </p> */}

        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  );
}
