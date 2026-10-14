import React, { useState } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { CLIENT_TRUSTS } from '../data/mockData';
import { ClientTrust } from '../types';
import {
  Search,
  Download,
} from 'lucide-react';

export const ClientPortalPage: React.FC = () => {
  const [trusts] = useState<ClientTrust[]>(CLIENT_TRUSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrust, setSelectedTrust] = useState<ClientTrust | null>(null);

  const filteredTrusts = trusts.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', path: '/dashboard/' },
          { label: 'Client Portal', path: '/client-portal/' },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded">
              Manager Facility
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">· Trust Relationship Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Client Portal
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Overview of affiliated NHS Trusts, service level agreements (SLAs), monthly throughput, and liaison governance.
          </p>
        </div>
      </div>

      {/* KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
          <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">Participating NHS Trusts</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            {CLIENT_TRUSTS.length}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">Active service agreements</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
          <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">Mean SLA Adherence</span>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
            98.9%
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">Exceeding 98.0% baseline</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
          <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">Monthly Managed Payroll</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            £74.4M
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">Across 75,800 healthcare staff</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
          <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">Governance Status</span>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
            Fully Audited
          </div>
          <span className="text-[11px] text-sky-700 dark:text-sky-400 font-medium mt-1 block">
            ISAE 3402 Type II Assured
          </span>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-4 p-5 transition-colors">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by Trust name, ODS code, or NHS region..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
            />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredTrusts.length}</strong> Trust Accounts
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">ODS Code</th>
                <th className="px-4 py-3 font-semibold">NHS Trust / Organisation</th>
                <th className="px-4 py-3 font-semibold">Region</th>
                <th className="px-4 py-3 font-semibold">Contracts</th>
                <th className="px-4 py-3 font-semibold">SLA Adherence</th>
                <th className="px-4 py-3 font-semibold">Monthly Volume</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTrusts.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedTrust(t)}
                >
                  <td className="px-4 py-3 font-mono font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {t.code}
                  </td>
                  <td className="px-4 py-3 max-w-sm">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{t.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t.primaryContact}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {t.region}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums whitespace-nowrap text-slate-700 dark:text-slate-300">
                    {t.activeContracts} active
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`font-mono font-bold tabular-nums ${
                        t.slaAdherence >= 99.0
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : t.slaAdherence >= 98.0
                          ? 'text-sky-700 dark:text-sky-400'
                          : 'text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {t.slaAdherence}%
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap tabular-nums">
                    {t.monthlyVolume}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        t.status === 'Active'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Trust Details Card */}
      {selectedTrust && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                ODS: {selectedTrust.code}
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedTrust.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{selectedTrust.region} Region</p>
            </div>
            <button
              onClick={() => setSelectedTrust(null)}
              className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              Close Details
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 block mb-1">Primary Liaison</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 block">{selectedTrust.primaryContact}</span>
              <span className="text-[11px] text-sky-700 dark:text-sky-400 block mt-0.5">{selectedTrust.contactEmail}</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 block mb-1">Managed Volume</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 block">{selectedTrust.monthlyVolume}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">BACS Schedule: 28th Monthly</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 block mb-1">Audit Reports</span>
              <button className="text-sky-700 dark:text-sky-400 hover:underline font-semibold flex items-center gap-1 mt-0.5">
                <Download className="w-3.5 h-3.5" />
                <span>Download Q3 Service Performance PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
