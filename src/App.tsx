import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AccessDenied } from './components/common/AccessDenied';
import { SettingsModal } from './components/common/SettingsModal';

// Pages
import { HomePage } from './pages/HomePage';
import { MySupportPage } from './pages/MySupportPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { SignInPage } from './pages/SignInPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { DashboardPage } from './pages/DashboardPage';
import { FasterPaymentsPage } from './pages/FasterPaymentsPage';
import { ClientPortalPage } from './pages/ClientPortalPage';
import { MaternitySupportPage } from './pages/MaternitySupportPage';

const AppContent: React.FC = () => {
  const { normalizedRoute, navigate } = useRouter();
  const { user, isAuthenticated, isLoading, canAccessRoute } = useAuth();

  const accessCheck = canAccessRoute(normalizedRoute);

  // Auto-redirect unauthenticated users trying to access protected routes
  useEffect(() => {
    if (!isLoading && accessCheck.requiresAuth && !isAuthenticated) {
      navigate(`/SignIn?returnUrl=${encodeURIComponent(normalizedRoute)}`, true);
    }
  }, [isLoading, accessCheck.requiresAuth, isAuthenticated, normalizedRoute, navigate]);

  const renderCurrentView = () => {
    if (isLoading) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center text-xs text-slate-500 dark:text-slate-400">
            <div className="w-8 h-8 border-2 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Loading Support Portal...</span>
          </div>
        </div>
      );
    }

    // Role Guard: If route requires manager and user is signed in as employee (or non-manager)
    if (accessCheck.requiresManager && user?.role !== 'manager') {
      return <AccessDenied attemptedPath={normalizedRoute} />;
    }

    // Unauthenticated on protected route
    if (accessCheck.requiresAuth && !isAuthenticated) {
      return <SignInPage />;
    }

    // Route Switching
    switch (normalizedRoute) {
      case '/':
        return <HomePage />;
      case '/support/':
        return <MySupportPage />;
      case '/registrationrequest/':
        return <RegistrationPage />;
      case '/SignIn':
        return <SignInPage />;
      case '/knowledgebase/':
        return <KnowledgeBasePage />;
      case '/dashboard/':
        return <DashboardPage />;
      case '/FasterPayment-support/':
        return <FasterPaymentsPage />;
      case '/client-portal/':
        return <ClientPortalPage />;
      case '/maternity-support/':
        return <MaternitySupportPage />;
      default:
        // Fallback for unrecognized routes
        return (
          <div className="max-w-md mx-auto py-20 px-4 text-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Page Not Found</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              The route <code className="font-mono text-slate-700 dark:text-slate-300">{normalizedRoute}</code> could not be located in the support portal directory.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Return to Home
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <Header />
      <main className="flex-1">{renderCurrentView()}</main>
      <Footer />
      <SettingsModal />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
