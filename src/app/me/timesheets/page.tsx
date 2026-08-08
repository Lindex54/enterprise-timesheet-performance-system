"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Eye,
  MessageSquareText,
  Search,
  Send,
  UsersRound,
  X,
} from "lucide-react";
import MePageHeader from "../../../components/me/MePageHeader";

type TimesheetStatus = "Submitted" | "Approved" | "Returned" | "Draft";
type ReviewFlag = "Clear" | "M&E Review" | "Change Requested";
type MeComment = { id: number; text: string; type: "Observation" | "Change Requested"; date: string };
type Timesheet = {
  id: number;
  employee: string;
  initials: string;
  employeeNumber: string;
  position: string;
  department: string;
  campus: string;
  period: string;
  hours: number;
  expectedHours: number;
  activities: number;
  submitted: string;
  status: TimesheetStatus;
  supervisor: string;
  supervisorFeedback: string;
  employeeRemarks: string;
  reviewFlag: ReviewFlag;
  comments: MeComment[];
};

const initialTimesheets: Timesheet[] = [
  { id: 1, employee: "Aaron Kalamya", initials: "AK", employeeNumber: "BU-CD-001", position: "Content Developer", department: "University Library", campus: "Busitema Campus", period: "July 2026", hours: 152, expectedHours: 160, activities: 24, submitted: "26 Jul 2026", status: "Submitted", supervisor: "Faculty Librarian", supervisorFeedback: "Awaiting final review.", employeeRemarks: "All planned activities have been recorded.", reviewFlag: "M&E Review", comments: [] },
  { id: 2, employee: "Godwin Malinde", initials: "GM", employeeNumber: "BU-ICT-026", position: "ICT Fellow", department: "University Library", campus: "Busitema Campus", period: "July 2026", hours: 160, expectedHours: 160, activities: 27, submitted: "25 Jul 2026", status: "Approved", supervisor: "Faculty Librarian", supervisorFeedback: "Outputs verified and timesheet approved.", employeeRemarks: "ICT support and system development tasks completed.", reviewFlag: "Clear", comments: [{ id: 1, text: "Outputs are clearly linked to the institutional ICT target.", type: "Observation", date: "26 Jul 2026" }] },
  { id: 3, employee: "Brian Mwarisi", initials: "BM", employeeNumber: "BU-SD-003", position: "Systems Developer", department: "ICT Directorate", campus: "Main Administration", period: "July 2026", hours: 146, expectedHours: 160, activities: 21, submitted: "24 Jul 2026", status: "Returned", supervisor: "Director ICT", supervisorFeedback: "Clarify the output recorded for performance module development.", employeeRemarks: "Development work remains in progress.", reviewFlag: "Change Requested", comments: [{ id: 1, text: "Please quantify the completed module outputs before this record is included in the performance report.", type: "Change Requested", date: "25 Jul 2026" }] },
  { id: 4, employee: "Gerald Kisombo", initials: "GK", employeeNumber: "BU-ME-004", position: "M&E Officer", department: "Planning Directorate", campus: "Main Administration", period: "July 2026", hours: 128, expectedHours: 160, activities: 18, submitted: "Not submitted", status: "Draft", supervisor: "Director Planning", supervisorFeedback: "No review yet.", employeeRemarks: "Timesheet is still being completed.", reviewFlag: "Clear", comments: [] },
  { id: 5, employee: "Jane Namusoke", initials: "JN", employeeNumber: "BU-HR-011", position: "HR Officer", department: "Human Resources", campus: "Main Administration", period: "July 2026", hours: 160, expectedHours: 160, activities: 25, submitted: "25 Jul 2026", status: "Approved", supervisor: "Director Human Resources", supervisorFeedback: "Approved with all supporting records.", employeeRemarks: "Monthly HR activities completed.", reviewFlag: "Clear", comments: [] },
];

