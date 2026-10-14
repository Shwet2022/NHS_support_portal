import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, LifeBuoy, Clock, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();
  const { user, isAuthenticated } = useAuth();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-sky-700 text-white flex items-center justify-center font-bold text-xs">
                SP
              </div>
              <span className="font-bold text-slate-100 text-base">Support Portal</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official enterprise service portal for NHS trusts, healthcare personnel, and operational management.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Role-Based Access Protected</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-slate-100 transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/support/')}
                  className="hover:text-slate-100 transition-colors text-left"
                >
                  My Support
                </button>
              </li>
              {!isAuthenticated && (
                <>
                  <li>
                    <button
                      onClick={() => navigate('/registrationrequest/')}
                      className="hover:text-slate-100 transition-colors text-left"
                    >
                      Registration Request
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/SignIn')}
                      className="hover:text-slate-100 transition-colors text-left"
                    >
                      Sign In
                    </button>
                  </li>
                </>
              )}
              {user?.role === 'manager' && (
                <>
                  <li>
                    <button
                      onClick={() => navigate('/dashboard/')}
                      className="hover:text-slate-100 transition-colors text-left"
                    >
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/knowledgebase/')}
                      className="hover:text-slate-100 transition-colors text-left"
                    >
                      Knowledge Base
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Manager Workflows (Only if Manager) or Support Desk Info */}
          {user?.role === 'manager' ? (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
                Manager Categories
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => navigate('/FasterPayment-support/')}
                    className="hover:text-slate-100 transition-colors text-left"
                  >
                    Faster Payments Input
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/client-portal/')}
                    className="hover:text-slate-100 transition-colors text-left"
                  >
                    Client Portal
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/maternity-support/')}
                    className="hover:text-slate-100 transition-colors text-left"
                  >
                    Parental Leave Input
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
                Service Desk
              </h4>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Support is available 24/7 for urgent clinical payroll discrepancies and IT smartcard access.
              </p>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Mon – Fri: 08:00 – 18:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <LifeBuoy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Tier 1 & Tier 2 Triage</span>
                </div>
              </div>
            </div>
          )}

          {/* Standards & Security */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Governance & Security
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              All enquiries and submissions are audited in accordance with NHS Digital Information Governance standards.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Restricted Confidential Access</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} NHS SBS Support Portal. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">WCAG 2.1 AA Compliant</span>
            <span>·</span>
            <span className="text-slate-400">NHS Cyber Essentials Plus</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
