import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { INITIAL_TICKETS, INITIAL_FASTER_PAYMENTS, INITIAL_PARENTAL_LEAVES } from '../data/mockData';
import {
  LifeBuoy,
  BookOpen,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  CreditCard,
  HeartHandshake,
  Layers,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { navigate } = useRouter();

  const isManager = user?.role === 'manager';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Dashboard', path: '/dashboard/' }]} />

      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-xl border border-slate-200 dark:border-slate-700">
              {user?.avatarInitials || 'US'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{user?.name}</h1>
                <span
                  className={`text-xs font-semibold uppercase px-2 py-0.5 rounded ${
                    isManager
                      ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {user?.role} Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {user?.trustName} · {user?.department} · Staff ID: <span className="font-mono text-slate-700 dark:text-slate-300">{user?.staffId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/support/')}
              className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              Raise New Enquiry
            </button>
          </div>
        </div>
      </div>

      {/* Role-Specific Sections */}
      {isManager ? (
        /* MANAGER DASHBOARD */
        <div className="space-y-8">
          {/* Manager 6-Entry Grid */}
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Manager Operations & Authorizations</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">All six enterprise operational workflows categorized by function.</p>
            </div>

            {/* Category 1: Core Support & Information */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Category: Core Support & Operational Services
                </span>
                <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* 1. Knowledge Base */}
                <div
                  onClick={() => navigate('/knowledgebase/')}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-sky-300 dark:hover:border-sky-600 transition-all shadow-xs cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 flex items-center justify-center mb-3">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-sky-800 dark:group-hover:text-sky-300 mb-1">
                      Knowledge Base
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                      Search policies, guidance documents, and escalation procedures.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-sky-700 dark:text-sky-400 font-semibold">
                    <span className="font-mono text-slate-400 dark:text-slate-500">/knowledgebase/</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* 2. My Support */}
                <div
                  onClick={() => navigate('/support/')}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-sky-300 dark:hover:border-sky-600 transition-all shadow-xs cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3">
                      <LifeBuoy className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 mb-1">
                      My Support
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                      Full triage access: View all team tickets, employee queries, and SLA tracking.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                    <span className="font-mono text-slate-400 dark:text-slate-500">/support/</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* 3. Dashboard */}
                <div
                  onClick={() => navigate('/dashboard/')}
                  className="bg-sky-50/50 dark:bg-sky-950/30 rounded-xl border border-sky-200 dark:border-sky-800 p-5 transition-all shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 flex items-center justify-center mb-3">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
                      Dashboard (Current View)
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                      Aggregated overview of trust metrics, approvals, and workflow queues.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-sky-100 dark:border-sky-800 flex items-center justify-between text-xs text-sky-800 dark:text-sky-300 font-semibold">
                    <span className="font-mono text-slate-400 dark:text-slate-500">/dashboard/</span>
                    <span className="text-[11px] bg-sky-200/80 dark:bg-sky-900 px-2 py-0.5 rounded text-sky-900 dark:text-sky-200">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category 2: Financial & Operational Input */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Category: Financial & Personnel Input
                </span>
                <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* 4. Faster Payments Input (Manager Only) */}
                <div
                  onClick={() => navigate('/FasterPayment-support/')}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-amber-300 dark:hover:border-amber-600 transition-all shadow-xs cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-amber-800 dark:group-hover:text-amber-300">
                        Faster Payments Input
                      </h3>
                      <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                        Manager
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                      Authorize emergency payroll corrections and high-urgency supplier payments.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 font-semibold">
                    <span className="font-mono text-slate-400 dark:text-slate-500">/FasterPayment-support/</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* 5. Client Portal (Manager Only) */}
                <div
                  onClick={() => navigate('/client-portal/')}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all shadow-xs cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mb-3">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-800 dark:group-hover:text-indigo-300">
                        Client Portal
                      </h3>
                      <span className="text-[10px] font-bold uppercase text-indigo-800 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 px-1.5 py-0.5 rounded">
                        Manager
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                      Partner trust accounts, contract schedules, and SLA adherence dashboards.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-400 font-semibold">
                    <span className="font-mono text-slate-400 dark:text-slate-500">/client-portal/</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* 6. Parental Leave Input (Manager Only) */}
                <div
                  onClick={() => navigate('/maternity-support/')}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-rose-300 dark:hover:border-rose-600 transition-all shadow-xs cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 flex items-center justify-center mb-3">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-rose-800 dark:group-hover:text-rose-300">
                        Parental Leave Input
                      </h3>
                      <span className="text-[10px] font-bold uppercase text-rose-800 dark:text-rose-300 bg-rose-100 dark:bg-rose-950 px-1.5 py-0.5 rounded">
                        Manager
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                      Record maternity, paternity, and adoption leave schemes with payroll scheduling.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-rose-700 dark:text-rose-400 font-semibold">
                    <span className="font-mono text-slate-400 dark:text-slate-500">/maternity-support/</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Manager Action Queues: Faster Payments & Parental Leaves */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Faster Payments Queue */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Faster Payments Authorizations</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Recent emergency submissions</p>
                </div>
                <button
                  onClick={() => navigate('/FasterPayment-support/')}
                  className="text-xs font-semibold text-sky-700 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Full Queue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {INITIAL_FASTER_PAYMENTS.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{item.beneficiaryName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.reason} · {item.department}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100">£{item.amount.toLocaleString()}</div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Parental Leave Notifications */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Parental Leave Records</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Schedule & statutory notification log</p>
                </div>
                <button
                  onClick={() => navigate('/maternity-support/')}
                  className="text-xs font-semibold text-sky-700 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Full Log</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {INITIAL_PARENTAL_LEAVES.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{item.employeeName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.leaveType} · Starts {item.leaveStartDate}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* EMPLOYEE DASHBOARD (Only shown if routed here) */
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs text-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Welcome to My Support</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              As an NHS staff member, you have direct access to log and track your enquiries.
            </p>
            <button
              onClick={() => navigate('/support/')}
              className="px-6 py-2.5 bg-sky-700 text-white rounded-lg text-xs font-semibold"
            >
              Go to My Support
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
