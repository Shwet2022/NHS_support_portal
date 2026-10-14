import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';

interface AccessDeniedProps {
  attemptedPath: string;
  reason?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ attemptedPath, reason }) => {
  const { navigate } = useRouter();
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center transition-colors">
        <div className="w-14 h-14 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <span className="text-xs font-semibold tracking-wider uppercase text-rose-600 dark:text-rose-400 mb-1 block">
          403 Access Denied
        </span>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Manager Authorization Required
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          {reason || (
            <>
              You do not have administrative permission to view the requested destination{' '}
              <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded font-mono text-xs">
                {attemptedPath}
              </code>
              . This service is restricted to verified managers and operations leads.
            </>
          )}
        </p>

        {isAuthenticated && user && (
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-left mb-6 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-500 dark:text-slate-400">Your Current Identity:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-500 dark:text-slate-400">Assigned Role:</span>
              <span className="capitalize font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                {user.role}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Staff ID:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{user.staffId}</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {user?.role === 'manager' ? (
            <button
              onClick={() => navigate('/dashboard/')}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg text-white bg-sky-700 hover:bg-sky-800 transition-colors shadow-xs"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/support/')}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg text-white bg-sky-700 hover:bg-sky-800 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to My Support</span>
            </button>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
