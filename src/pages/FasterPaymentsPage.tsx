import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { INITIAL_FASTER_PAYMENTS } from '../data/mockData';
import { FasterPaymentRecord } from '../types';
import {
  CreditCard,
  PlusCircle,
  CheckCircle2,
  ShieldCheck,
  X,
} from 'lucide-react';

export const FasterPaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<FasterPaymentRecord[]>(INITIAL_FASTER_PAYMENTS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Form State
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [sortCode, setSortCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('Emergency Locum Rota Payment');
  const [urgencyLevel, setUrgencyLevel] = useState<FasterPaymentRecord['urgencyLevel']>('Emergency (Same Day)');
  const [department] = useState('Acute Medicine Operations');

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beneficiaryName.trim() || !amount) return;

    const newRef = `FP-2026-${Math.floor(1100 + Math.random() * 900)}`;
    const newRecord: FasterPaymentRecord = {
      id: `fp-${Date.now().toString().slice(-4)}`,
      reference: newRef,
      beneficiaryName: beneficiaryName.trim(),
      sortCode: sortCode.trim() || '20-00-00',
      accountNumber: accountNumber.trim() || '12345678',
      amount: parseFloat(amount) || 0,
      reason: reason.trim(),
      requestedBy: user?.name || 'Manager Signatory',
      department,
      status: 'Authorized',
      urgencyLevel,
      submittedAt: 'Just now',
    };

    setPayments([newRecord, ...payments]);
    setIsFormOpen(false);
    setBeneficiaryName('');
    setSortCode('');
    setAccountNumber('');
    setAmount('');
    setSuccessBanner(`Faster Payment requisition ${newRef} authorized and submitted to treasury.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', path: '/dashboard/' },
          { label: 'Faster Payments Input', path: '/FasterPayment-support/' },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">
              Manager Facility
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">· Section 4 Banking Dispatch</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Faster Payments Input
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Authorize same-day emergency bank transfers for critical payroll corrections and urgent supplier settlement.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-semibold text-sm transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Payment Requisition</span>
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="font-semibold text-emerald-900 dark:text-emerald-300">
            Dismiss
          </button>
        </div>
      )}

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
          <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">Active Requisitions</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            {payments.length}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">Current monthly batch</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
          <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">Total Authorized Volume</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            £
            {payments
              .reduce((acc, curr) => acc + curr.amount, 0)
              .toLocaleString('en-GB', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">Cleared via SBS Treasury</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
          <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">Approval Delegation</span>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
            {user?.name}
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Signatory Tier 2 Certified
          </span>
        </div>
      </div>

      {/* Table of Faster Payments */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">Registered Faster Payment Directives</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{payments.length} items logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Reference</th>
                <th className="px-4 py-3 font-semibold">Beneficiary Name</th>
                <th className="px-4 py-3 font-semibold">Sort & Account</th>
                <th className="px-4 py-3 font-semibold">Urgency</th>
                <th className="px-4 py-3 font-semibold text-right">Amount (GBP)</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {p.reference}
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{p.beneficiaryName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{p.reason}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {p.sortCode} · {p.accountNumber}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-[11px] text-slate-700 dark:text-slate-300">{p.urgencyLevel}</span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap tabular-nums">
                    £{p.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        p.status === 'Completed'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : p.status === 'Authorized'
                          ? 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                          : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap tabular-nums">
                    {p.submittedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Requisition Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">
                  Manager Authorization
                </span>
                <h3 className="text-lg font-bold mt-1">
                  Authorize Faster Payment Requisition
                </h3>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Beneficiary Name (Account Holder / Vendor)
                </label>
                <input
                  type="text"
                  required
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  placeholder="e.g. Dr. Alistair Vance"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">Sort Code</label>
                  <input
                    type="text"
                    required
                    value={sortCode}
                    onChange={(e) => setSortCode(e.target.value)}
                    placeholder="20-45-14"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-mono focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">Account Number</label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="89104423"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-mono focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">Amount (£ GBP)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1450.00"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-mono focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">Urgency</label>
                  <select
                    value={urgencyLevel}
                    onChange={(e) => setUrgencyLevel(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                  >
                    <option value="Emergency (Same Day)">Emergency (Same Day)</option>
                    <option value="Priority (24h)">Priority (24h)</option>
                    <option value="Standard Faster Payment">Standard Faster Payment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">Reason for Emergency Payment</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Discrepancy correction, locum payroll shortfall"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div className="font-semibold text-slate-800 dark:text-slate-200">Signatory Compliance Confirmation</div>
                <p>
                  As an authorized manager, you certify that this emergency expenditure complies with Trust Standing Financial Instructions (SFIs).
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-md font-semibold transition-colors shadow-xs"
                >
                  Authorize Payment Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
