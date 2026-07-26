import { Bell, Menu, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="flex h-18 items-center justify-between px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </button>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Employee Dashboard
            </h2>
            <p className="hidden text-sm text-slate-500 sm:block">
              Monitor your activities, tasks and monthly performance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              placeholder="Search..."
              className="w-64 rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="button"
            className="relative rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              AG
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">
                Godwin Malinde
              </p>
              <p className="text-xs text-slate-500">ICT Fellow</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}