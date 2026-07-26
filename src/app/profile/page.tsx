"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  Camera,
  CheckCircle2,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";

type ProfileForm = {
  firstName: string;
  lastName: string;
  employeeNumber: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  jobTitle: string;
  department: string;
  campus: string;
  employmentType: string;
  dateJoined: string;
  supervisor: string;
  supervisorEmail: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyRelationship: string;
};

const initialProfile: ProfileForm = {
  firstName: "Godwin",
  lastName: "Malinde",
  employeeNumber: "BU-ICT-026",
  email: "godwin.malinde@busitema.ac.ug",
  phone: "+256 700 000 000",
  gender: "Male",
  dateOfBirth: "1998-06-12",
  address: "Busitema, Uganda",
  jobTitle: "ICT Fellow",
  department: "University Library",
  campus: "Busitema Campus",
  employmentType: "Full-time",
  dateJoined: "2025-01-06",
  supervisor: "Immediate Supervisor",
  supervisorEmail: "supervisor@busitema.ac.ug",
  emergencyContactName: "Emergency Contact",
  emergencyContactPhone: "+256 750 000 000",
  emergencyRelationship: "Family Member",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileForm>(initialProfile);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const imageUrl = URL.createObjectURL(selectedFile);
    setProfileImage(imageUrl);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsEditing(false);
    setSavedMessage("Profile information saved successfully.");

    window.setTimeout(() => {
      setSavedMessage("");
    }, 3500);
  }

  function handleCancel() {
    setProfile(initialProfile);
    setIsEditing(false);
    setSavedMessage("");
  }

  return (
    <DashboardShell>
      <section className="mb-7">
        <p className="text-sm font-semibold text-blue-600">
          Account Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">
          My Profile
        </h1>

        <p className="mt-1 text-slate-500">
          Review and manage your personal and employment information.
        </p>
      </section>

      {savedMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
          <CheckCircle2 size={20} />
          {savedMessage}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <aside className="space-y-6">
          <article className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="relative mx-auto h-32 w-32">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="h-full w-full rounded-full border-4 border-white object-cover shadow-md"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-700">
                  {profile.firstName.charAt(0)}
                  {profile.lastName.charAt(0)}
                </div>
              )}

              <label
                htmlFor="profile-image"
                className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-md transition hover:bg-blue-700"
                title="Change profile photo"
              >
                <Camera size={17} />

                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              {profile.firstName} {profile.lastName}
            </h2>

            <p className="mt-1 text-sm font-medium text-blue-600">
              {profile.jobTitle}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {profile.department}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-700">
              <ShieldCheck size={16} />
              Active employee
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5 text-left">
              <ProfileContact
                icon={Mail}
                label="Email"
                value={profile.email}
              />

              <ProfileContact
                icon={Phone}
                label="Phone"
                value={profile.phone}
              />

              <ProfileContact
                icon={MapPin}
                label="Campus"
                value={profile.campus}
              />
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  Profile completion
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your profile information
                </p>
              </div>

              <span className="text-lg font-bold text-blue-600">92%</span>
            </div>

            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[92%] rounded-full bg-blue-600" />
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Add or confirm all required personal and employment details to
              complete your profile.
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
                <KeyRound size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Account security
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Manage your password and account security settings.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                alert(
                  "Password management will be connected through Clerk authentication.",
                )
              }
              className="mt-5 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Change password
            </button>
          </article>
        </aside>

        <form onSubmit={handleSubmit} className="space-y-6">
          <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={UserRound}
              title="Personal information"
              description="Basic personal and contact details"
            />

            <div className="grid gap-5 p-6 md:grid-cols-2">
              <ProfileField
                label="First name"
                name="firstName"
                value={profile.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />

              <ProfileField
                label="Last name"
                name="lastName"
                value={profile.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />

              <ProfileField
                label="Employee number"
                name="employeeNumber"
                value={profile.employeeNumber}
                onChange={handleInputChange}
                disabled
              />

              <ProfileField
                label="Email address"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />

              <ProfileField
                label="Phone number"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />

              <ProfileSelect
                label="Gender"
                name="gender"
                value={profile.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
                options={["Male", "Female", "Prefer not to say"]}
              />

              <ProfileField
                label="Date of birth"
                name="dateOfBirth"
                type="date"
                value={profile.dateOfBirth}
                onChange={handleInputChange}
                disabled={!isEditing}
              />

              <ProfileField
                label="Residential address"
                name="address"
                value={profile.address}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={BriefcaseBusiness}
              title="Employment information"
              description="Your current organizational assignment"
            />

            <div className="grid gap-5 p-6 md:grid-cols-2">
              <ProfileField
                label="Job title"
                name="jobTitle"
                value={profile.jobTitle}
                onChange={handleInputChange}
                disabled={!isEditing}
              />

              <ProfileField
                label="Department"
                name="department"
                value={profile.department}
                onChange={handleInputChange}
                disabled={!isEditing}
              />

              <ProfileSelect
                label="Campus"
                name="campus"
                value={profile.campus}
                onChange={handleInputChange}
                disabled={!isEditing}
                options={[
                  "Busitema Campus",
                  "Arapai Campus",
                  "Mbale Campus",
                  "Nagongera Campus",
                  "Namasagali Campus",
                  "Pallisa Campus",
                ]}
              />

              <ProfileSelect
                label="Employment type"
                name="employmentType"
                value={profile.employmentType}
                onChange={handleInputChange}
                disabled={!isEditing}
                options={[
                  "Full-time",
                  "Part-time",
                  "Contract",
                  "Internship",
                  "Graduate Fellow",
                ]}
              />

              <ProfileField
                label="Date joined"
                name="dateJoined"
                type="date"
                value={profile.dateJoined}
                onChange={handleInputChange}
                disabled={!isEditing}
              />

              <ProfileField
                label="Employee status"
                name="employeeStatus"
                value="Active"
                onChange={() => undefined}
                disabled
              />
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={Building2}
              title="Supervisor information"
              description="Details of your immediate supervisor"
            />

            <div className="grid gap-5 p-6 md:grid-cols-2">
              <ProfileField
                label="Supervisor name"
                name="supervisor"
                value={profile.supervisor}
                onChange={handleInputChange}
                disabled={!isEditing}
              />

              <ProfileField
                label="Supervisor email"
                name="supervisorEmail"
                type="email"
                value={profile.supervisorEmail}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={UsersRound}
              title="Emergency contact"
              description="Person to contact in case of an emergency"
            />

            <div className="grid gap-5 p-6 md:grid-cols-3">
              <ProfileField
                label="Contact name"
                name="emergencyContactName"
                value={profile.emergencyContactName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />

              <ProfileField
                label="Phone number"
                name="emergencyContactPhone"
                type="tel"
                value={profile.emergencyContactPhone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />

              <ProfileField
                label="Relationship"
                name="emergencyRelationship"
                value={profile.emergencyRelationship}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </article>

          <div className="flex flex-col justify-end gap-3 sm:flex-row">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Save size={18} />
                  Save changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Edit profile
              </button>
            )}
          </div>
        </form>
      </section>
    </DashboardShell>
  );
}

type ProfileContactProps = {
  icon: React.ElementType;
  label: string;
  value: string;
};

function ProfileContact({
  icon: Icon,
  label,
  value,
}: ProfileContactProps) {
  return (
    <div className="mb-4 flex items-start gap-3 last:mb-0">
      <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>

        <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

type SectionHeaderProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};

function SectionHeader({
  icon: Icon,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-200 px-6 py-5">
      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
        <Icon size={22} />
      </div>

      <div>
        <h2 className="font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

type ProfileFieldProps = {
  label: string;
  name: string;
  value: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function ProfileField({
  label,
  name,
  value,
  type = "text",
  disabled = false,
  required = false,
  onChange,
}: ProfileFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`form-input ${
          disabled
            ? "cursor-not-allowed bg-slate-100 text-slate-500"
            : "bg-white"
        }`}
      />
    </label>
  );
}

type ProfileSelectProps = {
  label: string;
  name: string;
  value: string;
  options: string[];
  disabled?: boolean;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

function ProfileSelect({
  label,
  name,
  value,
  options,
  disabled = false,
  onChange,
}: ProfileSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`form-input ${
          disabled
            ? "cursor-not-allowed bg-slate-100 text-slate-500"
            : "bg-white"
        }`}
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