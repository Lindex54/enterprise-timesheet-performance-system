"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Building2,
  Eye,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  UserPlus,
  UsersRound,
  X,
} from "lucide-react";
import SupervisorShell from "../../../components/supervisor/SupervisorShell";

type EmployeeStatus = "Active" | "On Leave" | "Inactive";

type TeamMember = {
  id: number;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  initials: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  campus: string;
  supervisor: string;
  employmentType: string;
  dateJoined: string;
  status: EmployeeStatus;
  performance: number;
  completedTasks: number;
  totalTasks: number;
  recordedHours: number;
};

const initialTeamMembers: TeamMember[] = [
  {
    id: 1,
    employeeNumber: "BU-CD-001",
    firstName: "Aaron",
    lastName: "Kalamya",
    initials: "AK",
    email: "aaron.kalamya@busitema.ac.ug",
    phone: "+256 700 000 001",
    position: "Content Developer",
    department: "University Library",
    campus: "Busitema Campus",
    supervisor: "Department Head",
    employmentType: "Full-time",
    dateJoined: "2025-01-06",
    status: "Active",
    performance: 86,
    completedTasks: 18,
    totalTasks: 21,
    recordedHours: 126,
  },
  {
    id: 2,
    employeeNumber: "BU-ICT-002",
    firstName: "Godwin",
    lastName: "Malinde",
    initials: "GM",
    email: "godwin.malinde@busitema.ac.ug",
    phone: "+256 700 000 002",
    position: "ICT Officer",
    department: "University Library",
    campus: "Busitema Campus",
    supervisor: "Department Head",
    employmentType: "Full-time",
    dateJoined: "2024-08-01",
    status: "Active",
    performance: 91,
    completedTasks: 17,
    totalTasks: 19,
    recordedHours: 132,
  },
  {
    id: 3,
    employeeNumber: "BU-SD-003",
    firstName: "Brian",
    lastName: "Mwarisi",
    initials: "BM",
    email: "brian.mwarisi@busitema.ac.ug",
    phone: "+256 700 000 003",
    position: "Systems Developer",
    department: "ICT Directorate",
    campus: "Busitema Campus",
    supervisor: "Department Head",
    employmentType: "Contract",
    dateJoined: "2025-03-10",
    status: "Active",
    performance: 78,
    completedTasks: 14,
    totalTasks: 19,
    recordedHours: 118,
  },
  {
    id: 4,
    employeeNumber: "BU-ME-004",
    firstName: "Gerald",
    lastName: "Kisombo",
    initials: "GK",
    email: "gerald.kisombo@busitema.ac.ug",
    phone: "+256 700 000 004",
    position: "M&E Officer",
    department: "Planning Directorate",
    campus: "Busitema Campus",
    supervisor: "Department Head",
    employmentType: "Graduate Fellow",
    dateJoined: "2025-02-03",
    status: "On Leave",
    performance: 67,
    completedTasks: 10,
    totalTasks: 16,
    recordedHours: 104,
  },
];

type NewMemberForm = {
  firstName: string;
  lastName: string;
  employeeNumber: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  campus: string;
  employmentType: string;
  dateJoined: string;
};

const emptyMemberForm: NewMemberForm = {
  firstName: "",
  lastName: "",
  employeeNumber: "",
  email: "",
  phone: "",
  position: "",
  department: "",
  campus: "Busitema Campus",
  employmentType: "Full-time",
  dateJoined: "",
};

