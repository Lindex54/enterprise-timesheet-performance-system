import { Check, KeyRound, Plus, ShieldCheck, UsersRound } from "lucide-react";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";

const roles = [
  { name: "Employee", users: 118, description: "Records activities, submits timesheets and views personal performance.", permissions: ["Own activities", "Own timesheets", "Assigned tasks", "Personal reports"] },
  { name: "Supervisor", users: 18, description: "Manages assigned employees and reviews team submissions.", permissions: ["Employee access", "Team activities", "Task assignment", "Timesheet approval"] },
  { name: "HR Administrator", users: 5, description: "Manages workforce records and institutional performance settings.", permissions: ["Employee records", "Organization data", "Performance periods", "Institutional reports"] },
  { name: "Management", users: 4, description: "Reads consolidated institutional dashboards and approved reports.", permissions: ["Executive dashboard", "Consolidated reports", "Department insights", "Read-only access"] },
  { name: "System Administrator", users: 3, description: "Controls accounts, roles, security settings and audit access.", permissions: ["User accounts", "Role assignments", "System settings", "Audit logs"] },
];

export default function AdminRolesPage() {
  return <><AdminPageHeader eyebrow="Authorization" title="Roles & Access Control" description="Define what each type of user can access. Permissions will be enforced by the application, API and organizational data scope." actions={<button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Plus size={18} /> Create role</button>} />
    <section className="grid gap-6 xl:grid-cols-2">{roles.map((role) => <article key={role.name} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div className="flex gap-3"><div className="rounded-xl bg-blue-50 p-3 text-blue-600"><ShieldCheck size={22} /></div><div><h2 className="text-lg font-bold text-slate-900">{role.name}</h2><p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><UsersRound size={15} /> {role.users} assigned users</p></div></div><button className="text-sm font-semibold text-blue-600 hover:text-blue-700">Edit role</button></div><p className="mt-5 text-sm leading-6 text-slate-600">{role.description}</p><div className="mt-5 border-t border-slate-100 pt-5"><p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500"><KeyRound size={15} /> Core permissions</p><div className="grid gap-2 sm:grid-cols-2">{role.permissions.map((permission) => <p key={permission} className="flex items-center gap-2 text-sm text-slate-700"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check size={12} /></span>{permission}</p>)}</div></div></article>)}</section>
    <article className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5"><h3 className="font-bold text-amber-900">Separation of duties</h3><p className="mt-1 text-sm leading-6 text-amber-800">System administrators can manage access but should not approve employee timesheets or alter performance records. Business approval remains with authorized supervisors and HR administrators.</p></article>
  </>;
}
