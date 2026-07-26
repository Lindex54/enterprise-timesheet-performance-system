"use client";

import { useMemo, useState } from "react";
import {
  Award,
  BarChart3,
  CheckCircle2,
  Clock3,
  Lightbulb,
  ListChecks,
  MessageSquareText,
  Target,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";

type PerformanceMonth = {
  month: string;
  score: number;
};

type KpiItem = {
  id: number;
  title: string;
  description: string;
  score: number;
  weight: number;
};

type WorkCategory = {
  name: string;
  activities: number;
  hours: number;
  percentage: number;
};

const monthlyPerformance: PerformanceMonth[] = [
  { month: "January", score: 72 },
  { month: "February", score: 76 },
  { month: "March", score: 79 },
  { month: "April", score: 82 },
  { month: "May", score: 80 },
  { month: "June", score: 84 },
  { month: "July", score: 86 },
];

const kpiItems: KpiItem[] = [
  {
    id: 1,
    title: "Task completion",
    description: "Percentage of assigned tasks completed successfully.",
    score: 90,
    weight: 30,
  },
  {
    id: 2,
    title: "Timesheet submission",
    description: "Consistency and timeliness of daily activity submissions.",
    score: 88,
    weight: 20,
  },
  {
    id: 3,
    title: "Quality of output",
    description: "Quality, accuracy and completeness of completed work.",
    score: 84,
    weight: 25,
  },
  {
    id: 4,
    title: "Productivity",
    description: "Effective use of working hours and available resources.",
    score: 82,
    weight: 15,
  },
  {
    id: 5,
    title: "Supervisor rating",
    description: "Performance rating provided by the immediate supervisor.",
    score: 86,
    weight: 10,
  },
];

const workCategories: WorkCategory[] = [
  {
    name: "Website Management",
    activities: 8,
    hours: 42,
    percentage: 33,
  },
  {
    name: "Content Development",
    activities: 6,
    hours: 31,
    percentage: 25,
  },
  {
    name: "System Development",
    activities: 5,
    hours: 29,
    percentage: 23,
  },
  {
    name: "Research and Reporting",
    activities: 5,
    hours: 24,
    percentage: 19,
  },
];

const achievements = [
  "Completed the university website content update before the scheduled deadline.",
  "Prepared preliminary documentation for the Timesheet and Performance Management System.",
  "Improved the monthly task completion rate from 80% to 86%.",
];

const challenges = [
  "Some activities required additional time because of delayed feedback.",
  "Competing priorities affected the completion of one urgent reporting task.",
];

export default function PerformancePage() {
  const [selectedMonth, setSelectedMonth] = useState("July");
  const [selectedYear, setSelectedYear] = useState("2026");

  const overallScore = useMemo(() => {
    const weightedScore = kpiItems.reduce((total, item) => {
      return total + item.score * (item.weight / 100);
    }, 0);

    return Math.round(weightedScore);
  }, []);

  const totalWeight = kpiItems.reduce(
    (total, item) => total + item.weight,
    0,
  );

  const maximumMonthlyScore = Math.max(
    ...monthlyPerformance.map((item) => item.score),
  );

  return (
    <DashboardShell>
      <section className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Performance Monitoring
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">
            Individual Performance
          </h1>

          <p className="mt-1 max-w-3xl text-slate-500">
            Review your work output, task completion, recorded hours and
            performance indicators.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
          </select>

          <select
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <PerformanceSummaryCard
          title="Overall performance"
          value={`${overallScore}%`}
          description={`${selectedMonth} ${selectedYear} performance score`}
          icon={Award}
          trend="+6% from last month"
        />

        <PerformanceSummaryCard
          title="Task completion"
          value="86%"
          description="18 out of 21 tasks completed"
          icon={CheckCircle2}
          trend="3 tasks in progress"
        />

        <PerformanceSummaryCard
          title="Hours worked"
          value="126"
          description="Out of 160 expected hours"
          icon={Clock3}
          trend="78.8% of expected hours"
        />

        <PerformanceSummaryCard
          title="Activities recorded"
          value="24"
          description="Daily activities submitted"
          icon={ListChecks}
          trend="22 approved, 2 pending"
        />
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Performance overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Overall assessment for {selectedMonth} {selectedYear}
              </p>
            </div>

            <span className="inline-flex w-fit rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
              Very good
            </span>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr] md:items-center">
            <PerformanceGauge score={overallScore} />

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Strong monthly performance
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                You performed well in task completion, timesheet submission
                and quality of work. Your overall score has improved compared
                with the previous month.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Previous score</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    80%
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Performance change
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-emerald-600">
                    <TrendingUp size={22} />
                    +6%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Performance classification
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Interpretation of the calculated score
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <ClassificationItem
              label="Excellent"
              range="90–100%"
              active={overallScore >= 90}
            />

            <ClassificationItem
              label="Very good"
              range="80–89%"
              active={overallScore >= 80 && overallScore < 90}
            />

            <ClassificationItem
              label="Good"
              range="70–79%"
              active={overallScore >= 70 && overallScore < 80}
            />

            <ClassificationItem
              label="Needs improvement"
              range="Below 70%"
              active={overallScore < 70}
            />
          </div>

          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex gap-3">
              <Lightbulb
                size={21}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <p className="text-sm leading-6 text-blue-800">
                Completing the remaining tasks and recording all expected
                working hours could improve your final monthly score.
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                KPI performance breakdown
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Performance against the approved indicators and weights
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Target size={22} />
            </div>
          </div>

          <div className="mt-7 space-y-7">
            {kpiItems.map((item) => (
              <div key={item.id}>
                <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.title}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      Weight: {item.weight}%
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {item.score}%
                    </span>
                  </div>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${getProgressColour(
                      item.score,
                    )}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 flex items-center justify-between border-t border-slate-200 pt-5">
            <span className="text-sm font-semibold text-slate-600">
              Total KPI weight
            </span>

            <span className="text-lg font-bold text-slate-900">
              {totalWeight}%
            </span>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Monthly performance trend
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Performance scores recorded during {selectedYear}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <BarChart3 size={22} />
            </div>
          </div>

          <div className="mt-8 flex h-72 items-end justify-between gap-3 border-b border-slate-200">
            {monthlyPerformance.map((item) => {
              const barHeight =
                maximumMonthlyScore === 0
                  ? 0
                  : (item.score / 100) * 100;

              const isCurrentMonth = item.month === selectedMonth;

              return (
                <div
                  key={item.month}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >
                  <span className="mb-2 text-xs font-bold text-slate-700">
                    {item.score}%
                  </span>

                  <div
                    className={`w-full max-w-12 rounded-t-md transition ${
                      isCurrentMonth ? "bg-blue-600" : "bg-blue-200"
                    }`}
                    style={{ height: `${barHeight}%` }}
                    title={`${item.month}: ${item.score}%`}
                  />

                  <span className="mt-3 pb-3 text-xs font-medium text-slate-500">
                    {item.month.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div>
              <p className="text-sm text-slate-500">Highest score</p>
              <p className="mt-1 font-bold text-slate-900">86% in July</p>
            </div>

            <TrendingUp className="text-emerald-600" size={25} />
          </div>
        </article>
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-900">
              Work distribution
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Distribution of recorded activities and working hours
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-175 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">Work area</th>
                  <th className="px-6 py-4">Activities</th>
                  <th className="px-6 py-4">Hours</th>
                  <th className="px-6 py-4">Distribution</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {workCategories.map((category) => (
                  <tr key={category.name} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {category.name}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {category.activities}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {category.hours}
                    </td>

                    <td className="min-w-56 px-6 py-4">
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-slate-500">Contribution</span>
                        <span className="font-bold text-slate-700">
                          {category.percentage}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{
                            width: `${category.percentage}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Supervisor feedback
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Assessment from the immediate supervisor
              </p>
            </div>

            <MessageSquareText className="text-blue-600" size={24} />
          </div>

          <blockquote className="mt-6 rounded-lg border-l-4 border-blue-600 bg-blue-50 p-5 text-sm leading-7 text-slate-700">
            The employee has demonstrated good consistency in completing
            assigned work and submitting daily activities. Greater attention
            should be given to completing urgent reporting tasks within the
            agreed timelines.
          </blockquote>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-700">
              FK
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                Immediate Supervisor
              </p>
              <p className="text-sm text-slate-500">
                Reviewed on 26 July 2026
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <p className="text-sm text-slate-500">Supervisor rating</p>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-3xl font-bold text-slate-900">86%</span>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Very good
              </span>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-7 grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
              <Award size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Key achievements
              </h2>

              <p className="text-sm text-slate-500">
                Significant outputs recorded during the month
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {achievements.map((achievement, index) => (
              <div key={achievement} className="flex gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  {index + 1}
                </div>

                <p className="text-sm leading-6 text-slate-600">
                  {achievement}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
              <TriangleAlert size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Challenges and improvement areas
              </h2>

              <p className="text-sm text-slate-500">
                Issues that affected performance during the month
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {challenges.map((challenge, index) => (
              <div key={challenge} className="flex gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                  {index + 1}
                </div>

                <p className="text-sm leading-6 text-slate-600">
                  {challenge}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}

type PerformanceSummaryCardProps = {
  title: string;
  value: string;
  description: string;
  trend: string;
  icon: React.ElementType;
};

function PerformanceSummaryCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
}: PerformanceSummaryCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Icon size={22} />
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">{description}</p>

      <p className="mt-2 text-xs font-semibold text-blue-600">{trend}</p>
    </article>
  );
}

function PerformanceGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 72;
  const progress = circumference - (score / 100) * circumference;

  return (
    <div className="relative mx-auto h-48 w-48">
      <svg
        viewBox="0 0 180 180"
        className="h-full w-full -rotate-90"
        aria-label={`Performance score ${score}%`}
      >
        <circle
          cx="90"
          cy="90"
          r="72"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="15"
        />

        <circle
          cx="90"
          cy="90"
          r="72"
          fill="none"
          stroke="#2563eb"
          strokeWidth="15"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-slate-900">{score}%</span>
        <span className="mt-1 text-sm font-medium text-slate-500">
          Overall score
        </span>
      </div>
    </div>
  );
}

type ClassificationItemProps = {
  label: string;
  range: string;
  active: boolean;
};

function ClassificationItem({
  label,
  range,
  active,
}: ClassificationItemProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
        active
          ? "border-blue-300 bg-blue-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`h-3 w-3 rounded-full ${
            active ? "bg-blue-600" : "bg-slate-300"
          }`}
        />

        <span
          className={`text-sm font-semibold ${
            active ? "text-blue-800" : "text-slate-700"
          }`}
        >
          {label}
        </span>
      </div>

      <span className="text-xs font-medium text-slate-500">{range}</span>
    </div>
  );
}

function getProgressColour(score: number) {
  if (score >= 85) {
    return "bg-emerald-500";
  }

  if (score >= 70) {
    return "bg-blue-600";
  }

  if (score >= 50) {
    return "bg-amber-500";
  }

  return "bg-red-500";
}