import { Download, Filter, MoreHorizontal, Search, UserPlus, UsersRound } from "lucide-react";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import AdminStatCard from "../../../components/admin/AdminStatCard";

const users = [
  { initials: "AK", name: "Aaron Kalamya", number: "BU-CD-001", email: "aaron.kalamya@busitema.ac.ug", department: "University Library", role: "Employee", status: "Active" },
  { initials: "GM", name: "Godwin Malinde", number: "BU-ICT-026", email: "godwin.malinde@busitema.ac.ug", department: "University Library", role: "Supervisor", status: "Active" },
  { initials: "BM", name: "Brian Mwarisi", number: "BU-SD-003", email: "brian.mwarisi@busitema.ac.ug", department: "ICT Directorate", role: "Employee", status: "Pending" },
  { initials: "GK", name: "Gerald Kisombo", number: "BU-ME-004", email: "gerald.kisombo@busitema.ac.ug", department: "Planning Directorate", role: "Employee", status: "Inactive" },
  { initials: "JN", name: "Jane Namusoke", number: "BU-HR-011", email: "jane.namusoke@busitema.ac.ug", department: "Human Resources", role: "HR Administrator", status: "Active" },
];

export default function AdminUsersPage() {
  return (
    <>
      <AdminPageHeader eyebrow="Access Management" title="User Accounts" description="Create accounts, assign access roles, manage account status and review users across the institution." actions={<><button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Download size={18} /> Export users</button><button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><UserPlus size={18} /> Add user</button></>} />
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard title="All accounts" value="148" description="Across all campuses" icon={UsersRound} />
        <AdminStatCard title="Active" value="136" description="Able to access the system" icon={UsersRound} tone="emerald" />
        <AdminStatCard title="Pending" value="5" description="Awaiting activation" icon={UsersRound} tone="amber" />
        <AdminStatCard title="Inactive" value="7" description="Access currently disabled" icon={UsersRound} tone="red" />
      </section>
      <section className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" placeholder="Search name, email or employee number..." className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>
          <div className="flex flex-wrap gap-3"><select className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700"><option>All roles</option><option>Employee</option><option>Supervisor</option><option>HR Administrator</option><option>System Administrator</option></select><select className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700"><option>All statuses</option><option>Active</option><option>Pending</option><option>Inactive</option></select><button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700"><Filter size={17} /> Filters</button></div>
        </div>
        <div className="overflow-x-auto"><table className="w-full min-w-250 text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-4">User</th><th className="px-6 py-4">Employee number</th><th className="px-6 py-4">Department</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{users.map((user) => <tr key={user.email} className="hover:bg-slate-50"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{user.initials}</div><div><p className="font-semibold text-slate-900">{user.name}</p><p className="mt-0.5 text-xs text-slate-500">{user.email}</p></div></div></td><td className="px-6 py-4 font-medium text-slate-700">{user.number}</td><td className="px-6 py-4 text-slate-600">{user.department}</td><td className="px-6 py-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{user.role}</span></td><td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.status === "Active" ? "bg-emerald-100 text-emerald-700" : user.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-600"}`}>{user.status}</span></td><td className="px-6 py-4 text-right"><button aria-label={`Manage ${user.name}`} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><MoreHorizontal size={19} /></button></td></tr>)}</tbody></table></div>
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 text-sm text-slate-500"><p>Showing 1–5 of 148 users</p><div className="flex gap-2"><button className="rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-600">Previous</button><button className="rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-600">Next</button></div></div>
      </section>
    </>
  );
}
