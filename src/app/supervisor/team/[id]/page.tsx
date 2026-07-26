import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Target,
  UserRound,
} from "lucide-react";
import SupervisorShell from "../../../../components/supervisor/SupervisorShell";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const employees = [
  {
    id: 1,
    employeeNumber: "BU-CD-001",
    name: "Aaron Kalamya",
    initials: "AK",
    email: "aaron.kalamya@busitema.ac.ug",
    phone: "+256 700 000 001",
    position: "Content Developer",
    department: "University Library",
    campus: "Busitema Campus",
    supervisor: "Department Head",
    employmentType: "Full-time",
    dateJoined: "06 January 2025",
    status: "Active",
    performance: 86,
    completedTasks: 18,
    totalTasks: 21,
    recordedHours: 126,
    activities: 24,
  },
  {
    id: 2,
    employeeNumber: "BU-ICT-002",
    name: "Godwin Malinde",
    initials: "GM",
    email: "godwin.malinde@busitema.ac.ug",
    phone: "+256 700 000 002",
    position: "ICT Officer",
    department: "University Library",
    campus: "Busitema Campus",
    supervisor: "Department Head",
    employmentType: "Full-time",
    dateJoined: "01 August 2024",
    status: "Active",
    performance: 91,
    completedTasks: 17,
    totalTasks: 19,
    recordedHours: 132,
    activities: 21,
  },
];

export default async function TeamMemberProfilePage({
  params,
}: PageProps) {
  const { id } = await params;

  const employee = employees.find(
    (currentEmployee) => currentEmployee.id === Number(id),
  );

  if (!employee) {
    return (
      <SupervisorShell>
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <UserRound
            className="mx-auto text-slate-300"
            size={48}
          />

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Team member not found
          </h1>

          <Link
            href="/supervisor/team"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
          >
            <ArrowLeft size={17} />
            Return to team
          </Link>
        </div>
      </SupervisorShell>
    );
  }

  return (
    <SupervisorShell>
      <Link
        href="/supervisor/team"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft size={17} />
        Back to team
      </Link>

      <section className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <aside className="space-y-6">
          <article className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-700">
              {employee.initials}
            </div>

            <h1 className="mt-5 text-xl font-bold text-slate-900">
              {employee.name}
            </h1>

            <p className="mt-1 font-semibold text-blue-600">
              {employee.position}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {employee.employeeNumber}
            </p>

            <span className="mt-5 inline-flex rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700">
              {employee.status}
            </span>

            <div className="mt-6 space-y-4 border-t border-slate-200 pt-5 text-left">
              <ContactInformation
                icon={Mail}
                label="Email"
                value={employee.email}
              />

              <ContactInformation
                icon={Phone}
                label="Phone"
                value={employee.phone}
              />

              <ContactInformation
                icon={MapPin}
                label="Campus"
                value={employee.campus}
              />
            </div>
          </article>
        </aside>

        <div className="space-y-6">
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <ProfileStatistic
              title="Activities"
              value={employee.activities.toString()}
              icon={CheckCircle2}
            />

            <ProfileStatistic
              title="Completed tasks"
              value={`${employee.completedTasks}/${employee.totalTasks}`}
              icon={Target}
            />

            <ProfileStatistic
              title="Hours recorded"
              value={employee.recordedHours.toString()}
              icon={Clock3}
            />

            <ProfileStatistic
              title="Performance"
              value={`${employee.performance}%`}
              icon={BarChart3}
            />
          </section>

          <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="font-bold text-slate-900">
                Employment information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Employee organizational and employment details
              </p>
            </div>

            <div className="grid gap-5 p-6 md:grid-cols-2">
              <InformationCard
                icon={BriefcaseBusiness}
                label="Position"
                value={employee.position}
              />

              <InformationCard
                icon={Building2}
                label="Department"
                value={employee.department}
              />

              <InformationCard
                icon={MapPin}
                label="Campus"
                value={employee.campus}
              />

              <InformationCard
                icon={UserRound}
                label="Supervisor"
                value={employee.supervisor}
              />

              <InformationCard
                icon={BriefcaseBusiness}
                label="Employment type"
                value={employee.employmentType}
              />

              <InformationCard
                icon={CalendarDays}
                label="Date joined"
                value={employee.dateJoined}
              />
            </div>
          </article>
        </div>
      </section>
    </SupervisorShell>
  );
}

function ProfileStatistic({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Icon size={21} />
        </div>
      </div>
    </article>
  );
}

function ContactInformation({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon
        size={18}
        className="mt-0.5 shrink-0 text-slate-400"
      />

      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

function InformationCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-slate-200 p-4">
      <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
        <Icon size={19} />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <p className="mt-1 font-semibold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}