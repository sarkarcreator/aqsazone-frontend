'use client';


import { apiUrl } from '@/lib/api-client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MessageSquare,
  Mail,
  Phone,
  Briefcase,
  UserCheck,
  Trash2,
  Edit3,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  X,
  Loader2,
  Download,
  FileSpreadsheet,
  RotateCcw,
  Kanban,
} from 'lucide-react';
import { downloadLeadsCSV, ExportableLead } from '@/lib/csv-export';

interface Lead {
  id: number;
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
  interestedService?: string | null;
  relatedProject?: string | null;
  budget?: string | null;
  message: string;
  source: string;
  status: string;
  priority: string;
  notes?: string | null;
  followUpDate?: string | null;
  assignedPerson?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  // CSV Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState('all');
  const [exportDatePreset, setExportDatePreset] = useState('all');
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportPreviewCount, setExportPreviewCount] = useState<number | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') params.set('status', selectedStatus);
      if (selectedPriority !== 'all') params.set('priority', selectedPriority);
      if (search) params.set('search', search);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);

      const res = await fetch(apiUrl(`/api/leads?${params.toString()}`), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, selectedPriority, search, startDate, endDate]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleUpdateLead = async (leadId: number, updateData: Partial<Lead>) => {
    setSaving(true);
    setFeedback('');
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(apiUrl(`/api/leads/${leadId}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        const data = await res.json();
        setLeads((prev) => prev.map((l) => (l.id === leadId ? data.lead : l)));
        if (activeLead && activeLead.id === leadId) {
          setActiveLead(data.lead);
        }
        setFeedback('Lead updated successfully!');
        setTimeout(() => setFeedback(''), 3000);
      }
    } catch (err) {
      console.error('Failed to update lead:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleConvertToClient = async (leadId: number) => {
    if (!confirm('Convert this lead into an official Client profile?')) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(apiUrl(`/api/leads/${leadId}/convert`), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setFeedback('Lead successfully converted to Client!');
        handleUpdateLead(leadId, { status: 'won' });
        setTimeout(() => setFeedback(''), 3000);
      }
    } catch (err) {
      console.error('Convert to client failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLead = async (leadId: number) => {
    if (!confirm('Are you sure you want to permanently delete this lead?')) return;
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(apiUrl(`/api/leads/${leadId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== leadId));
        if (activeLead && activeLead.id === leadId) {
          setActiveLead(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'discussion', label: 'Discussion' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'won', label: 'Won (Client)' },
    { value: 'lost', label: 'Lost' },
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' },
  ];

  const openExportModal = () => {
    setExportStatus(selectedStatus);
    if (startDate || endDate) {
      setExportDatePreset('custom');
      setExportStartDate(startDate);
      setExportEndDate(endDate);
    } else {
      setExportDatePreset('all');
      setExportStartDate('');
      setExportEndDate('');
    }
    setIsExportModalOpen(true);
  };

  const applyDatePreset = (preset: string) => {
    setExportDatePreset(preset);
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (preset === 'all') {
      setExportStartDate('');
      setExportEndDate('');
    } else if (preset === 'today') {
      setExportStartDate(todayStr);
      setExportEndDate(todayStr);
    } else if (preset === '7days') {
      const past = new Date();
      past.setDate(now.getDate() - 7);
      setExportStartDate(past.toISOString().split('T')[0]);
      setExportEndDate(todayStr);
    } else if (preset === '30days') {
      const past = new Date();
      past.setDate(now.getDate() - 30);
      setExportStartDate(past.toISOString().split('T')[0]);
      setExportEndDate(todayStr);
    } else if (preset === 'this_month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      setExportStartDate(startOfMonth.toISOString().split('T')[0]);
      setExportEndDate(todayStr);
    }
  };

  // Fetch count of matching leads in real time for Export Modal
  useEffect(() => {
    if (!isExportModalOpen) return;

    let isMounted = true;
    const fetchCount = async () => {
      try {
        const token = localStorage.getItem('admin_token') || '';
        const params = new URLSearchParams();
        if (exportStatus !== 'all') params.set('status', exportStatus);
        if (exportStartDate) params.set('startDate', exportStartDate);
        if (exportEndDate) params.set('endDate', exportEndDate);

        const res = await fetch(apiUrl(`/api/leads?${params.toString()}`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok && isMounted) {
          const d = await res.json();
          setExportPreviewCount(d.leads?.length ?? 0);
        }
      } catch (e) {
        console.error('Count fetch error', e);
      }
    };

    fetchCount();
    return () => {
      isMounted = false;
    };
  }, [isExportModalOpen, exportStatus, exportStartDate, exportEndDate]);

  // Direct CSV Export of currently filtered leads on the page
  const handleExportCurrentFilteredLeads = () => {
    if (leads.length === 0) {
      alert('No leads matched current filters to export.');
      return;
    }
    try {
      const filename = `aqsazone-leads-${selectedStatus !== 'all' ? selectedStatus : 'all'}`;
      downloadLeadsCSV(leads as ExportableLead[], filename);
      setFeedback(`Successfully exported ${leads.length} filtered leads to CSV!`);
      setTimeout(() => setFeedback(''), 4000);
    } catch (err) {
      console.error('Direct CSV export failed:', err);
      alert('Failed to export leads to CSV.');
    }
  };

  const handleGenerateCSV = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const params = new URLSearchParams();
      if (exportStatus !== 'all') params.set('status', exportStatus);
      if (exportStartDate) params.set('startDate', exportStartDate);
      if (exportEndDate) params.set('endDate', exportEndDate);

      const res = await fetch(apiUrl(`/api/leads?${params.toString()}`), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch leads for export');

      const data = await res.json();
      const exportList: Lead[] = data.leads || [];

      if (exportList.length === 0) {
        alert('No leads matched the selected status and date criteria.');
        setExporting(false);
        return;
      }

      const statusTag = exportStatus !== 'all' ? `-${exportStatus}` : '-all-statuses';
      const dateTag =
        exportStartDate || exportEndDate
          ? `-${exportStartDate || 'start'}-to-${exportEndDate || 'today'}`
          : '';
      const filename = `aqsazone-leads${statusTag}${dateTag}`;

      downloadLeadsCSV(exportList as ExportableLead[], filename);

      setIsExportModalOpen(false);
      setFeedback(`Successfully generated and downloaded report with ${exportList.length} leads!`);
      setTimeout(() => setFeedback(''), 4000);
    } catch (err) {
      console.error('CSV export failed:', err);
      alert('Failed to generate CSV export.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <AdminLayout
      title="CRM & Client Leads Pipeline"
      subtitle="Track incoming inquiries, qualify prospect requirements, and convert leads into active client accounts."
      actions={
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/pipeline"
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Switch to CRM Pipeline Kanban Board"
          >
            <Kanban className="w-3.5 h-3.5 text-purple-400" />
            <span>Pipeline Board</span>
          </Link>

          <button
            type="button"
            onClick={handleExportCurrentFilteredLeads}
            disabled={leads.length === 0}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40"
            title="Export currently filtered leads directly to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Filtered ({leads.length})</span>
          </button>

          <button
            type="button"
            onClick={openExportModal}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
            title="Open CSV export modal to filter by status and date"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Leads CSV</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {feedback && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search leads by name, email, company, service..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>

            {/* Status & Priority Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-purple-500"
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-purple-500"
              >
                {priorities.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>

              {/* Export Button */}
              <button
                type="button"
                onClick={handleExportCurrentFilteredLeads}
                disabled={leads.length === 0}
                className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm disabled:opacity-40"
                title="Export all currently filtered leads to CSV"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>Export CSV ({leads.length})</span>
              </button>

              <button
                type="button"
                onClick={openExportModal}
                className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
                title="Open CSV Export dialog with status & date filters"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Status & Date Filter</span>
              </button>
            </div>
          </div>

          {/* Date Filtering Bar */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span>Filter by Date:</span>
            </span>

            <div className="flex items-center gap-2">
              <label className="text-[11px] text-slate-500">From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[11px] text-slate-500">To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            {(startDate || endDate) && (
              <button
                type="button"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
                title="Reset date filter"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span>Clear Dates</span>
              </button>
            )}

            <div className="ml-auto text-[11px] font-medium text-slate-400 flex items-center gap-2">
              <span>
                Showing <span className="text-white font-bold">{leads.length}</span> leads
              </span>
              <button
                type="button"
                onClick={openExportModal}
                className="text-purple-400 hover:text-purple-300 underline underline-offset-2 flex items-center gap-1"
                title="Export with custom status and date filters"
              >
                <FileSpreadsheet className="w-3 h-3" />
                <span>Custom CSV Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Leads Table & Pipeline List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] font-semibold">
                  <th className="py-3.5 px-4">Lead ID & Prospect</th>
                  <th className="py-3.5 px-4">Service & Budget</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setActiveLead(lead)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="text-purple-400 text-[10px] font-mono">#{lead.id}</span>
                        <span>{lead.name}</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {lead.company ? `${lead.company} • ` : ''}
                        {lead.email}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-medium">
                        {lead.interestedService || 'General Inquiry'}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {lead.budget ? `Budget: ${lead.budget}` : 'Budget: Unspecified'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px] capitalize">
                      {lead.source}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          lead.priority === 'high'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : lead.priority === 'medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {lead.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          lead.status === 'new'
                            ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                            : lead.status === 'won'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : lead.status === 'lost'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                            : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-slate-400 font-mono">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveLead(lead);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-600/30 text-purple-300 text-[11px] font-semibold transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No leads match current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Detail & CRM Drawer Modal */}
        {activeLead && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
            onClick={() => setActiveLead(null)}
          >
            <div
              className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-purple-400">
                      LEAD #{activeLead.id}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">
                      Received {new Date(activeLead.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mt-1">{activeLead.name}</h3>
                  {activeLead.company && (
                    <p className="text-sm text-purple-300">{activeLead.company}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveLead(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Priority Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Pipeline Status
                  </label>
                  <select
                    value={activeLead.status}
                    onChange={(e) => handleUpdateLead(activeLead.id, { status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-purple-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="discussion">Discussion</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={activeLead.priority}
                    onChange={(e) => handleUpdateLead(activeLead.id, { priority: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-purple-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={activeLead.followUpDate || ''}
                    onChange={(e) =>
                      handleUpdateLead(activeLead.id, { followUpDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                  >
                  </input>
                </div>
              </div>

              {/* Contact Credentials */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">Email Address</span>
                  <a
                    href={`mailto:${activeLead.email}`}
                    className="text-white hover:text-purple-300 font-medium flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-purple-400" />
                    <span>{activeLead.email}</span>
                  </a>
                </div>

                {activeLead.phone && (
                  <div>
                    <span className="text-slate-500 block mb-0.5">Phone / WhatsApp</span>
                    <a
                      href={`https://wa.me/${activeLead.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{activeLead.phone}</span>
                    </a>
                  </div>
                )}

                <div>
                  <span className="text-slate-500 block mb-0.5">Interested Service</span>
                  <span className="text-slate-200 font-medium">
                    {activeLead.interestedService || 'Unspecified'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Budget Allocation</span>
                  <span className="text-slate-200 font-medium font-mono">
                    {activeLead.budget || 'Not specified'}
                  </span>
                </div>
              </div>

              {/* Inquiry Message */}
              <div className="mb-6">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Client Inbound Message
                </span>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {activeLead.message}
                </div>
              </div>

              {/* Internal Notes & Strategy */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Internal CRM Notes
                </label>
                <textarea
                  rows={3}
                  defaultValue={activeLead.notes || ''}
                  onBlur={(e) => handleUpdateLead(activeLead.id, { notes: e.target.value })}
                  placeholder="Record call notes, proposal feedback, or scope adjustments..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleConvertToClient(activeLead.id)}
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Convert to Official Client</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteLead(activeLead.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title="Delete lead"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveLead(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: CSV Export with Status & Date Filters */}
        {isExportModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150"
            onClick={() => setIsExportModalOpen(false)}
          >
            <div
              className="w-full max-w-xl my-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Export Leads to CSV</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Filter leads by status and submission date for reporting.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* 1. Status Filter */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Filter by Status
                  </label>
                  <select
                    value={exportStatus}
                    onChange={(e) => setExportStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-purple-500"
                  >
                    {statuses.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Date Presets */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Date Range Preset
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {[
                      { id: 'all', label: 'All Time' },
                      { id: 'today', label: 'Today' },
                      { id: '7days', label: 'Last 7 Days' },
                      { id: '30days', label: 'Last 30 Days' },
                      { id: 'this_month', label: 'This Month' },
                      { id: 'custom', label: 'Custom' },
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyDatePreset(preset.id)}
                        className={`py-2 px-2 text-center rounded-xl text-[11px] font-semibold transition-all ${
                          exportDatePreset === preset.id
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Start & End Date Pickers */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      <span>Start Date (From)</span>
                    </label>
                    <input
                      type="date"
                      value={exportStartDate}
                      onChange={(e) => {
                        setExportStartDate(e.target.value);
                        setExportDatePreset('custom');
                      }}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      <span>End Date (To)</span>
                    </label>
                    <input
                      type="date"
                      value={exportEndDate}
                      onChange={(e) => {
                        setExportEndDate(e.target.value);
                        setExportDatePreset('custom');
                      }}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* 4. Live Counter & Inclusions Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border border-purple-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Matching Records:</span>
                    <span className="font-bold font-mono text-purple-300 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30">
                      {exportPreviewCount !== null
                        ? `${exportPreviewCount} Lead${exportPreviewCount === 1 ? '' : 's'}`
                        : 'Calculating...'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Export includes all 17 CRM fields: Lead ID, Name, Company, Email, Phone, WhatsApp, Interested Service, Related Project, Budget, Status, Priority, Inbound Source, Assigned Specialist, Follow-Up Date, Created Date & Time, Inquiry Message, and Internal Notes.
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setIsExportModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateCSV}
                    disabled={exporting || exportPreviewCount === 0}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:via-indigo-500 hover:to-pink-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/25 flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {exporting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating CSV...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download CSV Report</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
