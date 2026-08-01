import Link from "next/link";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Target,
} from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-100 [font-family:var(--font-geist-sans)]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col xl:px-16">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-blue-500 blur-3xl" />
            <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-cyan-400 blur-3xl" />
          </div>

          <Link href="/" className="relative flex w-fit items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-950/40">
              <Target size={23} />
            </div>
            <div>
              <p className="font-bold tracking-tight">Timesheet &amp; Performance</p>
              <p className="text-xs font-medium text-slate-400">Management System</p>
            </div>
          </Link>

          <div className="relative my-auto max-w-lg py-16">
            <div className="h-1 w-14 rounded-full bg-blue-500" />
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Manage your work.
            </h1>
            <p className="mt-4 text-lg text-slate-400">Timesheets. Tasks. Performance.</p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-12 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Target size={23} />
              </div>
              <div>
                <p className="font-bold tracking-tight text-slate-900">Timesheet &amp; Performance</p>
                <p className="text-xs font-medium text-slate-500">Management System</p>
              </div>
            </Link>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <LockKeyhole size={23} />
              </div>

              <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Welcome back
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to access your timesheet and performance workspace.
              </p>

              <form action="/dashboard" className="mt-8 space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                    Work email address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@organization.com"
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    <button type="button" className="text-xs font-semibold text-blue-600 transition hover:text-blue-700">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <LockKeyhole size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <label className="flex w-fit items-center gap-2.5 text-sm text-slate-600">
                  <input type="checkbox" name="remember" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  Remember me on this device
                </label>

                <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200">
                  Sign in to your workspace
                  <ArrowRight size={18} />
                </button>
              </form>

              <p className="mt-7 text-center text-xs leading-5 text-slate-500">
                Need access? Contact your system administrator to have your account created.
              </p>
            </div>

            <p className="mt-7 text-center text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Timesheet &amp; Performance Management System
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
