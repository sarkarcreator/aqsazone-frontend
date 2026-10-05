'use client';


import { apiUrl } from '@/lib/api-client';
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { History, ShieldCheck, Clock, User } from 'lucide-react';

interface ActivityLog {
  id: number;
  action: string;
  details?: string | null;
  userEmail?: string | null;
  createdAt: string;
}

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const token = localStorage.getItem('admin_token') || '';
        const res = await fetch(apiUrl('/api/analytics'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const d = await res.json();
          setLogs(d.recentActivity || []);
        }
      } catch (err) {
        console.error('Failed to load activity logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <AdminLayout
      title="System Activity & Audit Log"
      subtitle="Complete chronological audit trail of CRM lead conversions, CMS edits, and administrative actions."
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-purple-400" />
            <span>Recorded System Events ({logs.length})</span>
          </h3>
          <span className="text-xs text-slate-500">Auto-logged</span>
        </div>

        <div className="divide-y divide-slate-800">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{log.action}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] text-purple-300 font-mono">
                    {log.userEmail || 'system'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{log.details}</p>
              </div>

              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 shrink-0">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}

          {logs.length === 0 && !loading && (
            <div className="p-12 text-center text-slate-500 text-xs">No activity records found.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
