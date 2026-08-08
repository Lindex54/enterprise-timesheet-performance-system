import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Server,
  ShieldCheck,
  UserPlus,
  UsersRound,
} from "lucide-react";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import AdminStatCard from "../../../components/admin/AdminStatCard";

const recentUsers = [
  { initials: "AK", name: "Aaron Kalamya", email: "aaron.kalamya@busitema.ac.ug", role: "Employee", status: "Active" },
  { initials: "GM", name: "Godwin Malinde", email: "godwin.malinde@busitema.ac.ug", role: "Supervisor", status: "Active" },
  { initials: "BM", name: "Brian Mwarisi", email: "brian.mwarisi@busitema.ac.ug", role: "Employee", status: "Pending" },
  { initials: "FK", name: "Faculty Administrator", email: "admin@busitema.ac.ug", role: "HR Administrator", status: "Active" },
];

const events = [
  { icon: UserPlus, title: "New employee account created", detail: "Aaron Kalamya · 18 minutes ago", tone: "bg-blue-50 text-blue-600" },
  { icon: ShieldCheck, title: "Supervisor role assigned", detail: "Godwin Malinde · 1 hour ago", tone: "bg-emerald-50 text-emerald-600" },
  { icon: AlertTriangle, title: "Three unsuccessful sign-in attempts", detail: "Security monitor · 2 hours ago", tone: "bg-amber-50 text-amber-600" },
  { icon: Building2, title: "ICT Directorate details updated", detail: "System Administrator · Yesterday", tone: "bg-slate-100 text-slate-600" },
];

export default function AdminDashboardPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="System Administration"
        title="Administrator Dashboard"
        description="Manage user access, organizational records, security controls and the overall health of the timesheet system."
        actions={
          <>
            <Link href="/admin/audit-logs" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <Activity size={18} /> View audit logs
            </Link>
            <Link href="/admin/users" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
              <UserPlus size={18} /> Add user account
            </Link>
          </>
        }
      />

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard title="Total users" value="148" description="136 active user accounts" icon={UsersRound} />
        <AdminStatCard title="Administrators" value="6" description="Users with elevated access" icon={ShieldCheck} tone="emerald" />
        <AdminStatCard title="Pending access" value="5" description="Accounts awaiting activation" icon={Clock3} tone="amber" />
        <AdminStatCard title="System status" value="Healthy" description="All core services operational" icon={Server} tone="emerald" />
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recently added users</h2>
              <p className="mt-1 text-sm text-slate-500">Latest accounts registered in the system</p>
            </div>
            <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">View all <ArrowRight size={16} /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-175 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-6 py-4">User</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentUsers.map((user) => (
                  <tr key={user.email} className="hover:bg-slate-50">
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{user.initials}</div><div><p className="font-semibold text-slate-900">{user.name}</p><p className="mt-0.5 text-xs text-slate-500">{user.email}</p></div></div></td>
                    <td className="px-6 py-4 font-medium text-slate-700">{user.role}</td>
                    <td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{user.status}</span></td>
                    <td className="px-6 py-4"><Link href="/admin/users" className="font-semibold text-blue-600 hover:text-blue-700">Manage</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5"><h2 className="text-lg font-bold text-slate-900">Recent system activity</h2><p className="mt-1 text-sm text-slate-500">Important access and configuration events</p></div>
          <div className="divide-y divide-slate-100">
            {events.map((event) => { const Icon = event.icon; return <div key={event.title} className="flex gap-3 p-5"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${event.tone}`}><Icon size={19} /></div><div><p className="text-sm font-semibold text-slate-900">{event.title}</p><p className="mt-1 text-xs text-slate-500">{event.detail}</p></div></div>; })}
          </div>
        </article>
      </section>

      <section className="mt-7 grid gap-6 md:grid-cols-3">
        <QuickStatus title="Authentication" value="Operational" description="No current authentication incidents." icon={CheckCircle2} />
        <QuickStatus title="Database" value="Connected" description="Last successful health check: just now." icon={Server} />
        <QuickStatus title="Background jobs" value="12 processed" description="No failed system jobs today." icon={Activity} />
      </section>
    </>
  );
}

function QuickStatus({ title, value, description, icon: Icon }: { title: string; value: string; description: string; icon: React.ElementType }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><Icon size={21} /></div><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /></div><p className="mt-4 text-sm font-medium text-slate-500">{title}</p><h3 className="mt-1 text-lg font-bold text-slate-900">{value}</h3><p className="mt-2 text-sm text-slate-500">{description}</p></article>;
}
