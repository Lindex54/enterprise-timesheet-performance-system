import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  LayoutDashboard,
  ListTodo,
  ShieldCheck,
  Target,
  UsersRound,
} from "lucide-react";

const features = [
  {
    title: "Daily Timesheets",
    description:
      "Record daily activities, working hours, outputs, challenges and remarks in one organized workspace.",
    icon: Clock3,
  },
  {
    title: "Task Tracking",
    description:
      "Monitor assigned tasks, deadlines, priorities, progress and completion status.",
    icon: ListTodo,
  },
  {
    title: "Performance Monitoring",
    description:
      "Review employee performance using task completion, productivity, working hours and supervisor ratings.",
    icon: BarChart3,
  },
  {
    title: "Reports",
    description:
      "Generate monthly timesheets, performance summaries and management reports.",
    icon: FileText,
  },
  {
    title: "Approvals",
    description:
      "Allow supervisors to review, approve, reject or return submitted activities for correction.",
    icon: ClipboardCheck,
  },
  {
    title: "Secure Employee Profiles",
    description:
      "Maintain employee, department, campus, role and supervisor information securely.",
    icon: ShieldCheck,
  },
];

const benefits = [
  "Improved accountability and transparency",
  "Faster timesheet submission and approval",
  "Real-time task and performance monitoring",
  "Centralized employee work records",
  "Simplified monthly and annual reporting",
  "Better evidence-based decision-making",
];

const workflowSteps = [
  {
    number: "01",
    title: "Record daily work",
    description:
      "Employees enter their daily activities, time spent, outputs and challenges.",
  },
  {
    number: "02",
    title: "Track assigned tasks",
    description:
      "Tasks are monitored according to their deadlines, priorities and completion progress.",
  },
  {
    number: "03",
    title: "Supervisor review",
    description:
      "Supervisors assess submitted work, provide feedback and approve completed records.",
  },
  {
    number: "04",
    title: "Generate reports",
    description:
      "The system consolidates approved records into performance and timesheet reports.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Target size={24} />
            </div>

            <div>
              <p className="font-bold text-slate-900">
                Timesheet & Performance
              </p>
              <p className="text-xs font-medium text-slate-500">
                Management System
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 lg:flex">
            <Link href="#features" className="transition hover:text-blue-600">
              Features
            </Link>

            <Link href="#benefits" className="transition hover:text-blue-600">
              Benefits
            </Link>

            <Link href="#workflow" className="transition hover:text-blue-600">
              How it works
            </Link>

            <Link href="#about" className="transition hover:text-blue-600">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:inline-flex"
            >
              Sign in
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Open dashboard
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-blue-500 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-400 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-5xl justify-center px-5 py-20 text-center lg:px-8 lg:py-28">
        <div className="flex w-full flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
            <ShieldCheck size={17} />
            Secure enterprise work-management platform
          </div>

          <h1 className="mt-7 max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Monitor work, manage tasks and improve employee performance.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            A centralized system for recording daily activities, tracking tasks,
            reviewing employee performance and generating reliable institutional
            reports.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-500"
            >
              Get started
              <ArrowRight size={19} />
            </Link>

            <Link
              href="#features"
              className="inline-flex items-center justify-center rounded-lg border border-slate-600 px-6 py-3.5 font-semibold text-white transition hover:border-slate-400 hover:bg-white/5"
            >
              Explore the system
            </Link>
          </div>

          <div className="mt-10 grid w-full max-w-2xl gap-6 sm:grid-cols-3">
            <HeroStatistic value="100%" label="Digital records" />
            <HeroStatistic value="24/7" label="System access" />
            <HeroStatistic value="1" label="Unified platform" />
          </div>
        </div>
      </div>
      </section>
      <section id="features" className="scroll-mt-24 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="System Features"
            title="Everything needed to manage employee work"
            description="The platform combines timesheets, task tracking, approvals, performance monitoring and reporting in one system."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="benefits"
        className="scroll-mt-24 bg-slate-50 py-20 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Organizational Benefits
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 lg:text-4xl">
              Replace scattered spreadsheets with one reliable platform.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              The system gives employees and supervisors a clear view of work
              completed, pending assignments, working hours and performance
              results.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle2
                    size={21}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <p className="font-medium leading-6 text-slate-700">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:p-9">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                <UsersRound size={25} />
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Built for every level
                </p>

                <h3 className="text-xl font-bold text-slate-900">
                  Employees, supervisors and administrators
                </h3>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <RoleItem
                title="Employees"
                description="Record work, submit timesheets, monitor tasks and review personal performance."
              />

              <RoleItem
                title="Supervisors"
                description="Review employee submissions, provide feedback and approve work records."
              />

              <RoleItem
                title="Administrators"
                description="Manage users, departments, performance indicators and institutional reports."
              />

              <RoleItem
                title="Management"
                description="Access consolidated performance information for planning and decision-making."
              />
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="scroll-mt-24 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="System Workflow"
            title="From daily activity entry to management reporting"
            description="The system follows a clear process that connects employees, supervisors and institutional management."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {workflowSteps.map((step) => (
              <article
                key={step.number}
                className="relative rounded-2xl border border-slate-200 bg-white p-7"
              >
                <span className="text-4xl font-bold text-blue-100">
                  {step.number}
                </span>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 px-5 pb-20 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-blue-600 px-6 py-14 text-center text-white sm:px-10 lg:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <Target size={28} />
          </div>

          <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-bold lg:text-4xl">
            Improve accountability, productivity and institutional performance.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Sign in to record your work, manage tasks, review performance and
            generate accurate reports.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Sign in to the system
              <ArrowRight size={19} />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg border border-blue-300 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-500"
            >
              View dashboard
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-10 lg:flex-row lg:items-center lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Target size={21} />
            </div>

            <div>
              <p className="font-bold text-white">
                Timesheet & Performance Management System
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Supporting accountability and institutional performance.
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

function HeroStatistic({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}

type DashboardPreviewCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: React.ElementType;
};

function DashboardPreviewCard({
  label,
  value,
  detail,
  icon: Icon,
}: DashboardPreviewCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>

        <div className="rounded-lg bg-white p-2 text-blue-600 shadow-sm">
          <Icon size={18} />
        </div>
      </div>

      <p className="mt-3 text-xs font-medium text-slate-500">{detail}</p>
    </div>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-bold text-slate-900 lg:text-4xl">
        {title}
      </h2>

      <p className="mt-5 text-lg leading-8 text-slate-600">{description}</p>
    </div>
  );
}

function RoleItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-slate-200 p-4">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <CheckCircle2 size={17} />
      </div>

      <div>
        <h4 className="font-bold text-slate-900">{title}</h4>

        <p className="mt-1 text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}