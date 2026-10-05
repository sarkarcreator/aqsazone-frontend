'use client';


import { apiUrl } from '@/lib/api-client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Users,
  Search,
  Filter,
  Calendar,
  Download,
  FileSpreadsheet,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Mail,
  Phone,
  MessageSquare,
  DollarSign,
  UserCheck,
  Trash2,
  X,
  Loader2,
  RotateCcw,
  Kanban,
  LayoutList,
  Building,
  Briefcase,
  Sparkles,
  TrendingUp,
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

const PIPELINE_STAGES = [
  { id: 'new', label: 'New Inquiries', color: 'border-purple-500/50 bg-purple-500/10 text-purple-300' },
  { id: 'contacted', label: 'Contacted', color: 'border-blue-500/50 bg-blue-500/10 text-blue-300' },
  { id: 'discussion', label: 'In Discussion', color: 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300' },
  { id: 'proposal', label: 'Proposal Sent', color: 'border-amber-500/50 bg-amber-500/10 text-amber-300' },
  { id: 'negotiation', label: 'Negotiation', color: 'border-orange-500/50 bg-orange-500/10 text-orange-300' },
  { id: 'won', label: 'Won (Client)', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' },
  { id: 'lost', label: 'Lost / Closed', color: 'border-rose-500/50 bg-rose-500/10 text-rose-300' },
];

export default function AdminPipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [exporting, setExporting] = useState(false);

  // CSV Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState('all');
  const [exportDatePreset, setExportDatePreset] = useState('all');
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
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
      console.error('Failed to load leads for pipeline:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, selectedPriority, search, startDate, endDate]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleUpdateLeadStatus = async (leadId: number, newStatus: string) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(apiUrl(`/api/leads/${leadId}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setLeads((prev) => prev.map((l) => (l.id === leadId ? data.lead : l)));
        if (activeLead && activeLead.id === leadId) {
          setActiveLead(data.lead);
        }
        setFeedback(`Lead moved to ${newStatus.toUpperCase()}`);
        setTimeout(() => setFeedback(''), 2500);
      }
    } catch (err) {
      console.error('Failed to update stage:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateLead = async (leadId: number, updateData: Partial<Lead>) => {
    setSaving(true);
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
        setFeedback('Lead details updated successfully!');
        setTimeout(() => setFeedback(''), 2500);
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
        setFeedback('Lead converted to official Client!');
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
    if (!confirm('Permanently delete this lead?')) return;
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

  // Direct CSV Export of all currently filtered leads
  const handleExportFilteredLeads = () => {
    if (leads.length === 0) {
      alert('There are no filtered leads matching current criteria to export.');
      return;
    }

    try {
      setExporting(true);
      const filename = `aqsazone-crm-pipeline-${selectedStatus !== 'all' ? selectedStatus : 'all-stages'}`;
      downloadLeadsCSV(leads as ExportableLead[], filename);
      setFeedback(`Successfully exported ${leads.length} filtered leads to CSV!`);
      setTimeout(() => setFeedback(''), 4000);
    } catch (err) {
      console.error('CSV export failed:', err);
      alert('Failed to export leads to CSV.');
    } finally {
      setExporting(false);
    }
  };

  // Modal Custom CSV Export
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

  // Live count calculation for modal
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

  const handleModalGenerateCSV = async () => {
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

      const filename = `aqsazone-pipeline-report-${exportStatus !== 'all' ? exportStatus : 'all'}`;
      downloadLeadsCSV(exportList as ExportableLead[], filename);

      setIsExportModalOpen(false);
      setFeedback(`Downloaded CSV report containing ${exportList.length} leads!`);
      setTimeout(() => setFeedback(''), 4000);
    } catch (err) {
      console.error('Modal CSV export failed:', err);
      alert('Failed to generate CSV export.');
    } finally {
      setExporting(false);
    }
  };

  // Group leads by stage
  const leadsByStage = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    PIPELINE_STAGES.forEach((s) => {
      map[s.id] = [];
    });
    leads.forEach((l) => {
      if (map[l.status]) {
        map[l.status].push(l);
      } else {
        // Fallback to new if unexpected status
        if (!map['new']) map['new'] = [];
        map['new'].push(l);
      }
    });
    return map;
  }, [leads]);

  // Statistics
  const wonCount = leadsByStage['won']?.length || 0;
  const activeCount = leads.filter((l) => l.status !== 'won' && l.status !== 'lost').length;

  return (
    <AdminLayout
      title="CRM Pipeline Board"
      subtitle="Visual deal workflow to track prospect stages from initial inquiry to signed engagement."
      actions={
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/leads"
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Switch to Leads Table View"
          >
            <LayoutList className="w-3.5 h-3.5 text-slate-400" />
            <span>Table View</span>
          </Link>

          {/* Primary Export Button */}
          <button
            type="button"
            onClick={handleExportFilteredLeads}
            disabled={leads.length === 0 || exporting}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-purple-600/20 disabled:opacity-50"
            title="Export all filtered leads in this pipeline view to CSV"
          >
            {exporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Export Filtered ({leads.length}) CSV</span>
          </button>

          <button
            type="button"
            onClick={openExportModal}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Custom Status & Date Range Report"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report Filters</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {feedback && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Pipeline KPI Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Filtered Leads</span>
              <span className="text-2xl font-bold text-white mt-0.5 block">{leads.length}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Active In Pipeline</span>
              <span className="text-2xl font-bold text-indigo-400 mt-0.5 block">{activeCount}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Clients Won</span>
              <span className="text-2xl font-bold text-emerald-400 mt-0.5 block">{wonCount}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Quick Export</span>
              <button
                type="button"
                onClick={handleExportFilteredLeads}
                disabled={leads.length === 0}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 mt-1 underline underline-offset-2 disabled:opacity-50"
              >
                <span>Download CSV</span>
                <Download className="w-3 h-3" />
              </button>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search */}
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

            {/* Stage & Priority */}
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Stages</option>
                {PIPELINE_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>

              {/* CSV Export Action Button */}
              <button
                type="button"
                onClick={handleExportFilteredLeads}
                disabled={leads.length === 0}
                className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm disabled:opacity-40"
                title="Export all currently filtered leads to CSV"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>Export CSV ({leads.length})</span>
              </button>
            </div>
          </div>

          {/* Date Filtering Bar */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span>Pipeline Date Filter:</span>
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

            {(startDate || endDate || search || selectedStatus !== 'all' || selectedPriority !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setSearch('');
                  setSelectedStatus('all');
                  setSelectedPriority('all');
                }}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span>Reset Filters</span>
              </button>
            )}

            <div className="ml-auto text-[11px] font-medium text-slate-400 flex items-center gap-2">
              <span>Showing {leads.length} leads across pipeline</span>
              <button
                type="button"
                onClick={openExportModal}
                className="text-purple-400 hover:text-purple-300 underline underline-offset-2 flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3 h-3" />
                <span>Custom CSV Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pipeline Board (Horizontal scrollable columns) */}
        <div className="overflow-x-auto pb-6">
          <div className="flex gap-4 min-w-[1280px]">
            {PIPELINE_STAGES.map((stage) => {
              const stageLeads = leadsByStage[stage.id] || [];

              return (
                <div
                  key={stage.id}
                  className="flex-1 min-w-[280px] bg-slate-900/70 border border-slate-800 rounded-2xl p-3 flex flex-col max-h-[780px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 px-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        stage.id === 'new' ? 'bg-purple-500' :
                        stage.id === 'won' ? 'bg-emerald-500' :
                        stage.id === 'lost' ? 'bg-rose-500' :
                        stage.id === 'proposal' ? 'bg-amber-500' :
                        stage.id === 'negotiation' ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`} />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        {stage.label}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono font-bold">
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Column Leads List */}
                  <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                    {stageLeads.length === 0 ? (
                      <div className="p-6 text-center text-slate-600 text-xs border border-dashed border-slate-800/80 rounded-xl">
                        No leads in {stage.label.toLowerCase()}
                      </div>
                    ) : (
                      stageLeads.map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => setActiveLead(lead)}
                          className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-950/20 cursor-pointer transition-all group relative"
                        >
                          {/* Card Header: ID, Priority, Date */}
                          <div className="flex items-center justify-between text-[10px] mb-2">
                            <span className="font-mono font-bold text-purple-400">#{lead.id}</span>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                  lead.priority === 'high'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : lead.priority === 'medium'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {lead.priority}
                              </span>
                              <span className="text-slate-500 font-mono">
                                {new Date(lead.createdAt).toLocaleDateString(undefined, {
                                  month: 'numeric',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Prospect Name & Company */}
                          <div className="font-bold text-white text-xs mb-0.5 group-hover:text-purple-300 transition-colors">
                            {lead.name}
                          </div>
                          {lead.company && (
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1.5">
                              <Building className="w-3 h-3 text-slate-500 shrink-0" />
                              <span className="truncate">{lead.company}</span>
                            </div>
                          )}

                          {/* Interested Service */}
                          <div className="text-[11px] text-slate-300 font-medium line-clamp-1 mb-2">
                            {lead.interestedService || 'General Inquiry'}
                          </div>

                          {/* Budget & Follow-up */}
                          <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-900 text-slate-400">
                            <span className="font-mono text-emerald-400 font-medium">
                              {lead.budget ? lead.budget : 'No budget'}
                            </span>
                            {lead.followUpDate && (
                              <span className="flex items-center gap-1 text-amber-400">
                                <Clock className="w-3 h-3" />
                                <span>{lead.followUpDate}</span>
                              </span>
                            )}
                          </div>

                          {/* Quick Stage Mover */}
                          <div className="mt-2.5 pt-2 border-t border-slate-900 flex items-center justify-between text-[11px]">
                            <select
                              value={lead.status}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleUpdateLeadStatus(lead.id, e.target.value);
                              }}
                              className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-[10px] focus:outline-none focus:border-purple-500"
                            >
                              {PIPELINE_STAGES.map((s) => (
                                <option key={s.id} value={s.id}>
                                  Move to: {s.label}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveLead(lead);
                              }}
                              className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-0.5 text-[10px]"
                            >
                              <span>View</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Detail & CRM Modal Drawer */}
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
                    Pipeline Stage
                  </label>
                  <select
                    value={activeLead.status}
                    onChange={(e) => handleUpdateLead(activeLead.id, { status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-purple-500"
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
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
                  />
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
                  <span className="text-slate-500 block mb-0.5">Estimated Budget</span>
                  <span className="text-slate-200 font-medium font-mono">
                    {activeLead.budget || 'Not specified'}
                  </span>
                </div>
              </div>

              {/* Inquiry Message */}
              <div className="mb-6">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Client Inbound Inquiry
                </span>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {activeLead.message}
                </div>
              </div>

              {/* Internal Notes */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Internal CRM Notes & Next Steps
                </label>
                <textarea
                  rows={3}
                  defaultValue={activeLead.notes || ''}
                  onBlur={(e) => handleUpdateLead(activeLead.id, { notes: e.target.value })}
                  placeholder="Record discovery call notes, proposal requirements, budget feedback..."
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

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      downloadLeadsCSV([activeLead as ExportableLead], `aqsazone-lead-${activeLead.id}`);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    title="Export single lead data to CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Lead CSV</span>
                  </button>

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
              <div className="flex items-start justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Export CRM Pipeline to CSV</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Generate reporting spreadsheets filtered by stage and inquiry submission dates.
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
                {/* 1. Stage Filter */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Filter by Pipeline Stage
                  </label>
                  <select
                    value={exportStatus}
                    onChange={(e) => setExportStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">All Pipeline Stages</option>
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
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

                {/* 3. Date Inputs */}
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

                {/* 4. Live Counter */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border border-purple-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Matching Leads for Export:</span>
                    <span className="font-bold font-mono text-purple-300 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30">
                      {exportPreviewCount !== null
                        ? `${exportPreviewCount} Lead${exportPreviewCount === 1 ? '' : 's'}`
                        : 'Calculating...'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    The generated CSV includes complete reporting data: Lead ID, Name, Organization, Email, Phone, WhatsApp, Service, Project, Budget, Pipeline Status, Priority, Source, Follow-Up Date, Inbound Message, and CRM Notes.
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
                    onClick={handleModalGenerateCSV}
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
                        <span>Download Pipeline CSV Report</span>
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
