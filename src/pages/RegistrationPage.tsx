import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { CLIENT_TRUSTS } from '../data/mockData';
import {
  CheckCircle2,
  ShieldCheck,
  Mail,
  User,
  Hash,
  ArrowRight,
} from 'lucide-react';

export const RegistrationPage: React.FC = () => {
  const { navigate } = useRouter();
  const { registerUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [trust, setTrust] = useState('Leeds Teaching Hospitals NHS Trust');
  const [staffId, setStaffId] = useState('');
  const [department, setDepartment] = useState('');
  const [requestedRole, setRequestedRole] = useState<'employee' | 'manager'>('employee');
  const [justification, setJustification] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{
    reference: string;
    name: string;
    role: string;
    trust: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const registrationRef = `REG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    setSubmittedResult({
      reference: registrationRef,
      name: fullName,
      role: requestedRole,
      trust,
    });
    setIsSubmitting(false);
  };

  const handleInstantSignInAsNewUser = async () => {
    if (!submittedResult) return;
    await registerUser({
      name: submittedResult.name,
      email,
      role: submittedResult.role as any,
      department,
      staffId: `SBS-${staffId}`,
      trustName: submittedResult.trust,
    });
    navigate(submittedResult.role === 'manager' ? '/dashboard/' : '/support/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Registration', path: '/registrationrequest/' }]} />

      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
        <span className="text-xs font-semibold uppercase text-sky-700 dark:text-sky-400 tracking-wider block mb-1">
          Identity Management
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Portal Registration Request
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Submit your NHS staff credentials to request role-authorized portal access for healthcare support and finance workflows.
        </p>
      </div>

      {submittedResult ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 p-8 shadow-xs text-center space-y-6 transition-colors">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto">
            <span className="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">
              Request Received
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 mb-2">
              Registration Under Verification
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Your request has been logged under reference{' '}
              <strong className="font-mono text-slate-900 dark:text-slate-100">{submittedResult.reference}</strong>. A verification notification has been dispatched to your Trust Registration Authority champion.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Applicant Name:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{submittedResult.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Organisation / Trust:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{submittedResult.trust}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Requested Role:</span>
              <span className="capitalize font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded">
                {submittedResult.role}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handleInstantSignInAsNewUser}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <span>Instant Activate in Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => navigate('/SignIn')}
              className="px-5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors">
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  Full Legal Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Fiona Scott"
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  NHS or Trust Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="fiona.scott@leedsth.nhs.uk"
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Must end with @nhs.net or accredited Trust domain.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                    Participating NHS Trust <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={trust}
                    onChange={(e) => setTrust(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                  >
                    {CLIENT_TRUSTS.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                    <option value="Other NHS Foundation Trust">Other NHS Foundation Trust</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                    Staff ESR / Payroll Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={staffId}
                      onChange={(e) => setStaffId(e.target.value)}
                      placeholder="e.g. 5092144"
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-mono focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                    Department / Ward <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Oncology Ward 6, Finance"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                    Requested Access Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={requestedRole}
                    onChange={(e) => setRequestedRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:outline-none focus:border-sky-600 font-medium text-slate-900 dark:text-white"
                  >
                    <option value="employee">Employee Role (Support Case Logging)</option>
                    <option value="manager">Manager Role (Departmental Approvals & Queues)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  Business Justification <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Outline your job title, line manager name, and why you require this role access..."
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    required
                    className="mt-0.5 rounded text-sky-700 focus:ring-sky-500"
                  />
                  <span className="text-slate-600 dark:text-slate-400 text-xs leading-normal">
                    I confirm that I am an authorized NHS employee or healthcare contractor. I agree to comply with NHS Caldicott principles and Data Security standards.
                  </span>
                </label>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={!agreedTerms || isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 bg-sky-700 hover:bg-sky-800 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-semibold rounded-lg transition-colors shadow-xs"
                >
                  {isSubmitting ? 'Validating Application...' : 'Submit Registration Request'}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar Guidelines */}
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 text-xs space-y-3 transition-colors">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                <ShieldCheck className="w-4 h-4 text-sky-700 dark:text-sky-400" />
                <span>Verification Checklist</span>
              </div>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200">1.</span>
                  <span>ESR payroll number must match the Trust payroll database.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200">2.</span>
                  <span>Manager role requires line management endorsement from a Band 8a+ lead.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200">3.</span>
                  <span>Notifications are routed strictly to official NHS mailboxes.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 text-xs space-y-3 transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Already Have an Account?</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                If your account has already been provisioned or you want to test with demo manager/employee accounts, proceed to sign in.
              </p>
              <button
                onClick={() => navigate('/SignIn')}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-md transition-colors"
              >
                Go to Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
