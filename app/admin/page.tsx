import { apiUrl } from '@/lib/api-client';
'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import {
  Users,
  Briefcase,
  Sparkles,
  FolderKanban,
  FileText,
  TrendingUp,
  MessageSquare,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Activity,
  Filter,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<{
    analytics: {
      totalLeads: number;
      newLeads: number;
      activeLeads: number;
      wonLeads: number;
      lostLeads: number;
      totalServices: number;
      publishedServices: number;
      totalProjects: number;
      publishedProjects: number;
      draftProjects: number;
      totalClients: number;
      totalCaseStudies: number;
      totalTestimonials: number;
      statusCounts: Record<string, number>;
      serviceCounts: Record<string, number>;
      sourceCounts: Record<string, number>;
      topViewedProjects: Array<{ id: number; title: string; viewsCount: number }>;
      topViewedServices: Array<{ id: number; name: string; viewsCount: number }>;
    } | null;
    recentActivity: Array<{ id: number; action: string; details: string; userEmail: string; createdAt: string }>;
  }>({ analytics: null, recentActivity: [] });

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const token = localStorage.getItem('admin_token') || '';
        const [resAnalytics, resLeads] = await Promise.all([
          fetch(apiUrl('/api/analytics'), { headers: { Authorization: `Bearer ${token}` } }),
          fetch(apiUrl('/api/leads'), { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (resAnalytics.ok) {
          const analyticsData = await resAnalytics.json();
          setData(analyticsData);
        }

        if (resLeads.ok) {
          const leadsData = await resLeads.json();
          setLeads(leadsData.leads?.slice(0, 5) || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const handleQuickStatusChange = async (leadId: number, newStatus: string) => {
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
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
      }
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  const a = data.analytics;

  return (
    <AdminLayout
      title="Dashboard & Analytics Overview"
      subtitle="Aqsa Zone CRM metrics, portfolio health, and recent client activity."
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/admin/projects"
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Link>
          <Link
            href="/admin/leads"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <span>Open CRM Pipeline</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-8">
        {/* KPI Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-semibold uppercase">Total Leads</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{a?.totalLeads ?? '-'}</div>
            <div className="text-[10px] text-purple-300 mt-1">{a?.newLeads ?? 0} New Uncontacted</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-semibold uppercase">Active Deals</span>
              <Activity className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{a?.activeLeads ?? '-'}</div>
            <div className="text-[10px] text-slate-400 mt-1">In discussion / proposal</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 bg-emerald-950/10 shadow-sm">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-[11px] font-semibold uppercase">Won Clients</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400">{a?.wonLeads ?? '-'}</div>
            <div className="text-[10px] text-emerald-300 mt-1">{a?.totalClients ?? 0} In Roster</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-semibold uppercase">Services</span>
              <Sparkles className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{a?.totalServices ?? '-'}</div>
            <div className="text-[10px] text-slate-400 mt-1">
              {a?.publishedServices ?? 0} Published
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-semibold uppercase">Projects</span>
              <FolderKanban className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{a?.totalProjects ?? '-'}</div>
            <div className="text-[10px] text-slate-400 mt-1">
              {a?.publishedProjects ?? 0} Published • {a?.draftProjects ?? 0} Draft
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-semibold uppercase">Case Studies</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{a?.totalCaseStudies ?? '-'}</div>
            <div className="text-[10px] text-slate-400 mt-1">
              {a?.totalTestimonials ?? 0} Reviews
            </div>
          </div>
        </div>

        {/* Lead Funnel Pipeline & Service Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Inquiries / Leads (Left 8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Recent Inquiries & Leads</h3>
                <p className="text-xs text-slate-400">Incoming inquiries from website contact forms</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/pipeline"
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  <span>Pipeline Board</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-slate-700">•</span>
                <Link
                  href="/admin/leads"
                  className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <span>Leads Table</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-semibold">
                    <th className="pb-3">Lead</th>
                    <th className="pb-3">Interested Service</th>
                    <th className="pb-3">Budget</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/30">
                      <td className="py-3">
                        <div className="font-bold text-white">{lead.name}</div>
                        <div className="text-slate-400 text-[11px]">{lead.email}</div>
                      </td>
                      <td className="py-3 text-slate-300">
                        {lead.interestedService || 'General Inquiry'}
                      </td>
                      <td className="py-3 text-slate-400 font-mono text-[11px]">
                        {lead.budget || 'N/A'}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
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
                      <td className="py-3 text-right">
                        <select
                          value={lead.status}
                          onChange={(e) => handleQuickStatusChange(lead.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-[11px] px-2 py-1 focus:outline-none focus:border-purple-500"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="discussion">Discussion</option>
                          <option value="proposal">Proposal</option>
                          <option value="negotiation">Negotiation</option>
                          <option value="won">Won</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-500">
                        No leads found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* CRM Leads by Service Breakdown (Right 4 cols) */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Inquiries by Discipline</h3>
            <div className="space-y-3 pt-1">
              {a?.serviceCounts && Object.keys(a.serviceCounts).length > 0 ? (
                Object.entries(a.serviceCounts).map(([svc, count]) => (
                  <div key={svc} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 truncate max-w-[200px]">{svc}</span>
                      <span className="text-purple-400 font-bold">{count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                        style={{
                          width: `${Math.min(100, (count / (a?.totalLeads || 1)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 py-4 text-center">No inquiries logged yet.</div>
              )}
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Quick Shortcuts
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/admin/services"
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-center font-medium transition-colors"
                >
                  Manage Services
                </Link>
                <Link
                  href="/admin/settings"
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-center font-medium transition-colors"
                >
                  Website Settings
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Audit Feed */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>System Activity Audit Trail</span>
            </h3>
            <Link
              href="/admin/activity"
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              View Full History →
            </Link>
          </div>

          <div className="space-y-3">
            {data.recentActivity.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-4 text-xs"
              >
                <div>
                  <span className="font-bold text-white">{log.action}: </span>
                  <span className="text-slate-300">{log.details}</span>
                  <span className="text-slate-500 block text-[10px] mt-0.5">by {log.userEmail}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                  {new Date(log.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