export default function SupervisorTeamPage() {
  const [teamMembers, setTeamMembers] =
    useState<TeamMember[]>(initialTeamMembers);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] =
    useState<NewMemberForm>(emptyMemberForm);

  const departments = useMemo(() => {
    return Array.from(
      new Set(teamMembers.map((member) => member.department)),
    );
  }, [teamMembers]);

  const filteredMembers = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return teamMembers.filter((member) => {
      const fullName =
        `${member.firstName} ${member.lastName}`.toLowerCase();

      const matchesSearch =
        fullName.includes(search) ||
        member.employeeNumber.toLowerCase().includes(search) ||
        member.email.toLowerCase().includes(search) ||
        member.position.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || member.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        member.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [teamMembers, searchTerm, statusFilter, departmentFilter]);

  const activeMembers = teamMembers.filter(
    (member) => member.status === "Active",
  ).length;

  const onLeaveMembers = teamMembers.filter(
    (member) => member.status === "On Leave",
  ).length;

  const averagePerformance =
    teamMembers.length === 0
      ? 0
      : Math.round(
          teamMembers.reduce(
            (total, member) => total + member.performance,
            0,
          ) / teamMembers.length,
        );

  function handleNewMemberChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    setNewMember((currentMember) => ({
      ...currentMember,
      [name]: value,
    }));
  }

  function handleAddMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextId =
      teamMembers.length === 0
        ? 1
        : Math.max(...teamMembers.map((member) => member.id)) + 1;

    const initials =
      `${newMember.firstName.charAt(0)}${newMember.lastName.charAt(0)}`.toUpperCase();

    const member: TeamMember = {
      id: nextId,
      employeeNumber: newMember.employeeNumber,
      firstName: newMember.firstName,
      lastName: newMember.lastName,
      initials,
      email: newMember.email,
      phone: newMember.phone,
      position: newMember.position,
      department: newMember.department,
      campus: newMember.campus,
      supervisor: "Department Head",
      employmentType: newMember.employmentType,
      dateJoined: newMember.dateJoined,
      status: "Active",
      performance: 0,
      completedTasks: 0,
      totalTasks: 0,
      recordedHours: 0,
    };

    setTeamMembers((currentMembers) => [
      ...currentMembers,
      member,
    ]);

    setNewMember(emptyMemberForm);
    setShowAddMember(false);
  }

  return (
    <SupervisorShell>
      <section className="mb-7 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Team Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">
            Team Members
          </h1>

          <p className="mt-1 max-w-3xl text-slate-500">
            View employees under your supervision, review their information
            and add new members to your team.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddMember(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <UserPlus size={18} />
          Add team member
        </button>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <TeamSummaryCard
          title="Total team members"
          value={teamMembers.length.toString()}
          description="Employees under supervision"
          icon={UsersRound}
        />

        <TeamSummaryCard
          title="Active employees"
          value={activeMembers.toString()}
          description="Currently available for work"
          icon={BriefcaseBusiness}
        />

        <TeamSummaryCard
          title="Employees on leave"
          value={onLeaveMembers.toString()}
          description="Currently away from duty"
          icon={MapPin}
        />

        <TeamSummaryCard
          title="Average performance"
          value={`${averagePerformance}%`}
          description="Current team performance"
          icon={Building2}
        />
      </section>

      <section className="mt-7 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search employee name, number or position..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On leave</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(event) =>
              setDepartmentFilter(event.target.value)
            }
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">All departments</option>

            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Current team
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select a team member to view their complete profile.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-900">
              {filteredMembers.length}
            </span>{" "}
            members
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {filteredMembers.map((member) => (
            <article
              key={member.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                    {member.initials}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      {member.firstName} {member.lastName}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-blue-600">
                      {member.position}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {member.employeeNumber}
                    </p>
                  </div>
                </div>

                <EmployeeStatusBadge status={member.status} />
              </div>

              <div className="mt-6 space-y-3 border-y border-slate-100 py-5">
                <MemberInformation
                  icon={Building2}
                  value={member.department}
                />

                <MemberInformation
                  icon={MapPin}
                  value={member.campus}
                />

                <MemberInformation
                  icon={Mail}
                  value={member.email}
                />

                <MemberInformation
                  icon={Phone}
                  value={member.phone}
                />
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Performance
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {member.performance}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${getPerformanceColour(
                      member.performance,
                    )}`}
                    style={{
                      width: `${member.performance}%`,
                    }}
                  />
                </div>
              </div>

              <Link
                href={`/supervisor/team/${member.id}`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              >
                <Eye size={17} />
                View full profile
              </Link>
            </article>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
            <UsersRound
              className="mx-auto text-slate-300"
              size={46}
            />

            <h3 className="mt-4 font-bold text-slate-900">
              No team members found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Change the search or selected filters.
            </p>
          </div>
        )}
      </section>

      {showAddMember && (
        <AddTeamMemberPanel
          member={newMember}
          onChange={handleNewMemberChange}
          onSubmit={handleAddMember}
          onClose={() => {
            setShowAddMember(false);
            setNewMember(emptyMemberForm);
          }}
        />
      )}
    </SupervisorShell>
  );
}

type TeamSummaryCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
};

function TeamSummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: TeamSummaryCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Icon size={22} />
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {description}
      </p>
    </article>
  );
}

function MemberInformation({
  icon: Icon,
  value,
}: {
  icon: React.ElementType;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 text-sm text-slate-600">
      <Icon size={17} className="shrink-0 text-slate-400" />
      <span className="truncate">{value}</span>
    </div>
  );
}

function EmployeeStatusBadge({
  status,
}: {
  status: EmployeeStatus;
}) {
  const styles: Record<EmployeeStatus, string> = {
    Active: "bg-emerald-100 text-emerald-700",
    "On Leave": "bg-amber-100 text-amber-700",
    Inactive: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

type AddTeamMemberPanelProps = {
  member: NewMemberForm;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

function AddTeamMemberPanel({
  member,
  onChange,
  onSubmit,
  onClose,
}: AddTeamMemberPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50">
      <button
        type="button"
        aria-label="Close add team member panel"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <aside className="relative z-10 h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Team Management
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Add team member
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <AddMemberField
              label="First name"
              name="firstName"
              value={member.firstName}
              onChange={onChange}
              required
            />

            <AddMemberField
              label="Last name"
              name="lastName"
              value={member.lastName}
              onChange={onChange}
              required
            />

            <AddMemberField
              label="Employee number"
              name="employeeNumber"
              value={member.employeeNumber}
              onChange={onChange}
              required
            />

            <AddMemberField
              label="Email address"
              name="email"
              type="email"
              value={member.email}
              onChange={onChange}
              required
            />

            <AddMemberField
              label="Phone number"
              name="phone"
              type="tel"
              value={member.phone}
              onChange={onChange}
              required
            />

            <AddMemberField
              label="Position"
              name="position"
              value={member.position}
              onChange={onChange}
              required
            />

            <AddMemberField
              label="Department"
              name="department"
              value={member.department}
              onChange={onChange}
              required
            />

            <AddMemberSelect
              label="Campus"
              name="campus"
              value={member.campus}
              onChange={onChange}
              options={[
                "Busitema Campus",
                "Arapai Campus",
                "Mbale Campus",
                "Nagongera Campus",
                "Namasagali Campus",
                "Pallisa Campus",
              ]}
            />

            <AddMemberSelect
              label="Employment type"
              name="employmentType"
              value={member.employmentType}
              onChange={onChange}
              options={[
                "Full-time",
                "Part-time",
                "Contract",
                "Graduate Fellow",
                "Internship",
              ]}
            />

            <AddMemberField
              label="Date joined"
              name="dateJoined"
              type="date"
              value={member.dateJoined}
              onChange={onChange}
              required
            />
          </div>

          <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={18} />
              Add team member
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

type AddMemberFieldProps = {
  label: string;
  name: keyof NewMemberForm;
  value: string;
  type?: string;
  required?: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
};

function AddMemberField({
  label,
  name,
  value,
  type = "text",
  required = false,
  onChange,
}: AddMemberFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

type AddMemberSelectProps = {
  label: string;
  name: keyof NewMemberForm;
  value: string;
  options: string[];
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
};

function AddMemberSelect({
  label,
  name,
  value,
  options,
  onChange,
}: AddMemberSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function getPerformanceColour(score: number) {
  if (score >= 90) {
    return "bg-emerald-500";
  }

  if (score >= 80) {
    return "bg-blue-600";
  }

  if (score >= 70) {
    return "bg-amber-500";
  }

  return "bg-red-500";
}