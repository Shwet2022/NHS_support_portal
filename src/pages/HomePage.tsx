import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import {
  LifeBuoy,
  UserPlus,
  LogIn,
  ArrowRight,
  Shield,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-wider uppercase text-sky-700 dark:text-sky-400 mb-2 block">
              NHS SBS Enterprise Access
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 tracking-tight text-balance mb-4">
              Support Portal
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              Welcome to the official support portal. Access technical and operational support, submit new account registrations, search policy knowledge bases, and sign in for role-specific services.
            </p>

            {/* Quick Action CTA Row */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/support/')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white bg-sky-700 hover:bg-sky-800 font-semibold text-sm transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
              >
                <LifeBuoy className="w-4 h-4" />
                <span>Access My Support</span>
              </button>

              <button
                onClick={() => navigate('/registrationrequest/')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <UserPlus className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span>Submit Registration</span>
              </button>

              {!isAuthenticated ? (
                <button
                  onClick={() => navigate('/SignIn')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sky-800 dark:text-sky-300 hover:text-sky-900 hover:bg-sky-50 dark:hover:bg-slate-800 font-semibold text-sm transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate(user?.role === 'manager' ? '/dashboard/' : '/support/')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sky-800 dark:text-sky-300 hover:text-sky-900 hover:bg-sky-50 dark:hover:bg-slate-800 font-semibold text-sm transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Go to {user?.role === 'manager' ? 'Dashboard' : 'My Support'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Primary Key Action Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Core Services</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Choose an option below to get assistance or manage your credentials.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: My Support */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs">
            <div>
              <div className="w-12 h-12 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 flex items-center justify-center mb-4">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">My Support</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Log a new service enquiry, track existing ticket progress, report payroll discrepancies, or request IT systems support.
              </p>
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mb-6">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Direct ticket tracking with reference code</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Tier 1 & Tier 2 support desk routing</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/support/')}
              className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-300 font-semibold text-sm transition-colors border border-slate-200 dark:border-slate-700"
            >
              <span>Open My Support</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Registration */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs">
            <div>
              <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Registration</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                New NHS staff or trust partners can submit an access request with payroll ID and department sponsorship.
              </p>
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mb-6">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Automated NHS trust email verification</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Role approval within 1 business day</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/registrationrequest/')}
              className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-300 font-semibold text-sm transition-colors border border-slate-200 dark:border-slate-700"
            >
              <span>Request Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Sign In & Authentication */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs">
            <div>
              <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-4">
                <LogIn className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Sign In</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Sign in with your NHS staff credentials to access your support enquiries, track case updates, or manage departmental services.
              </p>
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mb-6">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Secure staff and manager authentication</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>24/7 self-service and enquiry tracking</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/SignIn')}
              className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 text-purple-800 dark:text-purple-300 font-semibold text-sm transition-colors border border-slate-200 dark:border-slate-700"
            >
              <span>{isAuthenticated ? 'View Account' : 'Sign in to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Enterprise Information Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors">
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
              Need Direct Assistance with an Ongoing Service?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              If your request relates to a critical clinical roster, urgent payroll correction, or system smartcard block, log an enquiry directly in My Support for triage.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/support/')}
              className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              Go to My Support
            </button>
            <button
              onClick={() => navigate('/registrationrequest/')}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors"
            >
              Register Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
