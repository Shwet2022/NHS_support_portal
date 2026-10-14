import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Menu,
  X,
  LogIn,
  LogOut,
  User as UserIcon,
  LifeBuoy,
  Sun,
  Moon,
  Sliders,
  Settings,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
}

export const Header: React.FC = () => {
  const { navigate, normalizedRoute } = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { resolvedTheme, toggleTheme, setIsSettingsOpen } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Build navigation items strictly based on authentication and role
  const getNavItems = (): NavItem[] => {
    if (!isAuthenticated || !user) {
      return [
        { label: 'Home', path: '/' },
        { label: 'My Support', path: '/support/' },
        { label: 'Registration', path: '/registrationrequest/' },
        { label: 'Sign in', path: '/SignIn' },
      ];
    }

    if (user.role === 'manager') {
      return [
        { label: 'Knowledge Base', path: '/knowledgebase/' },
        { label: 'My Support', path: '/support/' },
        { label: 'Dashboard', path: '/dashboard/' },
        { label: 'Faster Payments Input', path: '/FasterPayment-support/' },
        { label: 'Client Portal', path: '/client-portal/' },
        { label: 'Parental Leave Input', path: '/maternity-support/' },
      ];
    }

    // Employee role: strictly My Support
    return [
      { label: 'My Support', path: '/support/' },
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    navigate(path);
  };

  const handleSignOut = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  const isRouteActive = (itemPath: string) => {
    if (itemPath === '/' && normalizedRoute === '/') return true;
    if (itemPath !== '/' && normalizedRoute.startsWith(itemPath)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Wordmark Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick(isAuthenticated ? (user?.role === 'manager' ? '/dashboard/' : '/support/') : '/')}
              className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded-md p-1"
              aria-label="Support Portal Home"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-700 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
                SP
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-base tracking-tight leading-none block">
                  Support Portal
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-none block mt-0.5">
                  NHS SBS Enterprise Services
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {navItems.map((item) => {
              const active = isRouteActive(item.path);
              const isSignInButton = !isAuthenticated && item.path === '/SignIn';

              if (isSignInButton) {
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-sky-700 hover:bg-sky-800 transition-colors whitespace-nowrap shrink-0 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
                    active
                      ? 'text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 font-semibold border-b-2 border-sky-700 dark:border-sky-400 rounded-b-none'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Account & Actions Zone */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Day / Night Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
              title={resolvedTheme === 'dark' ? 'Switch to Day Mode (Light)' : 'Switch to Night Mode (Dark)'}
              aria-label={resolvedTheme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Settings Dialog Trigger */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
              title="Portal Settings & Appearance"
              aria-label="Open portal settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {isAuthenticated && user ? (
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-semibold text-xs border border-slate-300 dark:border-slate-600">
                    {user.avatarInitials}
                  </div>
                  <div className="text-left text-xs leading-tight">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate max-w-[130px]">
                      {user.name}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize block">
                      {user.role} role
                    </span>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <div className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                        <span className="font-mono text-slate-700 dark:text-slate-300">{user.staffId}</span> · {user.department}
                      </div>
                    </div>
                    {user.role === 'manager' && (
                      <button
                        onClick={() => handleNavClick('/dashboard/')}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>My Dashboard</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleNavClick('/support/')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <LifeBuoy className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Support Tickets</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setIsSettingsOpen(true);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Sliders className="w-3.5 h-3.5 text-slate-400" />
                      <span>Theme & Display Settings</span>
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Mobile menu toggle button */}
            <div className="flex lg:hidden items-center gap-1">
              {!isAuthenticated && (
                <button
                  onClick={() => handleNavClick('/SignIn')}
                  className="px-2.5 py-1 text-xs font-semibold text-white bg-sky-700 rounded-md"
                >
                  Sign in
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
                aria-label={mobileMenuOpen ? 'Close main navigation' : 'Open main navigation'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-1 shadow-lg">
          {isAuthenticated && user && (
            <div className="px-3 py-3 mb-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
                  {user.avatarInitials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role} role · {user.staffId}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {navItems.map((item) => {
              const active = isRouteActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 mt-2 space-y-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSettingsOpen(true);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Theme & Display Settings</span>
            </button>

            {isAuthenticated && (
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
