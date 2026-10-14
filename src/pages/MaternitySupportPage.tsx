import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { INITIAL_PARENTAL_LEAVES } from '../data/mockData';
import { ParentalLeaveRecord } from '../types';
import {
  HeartHandshake,
  PlusCircle,
  CheckCircle2,
  Calendar,
  X,
  FileCheck,
} from 'lucide-react';

export const MaternitySupportPage: React.FC = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<ParentalLeaveRecord[]>(INITIAL_PARENTAL_LEAVES);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Form State
  const [employeeName, setEmployeeName] = useState('');
  const [staffPayrollId, setStaffPayrollId] = useState('');
  const [leaveType, setLeaveType] = useState<ParentalLeaveRecord['leaveType']>('Maternity Leave');
  const [expectedDueDate, setExpectedDueDate] = useState('');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [intendedReturnDate, setIntendedReturnDate] = useState('');
  const [kitDays, setKitDays] = useState(10);
  const [occupationalEligible, setOccupationalEligible] = useState(true);

  const handleCreateLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName.trim() || !staffPayrollId.trim() || !leaveStartDate) return;

    const newRef = `PL-2026-0${Math.floor(50 + Math.random() * 40)}`;
    const newRecord: ParentalLeaveRecord = {
      id: `mat-${Date.now().toString().slice(-4)}`,
      reference: newRef,
      employeeName: employeeName.trim(),
      staffPayrollId: staffPayrollId.trim(),
      leaveType,
      expectedDueDate: expectedDueDate || leaveStartDate,
      leaveStartDate,
      intendedReturnDate: intendedReturnDate || 'To be confirmed',
      status: 'HR Review',
      kitDaysRequested: Number(kitDays) || 0,
      occupationalPayEligible: occupationalEligible,
      submittedAt: 'Just now',
    };

    setLeaves([newRecord, ...leaves]);
    setIsFormOpen(false);
    setEmployeeName('');
    setStaffPayrollId('');
    setExpectedDueDate('');
    setLeaveStartDate('');
    setIntendedReturnDate('');
    setSuccessBanner(`Parental Leave schedule ${newRef} logged and submitted for HR review.`);
    setTimeout(() => setSuccessBanner(null), 8000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', path: '/dashboard/' },
          { label: 'Parental Leave Input', path: '/maternity-support/' },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded">
              Manager Facility
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">· HR & Payroll Schedule Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Parental Leave Input
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Register statutory and NHS occupational maternity, paternity, adoption, and shared parental leave submissions.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-semibold text-sm transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Leave Submission</span>
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="font-semibold text-emerald-900 dark:text-emerald-300">
            Dismiss
          </button>
        </div>
      )}

      {/* Scheme Information Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 transition-colors">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">NHS Occupational Scheme</h4>
            <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Provides 8 weeks full pay, 18 weeks half pay + SMP, followed by 13 weeks SMP for staff with 12+ months service.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Statutory Notice (MAT B1)</h4>
            <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              MAT B1 form or formal matching certificate must be validated by the manager before payroll lock.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Keeping in Touch (KIT Days)</h4>
            <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Staff can work up to 10 KIT days without affecting maternity pay or statutory leave duration.
            </p>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">Logged Parental Leave Records</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{leaves.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Reference</th>
                <th className="px-4 py-3 font-semibold">Staff Member</th>
                <th className="px-4 py-3 font-semibold">Leave Category</th>
                <th className="px-4 py-3 font-semibold">Start Date</th>
                <th className="px-4 py-3 font-semibold">Expected Return</th>
                <th className="px-4 py-3 font-semibold">KIT Days</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaves.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {item.reference}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{item.employeeName}</div>
                    <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{item.staffPayrollId}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{item.leaveType}</span>
                    {item.occupationalPayEligible && (
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">Occupational Eligible</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap tabular-nums">
                    {item.leaveStartDate}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap tabular-nums">
                    {item.intendedReturnDate}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap tabular-nums">
                    {item.kitDaysRequested} days
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        item.status === 'Approved'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : item.status === 'Payroll Scheduled'
                          ? 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                          : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded">
                  Manager Input Form
                </span>
                <h3 className="text-lg font-bold mt-1">
                  Submit Parental Leave Record
                </h3>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLeave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">Employee Full Name</label>
                  <input
                    type="text"
                    required
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder="e.g. Dr. Rebecca Thorne"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">Staff Payroll ID</label>
                  <input
                    type="text"
                    required
                    value={staffPayrollId}
                    onChange={(e) => setStaffPayrollId(e.target.value)}
                    placeholder="NHS-EMP-9182"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-mono focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                >
                  <option value="Maternity Leave">Maternity Leave (MAT)</option>
                  <option value="Paternity Leave">Paternity Leave (PAT)</option>
                  <option value="Adoption Leave">Adoption Leave (ADOP)</option>
                  <option value="Shared Parental Leave">Shared Parental Leave (SPL)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">Due / Placement Date</label>
                  <input
                    type="date"
                    value={expectedDueDate}
                    onChange={(e) => setExpectedDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">Leave Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveStartDate}
                    onChange={(e) => setLeaveStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">Intended Return</label>
                  <input
                    type="date"
                    value={intendedReturnDate}
                    onChange={(e) => setIntendedReturnDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">KIT Days Allocated</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={kitDays}
                    onChange={(e) => setKitDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-mono focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={occupationalEligible}
                      onChange={(e) => setOccupationalEligible(e.target.checked)}
                      className="rounded text-sky-700 focus:ring-sky-500"
                    />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Qualifies for NHS Occupational Pay</span>
                  </label>
                </div>
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
                  Submit Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
