import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  LogIn,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';

export const SignInPage: React.FC = () => {
  const { navigate, queryParams } = useRouter();
  const { login, isAuthenticated, user, logout } = useAuth();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot password modal
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySubmitted, setRecoverySubmitted] = useState(false);

  const returnUrl = queryParams.returnUrl;

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMessage('Please enter your staff ID or email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await login(emailInput.trim(), passwordInput);
    setIsSubmitting(false);

    if (res.success) {
      if (returnUrl) {
        navigate(returnUrl);
      } else {
        const isManager =
          emailInput.toLowerCase().includes('manager') ||
          emailInput.toLowerCase().includes('sarah') ||
          emailInput.toLowerCase().includes('admin');
        navigate(isManager ? '/dashboard/' : '/support/');
      }
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) return;
    setRecoverySubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Sign in', path: '/SignIn' }]} />

      {/* Header Banner */}
      <div className="text-center max-w-lg mx-auto space-y-2">
        <div className="w-12 h-12 bg-sky-700 text-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-xs">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Support Portal Sign In
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter your authorized NHS staff credentials to access your support portal services.
        </p>
      </div>

      {returnUrl && (
        <div className="max-w-md mx-auto bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 rounded-lg p-3 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            Authentication required to access <strong className="font-mono">{returnUrl}</strong>. You will be redirected after signing in.
          </span>
        </div>
      )}

      {/* Currently logged-in profile reminder */}
      {isAuthenticated && user && (
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
              {user.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{user.name}</span>
                <span
                  className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    user.role === 'manager'
                      ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Signed in as <span className="font-mono">{user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate(user.role === 'manager' ? '/dashboard/' : '/support/')}
              className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Go to {user.role === 'manager' ? 'Dashboard' : 'My Support'}
            </button>
            <button
              onClick={logout}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Centered Professional Sign-In Card */}
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs text-sky-800 dark:text-sky-300 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-sky-700 dark:text-sky-400" />
            <span>NHS SBS Care Identity / Single Sign-On</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Sign in to your account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Enter your assigned email address and password to continue.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-lg text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
          {/* Username / Email */}
          <div>
            <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
              Staff Email Address or User ID <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@sbs.nhs.uk"
                className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-sky-600 dark:focus:border-sky-400 text-slate-900 dark:text-white text-xs font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Password <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="text-sky-700 dark:text-sky-400 hover:underline text-[11px] font-semibold"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-sky-600 dark:focus:border-sky-400 text-slate-900 dark:text-white text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-sky-700 focus:ring-sky-500"
              />
              <span>Remember my login on this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-sky-700 hover:bg-sky-800 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-semibold rounded-lg text-sm transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Registration Link */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>Don&apos;t have an NHS portal account yet?</span>
          <button
            onClick={() => navigate('/registrationrequest/')}
            className="text-sky-700 dark:text-sky-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>Registration Request</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Test Sign-In Accounts Information Card */}
      <div className="max-w-md mx-auto bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 p-5 text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-sky-700 dark:text-sky-400" />
            <span>Test Sign-In Accounts</span>
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Click to autofill form</span>
        </div>

        <div className="space-y-2">
          {/* Manager Account */}
          <div className="p-2.5 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-sky-300 dark:hover:border-sky-500 transition-colors">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 dark:text-slate-100">Manager: Sarah Jenkins</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 uppercase">
                  Manager
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                ID: <span className="text-slate-800 dark:text-slate-200 font-semibold">manager@sbs.nhs.uk</span> · Pass: <span className="text-slate-800 dark:text-slate-200">Password123!</span>
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                Full 6 categories + all employee enquiries
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmailInput('manager@sbs.nhs.uk');
                setPasswordInput('Password123!');
              }}
              className="px-2.5 py-1.5 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 font-semibold rounded text-[11px] transition-colors shrink-0"
            >
              Fill ID
            </button>
          </div>

          {/* Primary Employee Account */}
          <div className="p-2.5 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 dark:text-slate-100">Employee: David Clarke</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase">
                  Employee
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                ID: <span className="text-slate-800 dark:text-slate-200 font-semibold">employee@sbs.nhs.uk</span> · Pass: <span className="text-slate-800 dark:text-slate-200">Password123!</span>
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                My Support only · Sees only David&apos;s cases
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmailInput('employee@sbs.nhs.uk');
                setPasswordInput('Password123!');
              }}
              className="px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-semibold rounded text-[11px] transition-colors shrink-0"
            >
              Fill ID
            </button>
          </div>

          {/* Secondary Employee Account */}
          <div className="p-2.5 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 dark:text-slate-100">Employee: Rachel Adams</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                  Employee
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                ID: <span className="text-slate-800 dark:text-slate-200 font-semibold">rachel@sbs.nhs.uk</span> · Pass: <span className="text-slate-800 dark:text-slate-200">Password123!</span>
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                My Support only · Sees only Rachel&apos;s cases
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmailInput('rachel@sbs.nhs.uk');
                setPasswordInput('Password123!');
              }}
              className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded text-[11px] transition-colors shrink-0"
            >
              Fill ID
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base">Reset Staff Password</h3>
              <button
                onClick={() => {
                  setForgotPasswordOpen(false);
                  setRecoverySubmitted(false);
                }}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {recoverySubmitted ? (
              <div className="space-y-4 text-center py-3">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Recovery Link Dispatched</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    If an account exists for <span className="font-mono text-slate-900 dark:text-slate-100">{recoveryEmail}</span>, instructions have been sent to your NHS mailbox.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setForgotPasswordOpen(false);
                    setRecoverySubmitted(false);
                  }}
                  className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Enter your NHS registered email address below. We will send a secure password reset link to your official mailbox.
                </p>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">NHS Email Address</label>
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="name@sbs.nhs.uk"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-sky-600 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(false)}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-semibold shadow-xs"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
