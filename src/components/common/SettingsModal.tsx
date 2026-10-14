import React from 'react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import {
  Sun,
  Moon,
  Monitor,
  X,
  Sliders,
  Check,
  Eye,
  Sparkles,
  LogOut,
  LogIn,
  User as UserIcon,
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { theme, setTheme, resolvedTheme, isSettingsOpen, setIsSettingsOpen } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { navigate } = useRouter();

  if (!isSettingsOpen) return null;

  const handleSignOut = () => {
    setIsSettingsOpen(false);
    logout();
    navigate('/');
  };

  const handleSignIn = () => {
    setIsSettingsOpen(false);
    navigate('/SignIn');
  };

  const themes: {
    id: ThemeMode;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
  }[] = [
    {
      id: 'light',
      label: 'Day Mode (Light)',
      description: 'Clean high-clarity daylight theme designed for bright office and clinic environments.',
      icon: Sun,
      accent: 'border-amber-400 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300',
    },
    {
      id: 'dark',
      label: 'Night Mode (Dark)',
      description: 'Low-glare dark theme optimized for night shifts, low-light clinical wards, and eye comfort.',
      icon: Moon,
      accent: 'border-sky-500 bg-slate-900 text-sky-400',
    },
    {
      id: 'system',
      label: 'Follow System Device',
      description: 'Automatically synchronizes with your computer or mobile operating system schedule.',
      icon: Monitor,
      accent: 'border-purple-400 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
    >
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 id="settings-dialog-title" className="text-lg font-bold tracking-tight">
                Portal Settings & Preferences
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage appearance, display comfort, and your account session.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account & Session Management Section */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <UserIcon className="w-3.5 h-3.5" />
            <span>Account & Session</span>
          </label>

          {isAuthenticated && user ? (
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                  {user.avatarInitials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                      {user.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                        user.role === 'manager'
                          ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user.email} · <span className="font-mono">{user.staffId}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900 transition-colors shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Not Signed In</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Sign in with your staff ID to access personal enquiries or manager dashboards.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSignIn}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-sky-700 hover:bg-sky-800 transition-colors shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>

        {/* Theme Mode Picker */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Day / Night Theme</span>
            </label>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Active: {resolvedTheme === 'dark' ? 'Night Mode' : 'Day Mode'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {themes.map((t) => {
              const Icon = t.icon;
              const isSelected = theme === t.id;

              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  type="button"
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-sky-600 dark:border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/50 dark:bg-sky-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${t.accent}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                        {t.label}
                      </span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Display Comfort Preview */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Theme Preference Auto-Saved</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
            Your preference is automatically remembered on this browser and complies with WCAG 2.1 AA accessibility guidelines.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Portal</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
