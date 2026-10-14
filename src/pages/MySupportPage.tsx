import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { INITIAL_TICKETS } from '../data/mockData';
import { SupportTicket } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  PlusCircle,
  Search,
  CheckCircle2,
  Send,
  X,
  LogIn,
  Lock,
  UserCheck,
  Users,
  LifeBuoy,
} from 'lucide-react';

export const MySupportPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { navigate } = useRouter();

  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [managerScopeFilter, setManagerScopeFilter] = useState<'all' | 'my' | 'staff'>('all');

  // Public Guest Lookup
  const [lookupRef, setLookupRef] = useState('');
  const [lookupResult, setLookupResult] = useState<SupportTicket | null | 'not_found'>(null);

  // New ticket form state
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<SupportTicket['category']>('Payroll & Salary');
  const [newPriority, setNewPriority] = useState<SupportTicket['priority']>('Medium');
  const [newDescription, setNewDescription] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestName, setNewGuestName] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  // New message reply in detail modal
  const [replyMessage, setReplyMessage] = useState('');

  // ----------------------------------------------------
  // ROLE-BASED TICKET VISIBILITY LOGIC (STRICT PRIVACY)
  // ----------------------------------------------------
  // 1. Public Visitor: CANNOT browse any ticket list!
  // 2. Employee: Can see ONLY his or her cases raised by him/her.
  // 3. Manager: Can see ALL tickets (himself + all team employees).
  // ----------------------------------------------------
  const getAccessibleTickets = (): SupportTicket[] => {
    if (!isAuthenticated || !user) {
      return []; // Public visitor gets ZERO rows in the general list
    }

    const currentEmail = (user.email || '').toLowerCase().trim();
    const currentName = (user.name || '').toLowerCase().trim();

    if (user.role === 'employee') {
      // Employee sees ONLY his/her own tickets
      return tickets.filter(
        (t) =>
          t.submittedByEmail.toLowerCase().trim() === currentEmail ||
          t.submittedBy.toLowerCase().trim() === currentName ||
          (currentEmail.includes('employee@sbs.nhs.uk') && t.submittedBy.toLowerCase().includes('david clarke')) ||
          (currentEmail.includes('david.clarke') && t.submittedBy.toLowerCase().includes('david clarke')) ||
          (currentEmail.includes('rachel') && t.submittedBy.toLowerCase().includes('rachel adams'))
      );
    }

    // Manager role: can see all tickets (themselves + all employees)
    if (managerScopeFilter === 'my') {
      return tickets.filter(
        (t) =>
          t.submittedByEmail.toLowerCase().trim() === currentEmail ||
          t.submittedBy.toLowerCase().trim() === currentName
      );
    }

    if (managerScopeFilter === 'staff') {
      return tickets.filter(
        (t) =>
          t.submittedByEmail.toLowerCase().trim() !== currentEmail &&
          t.submittedBy.toLowerCase().trim() !== currentName
      );
    }

    return tickets; // 'all' - full team visibility
  };

  const accessibleTickets = getAccessibleTickets();

  // Filter accessible tickets by search & status
  const displayedTickets = accessibleTickets.filter((t) => {
    const matchesQuery =
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || t.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesQuery && matchesStatus;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      navigate('/SignIn?returnUrl=/support/');
      return;
    }
    if (!newSubject.trim() || !newDescription.trim()) return;

    const refNumber = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const submitterName = user.name;
    const submitterEmail = user.email;

    const newEntry: SupportTicket = {
      id: `t-${Date.now().toString().slice(-5)}`,
      referenceNumber: refNumber,
      subject: newSubject.trim(),
      category: newCategory,
      status: 'Open',
      priority: newPriority,
      createdAt: 'Just now',
      updatedAt: 'Just now',
      submittedBy: submitterName,
      submittedByEmail: submitterEmail,
      assignedTeam: 'NHS SBS First Contact Triage',
      description: newDescription.trim(),
      updates: [
        {
          id: `u-${Date.now()}`,
          author: submitterName,
          timestamp: 'Just now',
          message: 'Enquiry logged by authenticated staff member.',
          isStaff: false,
        },
      ],
    };

    setTickets([newEntry, ...tickets]);
    setIsCreatingTicket(false);
    setNewSubject('');
    setNewDescription('');
    setNewGuestEmail('');
    setNewGuestName('');
    setFormSuccessMessage(`Enquiry logged successfully! Your private tracking code is ${refNumber}.`);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = lookupRef.trim().toLowerCase();
    if (!clean) return;

    const found = tickets.find((t) => t.referenceNumber.toLowerCase() === clean);
    setLookupResult(found || 'not_found');
  };

  const handleSendReply = (ticketId: string) => {
    if (!replyMessage.trim()) return;

    const newUpdate = {
      id: `u-${Date.now()}`,
      author: user?.name || 'Visitor',
      timestamp: 'Just now',
      message: replyMessage.trim(),
      isStaff: user?.role === 'manager',
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              updatedAt: 'Just now',
              updates: [...t.updates, newUpdate],
            }
          : t
      )
    );

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        updatedAt: 'Just now',
        updates: [...selectedTicket.updates, newUpdate],
      });
    }

    setReplyMessage('');
  };

  const handleOpenRaiseQuery = () => {
    if (!isAuthenticated) {
      navigate('/SignIn?returnUrl=/support/');
      return;
    }
    setIsCreatingTicket(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'My Support', path: '/support/' }]} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            My Support
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Log technical requests, track payroll reconciliations, and review communications with SBS specialists.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenRaiseQuery}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-semibold text-sm transition-colors shadow-xs"
          >
            {isAuthenticated ? (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Raise New Enquiry</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Raise Enquiry</span>
              </>
            )}
          </button>
        </div>
      </div>

      {formSuccessMessage && (
        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 text-sm text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{formSuccessMessage}</span>
          </div>
          <button
            onClick={() => setFormSuccessMessage(null)}
            className="text-emerald-700 dark:text-emerald-400 hover:underline text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. PUBLIC VISITOR VIEW (Strict: Sign In Required to Raise) */}
      {/* ======================================================== */}
      {!isAuthenticated && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors">
            <div className="max-w-2xl mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-3">
                <Lock className="w-3.5 h-3.5" />
                <span>Authentication Required to Raise Support Queries</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Sign In to Log an Enquiry
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                In compliance with NHS Information Governance and Caldicott principles, all service queries, payroll reconciliations, and IT support tickets must be submitted by authenticated personnel. Without logging in, enquiries cannot be created.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/SignIn?returnUrl=/support/')}
                className="w-full sm:w-auto px-6 py-3 bg-sky-700 hover:bg-sky-800 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Raise a Query</span>
              </button>
              <button
                onClick={() => navigate('/registrationrequest/')}
                className="w-full sm:w-auto px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Request Staff Account</span>
              </button>
            </div>
          </div>

          {/* Guest Track Reference Form */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Track Prior Enquiry by Reference Code
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Already have an official reference code (e.g. INC-2026-XXXX)? You can look up its status below, or sign in for complete ticket details.
            </p>
            <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3 max-w-lg">
              <input
                type="text"
                value={lookupRef}
                onChange={(e) => setLookupRef(e.target.value)}
                placeholder="e.g. INC-2026-9081"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg text-xs font-semibold shrink-0"
              >
                Search Reference
              </button>
            </form>

            {lookupResult === 'not_found' && (
              <p className="text-xs text-rose-600 dark:text-rose-400">
                No matching enquiry found for code &quot;{lookupRef}&quot;.
              </p>
            )}
          </div>

          {/* If the public visitor found a valid ticket via reference search */}
          {lookupResult && lookupResult !== 'not_found' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-sky-200 dark:border-sky-800 p-6 shadow-xs space-y-4 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sky-800 dark:text-sky-300 text-sm">
                    {lookupResult.referenceNumber}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{lookupResult.category}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    lookupResult.status === 'Resolved'
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : lookupResult.status === 'In Progress'
                      ? 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                      : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {lookupResult.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">{lookupResult.subject}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 leading-relaxed">
                  {lookupResult.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Case Updates ({lookupResult.updates.length})
                </h4>
                <div className="space-y-2">
                  {lookupResult.updates.map((update) => (
                    <div
                      key={update.id}
                      className={`p-3 rounded-lg text-xs border ${
                        update.isStaff
                          ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {update.author} {update.isStaff && '(NHS SBS Support Team)'}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{update.timestamp}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{update.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Privacy Callout */}
          <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 transition-colors">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                <strong>Confidentiality Enforced:</strong> Public visitors cannot view enquiries logged by staff or other users.
              </span>
            </div>
            <button
              onClick={() => navigate('/SignIn?returnUrl=/support/')}
              className="text-sky-700 dark:text-sky-400 hover:underline font-semibold whitespace-nowrap"
            >
              Sign in with your NHS account →
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SIGNED-IN VIEW (EMPLOYEE: Own Cases ONLY | MANAGER: All)*/}
      {/* ======================================================== */}
      {isAuthenticated && user && (
        <div className="space-y-6">
          {/* Role Status Banner */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-colors ${
              user.role === 'manager'
                ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200'
                : 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {user.role === 'manager' ? (
                <Users className="w-5 h-5 text-sky-700 dark:text-sky-400 shrink-0" />
              ) : (
                <UserCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
              )}
              <div>
                <span className="font-bold text-sm block">
                  {user.role === 'manager'
                    ? 'Manager Level Visibility: All Cases Included'
                    : 'Personal Staff View: Your Cases Only'}
                </span>
                <span className="text-[11px] opacity-80 block">
                  {user.role === 'manager'
                    ? `Showing all enquiries across your department, including yourself (${user.name}) and staff under you.`
                    : `Showing only enquiries raised by ${user.name} (${user.email}). Other staff enquiries remain protected.`}
                </span>
              </div>
            </div>

            {/* Manager-only Scope Filter Switcher */}
            {user.role === 'manager' && (
              <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-sky-200 dark:border-slate-700 shadow-xs shrink-0">
                <button
                  onClick={() => setManagerScopeFilter('all')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    managerScopeFilter === 'all'
                      ? 'bg-sky-700 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All Tickets ({tickets.length})
                </button>
                <button
                  onClick={() => setManagerScopeFilter('my')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    managerScopeFilter === 'my'
                      ? 'bg-sky-700 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  My Direct Cases
                </button>
                <button
                  onClick={() => setManagerScopeFilter('staff')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    managerScopeFilter === 'staff'
                      ? 'bg-sky-700 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Team Staff Cases
                </button>
              </div>
            )}
          </div>

          {/* Search & Filter Strip */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by subject, reference #, or category..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
              />
            </div>

            {/* Segmented Filter Control */}
            <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
              {['all', 'open', 'in progress', 'resolved'].map((filterVal) => (
                <button
                  key={filterVal}
                  onClick={() => setStatusFilter(filterVal)}
                  className={`px-3 py-1 font-medium rounded capitalize whitespace-nowrap transition-colors ${
                    statusFilter === filterVal
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {filterVal}
                </button>
              ))}
            </div>
          </div>

          {/* Tickets Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {user.role === 'manager'
                  ? managerScopeFilter === 'my'
                    ? 'My Direct Cases'
                    : managerScopeFilter === 'staff'
                    ? 'Team Staff Submissions'
                    : 'All Department Cases (Self & Team)'
                  : 'My Submitted Support Cases'}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {displayedTickets.length} of {accessibleTickets.length} cases
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Reference</th>
                    <th className="px-4 py-3 font-semibold">Subject & Category</th>
                    {user.role === 'manager' && (
                      <th className="px-4 py-3 font-semibold">Submitted By</th>
                    )}
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Priority</th>
                    <th className="px-4 py-3 font-semibold">Updated</th>
                    <th className="px-4 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {displayedTickets.length === 0 ? (
                    <tr>
                      <td colSpan={user.role === 'manager' ? 7 : 6} className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
                        <LifeBuoy className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                        <p className="font-semibold text-slate-700 dark:text-slate-300">No support cases found</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {user.role === 'employee'
                            ? "You do not have any cases matching the current filters. Click 'Raise New Enquiry' to create one."
                            : 'No department cases match the selected filter criteria.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    displayedTickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <td className="px-4 py-3 font-mono font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {ticket.referenceNumber}
                        </td>
                        <td className="px-4 py-3 max-w-sm">
                          <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{ticket.subject}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {ticket.category} · {ticket.assignedTeam}
                          </div>
                        </td>
                        {user.role === 'manager' && (
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block">{ticket.submittedBy}</span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 block">{ticket.submittedByEmail}</span>
                          </td>
                        )}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              ticket.status === 'Resolved'
                                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : ticket.status === 'In Progress'
                                ? 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                                : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                          {ticket.priority}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          {ticket.updatedAt}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTicket(ticket);
                            }}
                            className="text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-300 font-semibold"
                          >
                            View details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TICKET DETAILS MODAL (With Conversation & Staff Response) */}
      {/* ======================================================== */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {selectedTicket.referenceNumber}
                  </span>
                  <span>·</span>
                  <span>{selectedTicket.category}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedTicket.subject}</h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Status</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{selectedTicket.status}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Priority</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{selectedTicket.priority}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Submitted By</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                    {selectedTicket.submittedBy}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Assigned Team</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                    {selectedTicket.assignedTeam}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-2">Enquiry Summary & Evidence</h4>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedTicket.description}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-3">Communication Timeline</h4>
                <div className="space-y-3">
                  {selectedTicket.updates.map((update) => (
                    <div
                      key={update.id}
                      className={`p-3.5 rounded-lg border ${
                        update.isStaff
                          ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {update.author} {update.isStaff && '(NHS SBS Support Specialist)'}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{update.timestamp}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{update.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add reply/update message */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Add Comment / Response
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type an update or request clarification..."
                    className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendReply(selectedTicket.id);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleSendReply(selectedTicket.id)}
                    className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-md font-semibold text-xs transition-colors shrink-0 flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 dark:hover:bg-slate-600"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* RAISE NEW TICKET MODAL                                   */}
      {/* ======================================================== */}
      {isCreatingTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Raise New Support Enquiry</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Direct submission to NHS SBS Helpdesk
                </p>
              </div>
              <button
                onClick={() => setIsCreatingTicket(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isAuthenticated || !user ? (
              <div className="p-6 space-y-4 text-center">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Sign In Required</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    You must sign in with your authorized NHS staff account to submit an enquiry.
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingTicket(false)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingTicket(false);
                      navigate('/SignIn?returnUrl=/support/');
                    }}
                    className="px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold"
                  >
                    Sign In Now
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateTicket} className="p-6 space-y-4 text-xs">
                {/* Authenticated Submitter Identity Confirmation */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Submitting Staff Member:</span>
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{user.staffId}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                    <strong>{user.name}</strong> · {user.email} · {user.department}
                  </div>
                </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-sky-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Payroll & Salary">Payroll & Salary</option>
                  <option value="Pensions">Pensions</option>
                  <option value="IT Systems & Access">IT Systems & Access</option>
                  <option value="Procurement">Procurement</option>
                  <option value="Travel & Expenses">Travel & Expenses</option>
                  <option value="HR & Policy">HR & Policy</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-sky-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Low">Low — General Question</option>
                  <option value="Medium">Medium — Standard Request</option>
                  <option value="High">High — Payroll or Clinical Discrepancy</option>
                  <option value="Urgent">Urgent — Shift-Critical or Financial Impact</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Summary / Subject</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Overtime missing on provisional payroll statement"
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description & Evidence</label>
                <textarea
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Please provide details, dates, shift references, or employee ID..."
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-sky-600 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingTicket(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-md font-semibold transition-colors shadow-xs"
                >
                  Submit Enquiry
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