export default function MeTimesheetsPage() {
  const [timesheets, setTimesheets] = useState(initialTimesheets);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [department, setDepartment] = useState("All");
  const [comment, setComment] = useState("");

  const selected = timesheets.find((item) => item.id === selectedId) ?? null;
  const departments = Array.from(new Set(timesheets.map((item) => item.department)));
  const filtered = useMemo(() => timesheets.filter((item) => {
    const term = search.toLowerCase();
    return (item.employee.toLowerCase().includes(term) || item.employeeNumber.toLowerCase().includes(term) || item.department.toLowerCase().includes(term)) && (status === "All" || item.status === status) && (department === "All" || item.department === department);
  }), [timesheets, search, status, department]);

  function submitComment(type: MeComment["type"]) {
    if (!selected || !comment.trim()) return;
    setTimesheets((current) => current.map((item) => item.id === selected.id ? { ...item, reviewFlag: type === "Change Requested" ? "Change Requested" : "M&E Review", comments: [...item.comments, { id: Date.now(), text: comment.trim(), type, date: "Just now" }] } : item));
    setComment("");
  }

  return <><MePageHeader eyebrow="Institution-wide Records" title="All Employee Timesheets" description="Review timesheets across every department, add M&E observations and request evidence or reporting changes where necessary." />
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"><Summary icon={UsersRound} label="All timesheets" value="148" detail="Current reporting period" tone="blue" /><Summary icon={CheckCircle2} label="Approved" value="128" detail="Ready for performance reporting" tone="emerald" /><Summary icon={Clock3} label="Pending review" value="13" detail="Submitted to supervisors" tone="amber" /><Summary icon={AlertTriangle} label="M&E change requests" value={timesheets.filter((item) => item.reviewFlag === "Change Requested").length.toString()} detail="Require corrective action" tone="red" /></section>
    <section className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-4 border-b border-slate-200 p-5 xl:flex-row xl:items-center xl:justify-between"><div className="relative w-full xl:max-w-sm"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Search employee, number or department..." className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div><div className="flex flex-wrap gap-3"><select value={department} onChange={(event) => setDepartment(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"><option value="All">All departments</option>{departments.map((item) => <option key={item}>{item}</option>)}</select><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"><option value="All">All statuses</option><option>Submitted</option><option>Approved</option><option>Returned</option><option>Draft</option></select><select className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"><option>July 2026</option><option>June 2026</option></select></div></div>
      <div className="overflow-x-auto"><table className="w-full min-w-300 text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-4">Employee</th><th className="px-6 py-4">Department</th><th className="px-6 py-4">Period</th><th className="px-6 py-4">Hours</th><th className="px-6 py-4">Activities</th><th className="px-6 py-4">Supervisor status</th><th className="px-6 py-4">M&E review</th><th className="px-6 py-4">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((item) => <tr key={item.id} className="hover:bg-slate-50"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{item.initials}</div><div><p className="font-semibold text-slate-900">{item.employee}</p><p className="mt-0.5 text-xs text-slate-500">{item.employeeNumber} · {item.position}</p></div></div></td><td className="px-6 py-4 text-slate-600">{item.department}</td><td className="px-6 py-4 font-medium text-slate-700">{item.period}</td><td className="px-6 py-4"><span className="font-bold text-slate-900">{item.hours}</span><span className="text-slate-400">/{item.expectedHours}</span></td><td className="px-6 py-4 text-slate-600">{item.activities}</td><td className="px-6 py-4"><Status value={item.status} /></td><td className="px-6 py-4"><ReviewFlag value={item.reviewFlag} comments={item.comments.length} /></td><td className="px-6 py-4"><button onClick={() => setSelectedId(item.id)} className="inline-flex items-center gap-2 font-semibold text-blue-600"><Eye size={17} /> Review</button></td></tr>)}</tbody></table></div>
    </section>

    {selected ? <div className="fixed inset-0 z-60 flex justify-end bg-slate-950/50" role="dialog" aria-modal="true" aria-label={`Review ${selected.employee} timesheet`}><button className="absolute inset-0 cursor-default" aria-label="Close timesheet review" onClick={() => setSelectedId(null)} /><aside className="scrollbar-hidden relative z-10 h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5"><div><p className="text-sm font-semibold text-blue-600">M&amp;E Timesheet Review</p><h2 className="mt-1 text-xl font-bold text-slate-900">{selected.employee}</h2><p className="mt-1 text-sm text-slate-500">{selected.employeeNumber} · {selected.department}</p></div><button onClick={() => setSelectedId(null)} aria-label="Close" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={21} /></button></div><div className="space-y-6 p-6"><section className="grid gap-4 sm:grid-cols-3"><Detail label="Reporting period" value={selected.period} /><Detail label="Recorded hours" value={`${selected.hours} / ${selected.expectedHours}`} /><Detail label="Activities" value={selected.activities.toString()} /><Detail label="Campus" value={selected.campus} /><Detail label="Supervisor" value={selected.supervisor} /><Detail label="Submitted" value={selected.submitted} /></section><section className="rounded-xl border border-slate-200 p-5"><h3 className="font-bold text-slate-900">Employee remarks</h3><p className="mt-2 text-sm leading-6 text-slate-600">{selected.employeeRemarks}</p></section><section className="rounded-xl border border-slate-200 p-5"><h3 className="font-bold text-slate-900">Supervisor feedback</h3><p className="mt-2 text-sm leading-6 text-slate-600">{selected.supervisorFeedback}</p></section><section className="rounded-xl border border-slate-200"><div className="border-b border-slate-200 px-5 py-4"><h3 className="flex items-center gap-2 font-bold text-slate-900"><MessageSquareText size={18} className="text-blue-600" /> M&amp;E comments</h3><p className="mt-1 text-xs text-slate-500">Comments are visible to the employee, supervisor and authorized reviewers.</p></div><div className="divide-y divide-slate-100">{selected.comments.length ? selected.comments.map((item) => <div key={item.id} className="p-5"><div className="flex items-center justify-between gap-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.type === "Change Requested" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>{item.type}</span><span className="text-xs text-slate-400">{item.date}</span></div><p className="mt-3 text-sm leading-6 text-slate-700">{item.text}</p></div>) : <p className="p-5 text-sm text-slate-500">No M&amp;E comments have been added.</p>}</div></section><form onSubmit={(event) => { event.preventDefault(); submitComment("Change Requested"); }} className="rounded-xl border border-blue-200 bg-blue-50 p-5"><label htmlFor="me-comment" className="font-bold text-blue-950">Add M&amp;E comment</label><p className="mt-1 text-xs leading-5 text-blue-800">Use “Request changes” when the record needs correction or additional evidence before reporting.</p><textarea id="me-comment" value={comment} onChange={(event) => setComment(event.target.value)} rows={4} placeholder="Write a clear observation or explain the required change..." className="mt-4 w-full resize-none rounded-lg border border-blue-200 bg-white p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end"><button type="button" disabled={!comment.trim()} onClick={() => submitComment("Observation")} className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-300 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"><MessageSquareText size={17} /> Add observation</button><button type="submit" disabled={!comment.trim()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"><Send size={17} /> Request changes</button></div></form></div></aside></div> : null}
  </>;
}

function Summary({ icon: Icon, label, value, detail, tone }: { icon: React.ElementType; label: string; value: string; detail: string; tone: "blue" | "emerald" | "amber" | "red" }) { const colours = { blue: "bg-blue-50 text-blue-600", emerald: "bg-emerald-50 text-emerald-600", amber: "bg-amber-50 text-amber-600", red: "bg-red-50 text-red-600" }; return <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className={`w-fit rounded-xl p-3 ${colours[tone]}`}><Icon size={22} /></div><p className="mt-4 text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold text-slate-900">{value}</p><p className="mt-2 text-xs text-slate-500">{detail}</p></article>; }
function Status({ value }: { value: TimesheetStatus }) { const styles = { Submitted: "bg-amber-100 text-amber-700", Approved: "bg-emerald-100 text-emerald-700", Returned: "bg-red-100 text-red-700", Draft: "bg-slate-200 text-slate-600" }; return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[value]}`}>{value}</span>; }
function ReviewFlag({ value, comments }: { value: ReviewFlag; comments: number }) { const styles = { Clear: "bg-emerald-100 text-emerald-700", "M&E Review": "bg-blue-100 text-blue-700", "Change Requested": "bg-red-100 text-red-700" }; return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[value]}`}>{value}{comments ? ` · ${comments}` : ""}</span>; }
function Detail({ label, value }: { label: string; value: string }) { return <div className="rounded-lg bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-bold text-slate-800">{value}</p></div>; }
