'use client';


import { apiUrl } from '@/lib/api-client';
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Briefcase,
  Plus,
  Mail,
  Phone,
  MessageSquare,
  FolderKanban,
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  Loader2,
} from 'lucide-react';

interface ClientProject {
  id: number;
  clientId: number;
  projectName: string;
  serviceName?: string | null;
  status: string;
  budget?: string | null;
  notes?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

interface Client {
  id: number;
  leadId?: number | null;
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
  status: string;
  notes?: string | null;
  createdAt: string;
  projects?: ClientProject[];
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    projectName: '',
    serviceName: '',
    status: 'in_progress',
    budget: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(apiUrl('/api/clients'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients || []);
      }
    } catch (err) {
      console.error('Failed to load clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddProjectToClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(apiUrl(`/api/clients/${selectedClient.id}/projects`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProjectData),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedProjects = [...(selectedClient.projects || []), data.project];
        const updatedClient = { ...selectedClient, projects: updatedProjects };

        setSelectedClient(updatedClient);
        setClients((prev) =>
          prev.map((c) => (c.id === selectedClient.id ? updatedClient : c))
        );

        setShowAddProjectModal(false);
        setNewProjectData({
          projectName: '',
          serviceName: '',
          status: 'in_progress',
          budget: '',
          notes: '',
        });
      }
    } catch (err) {
      console.error('Failed to add project to client:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Client Accounts & Project History"
      subtitle="Manage active customer accounts, monitor project engagements, and track client delivery."
    >
      <div className="space-y-6">
        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div
              key={client.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-purple-500/40 transition-all"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 font-bold">
                      CLIENT #{client.id}
                    </span>
                    <h3 className="text-lg font-bold text-white">{client.name}</h3>
                    {client.company && (
                      <p className="text-xs text-slate-400">{client.company}</p>
                    )}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      client.status === 'active'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {client.status}
                  </span>
                </div>

                {/* Contact info strip */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs text-slate-300 mb-4">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                </div>

                {/* Projects overview */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Projects Roster</span>
                    <span className="text-purple-300 font-bold font-mono">
                      {client.projects?.length || 0}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {client.projects && client.projects.length > 0 ? (
                      client.projects.map((proj) => (
                        <div
                          key={proj.id}
                          className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="text-white font-medium block truncate max-w-[170px]">
                              {proj.projectName}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {proj.serviceName || 'General Project'}
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-400 uppercase font-semibold">
                            {proj.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-[11px] text-slate-500 py-2 italic text-center">
                        No active project recorded yet.
                      </div>
                    )}
                  </div>
                </div>

                {client.notes && (
                  <p className="text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80 mb-4 line-clamp-2">
                    {client.notes}
                  </p>
                )}
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedClient(client);
                    setShowAddProjectModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Assign Project</span>
                </button>

                <span className="text-[10px] font-mono text-slate-500">
                  Since {new Date(client.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}

          {clients.length === 0 && !loading && (
            <div className="col-span-full py-16 text-center text-slate-500 bg-slate-900/40 border border-slate-800 rounded-3xl">
              <Briefcase className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <h3 className="text-base font-semibold text-white">No active clients yet</h3>
              <p className="text-xs text-slate-400 mt-1">
                Convert a Won lead in the Leads & CRM section to establish a client profile.
              </p>
            </div>
          )}
        </div>

        {/* Modal: Add Project to Client */}
        {showAddProjectModal && selectedClient && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
            onClick={() => setShowAddProjectModal(false)}
          >
            <div
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Add Project to Client</h3>
                  <p className="text-xs text-purple-300">
                    Client: {selectedClient.name} ({selectedClient.company || 'Direct'})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddProjectToClient} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProjectData.projectName}
                    onChange={(e) =>
                      setNewProjectData({ ...newProjectData, projectName: e.target.value })
                    }
                    placeholder="E.g. Q4 E-Commerce Replatforming"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Service Type
                    </label>
                    <input
                      type="text"
                      value={newProjectData.serviceName}
                      onChange={(e) =>
                        setNewProjectData({ ...newProjectData, serviceName: e.target.value })
                      }
                      placeholder="Web Development / AI"
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Status
                    </label>
                    <select
                      value={newProjectData.status}
                      onChange={(e) =>
                        setNewProjectData({ ...newProjectData, status: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                      <option value="paused">Paused</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Budget / Value
                  </label>
                  <input
                    type="text"
                    value={newProjectData.budget}
                    onChange={(e) =>
                      setNewProjectData({ ...newProjectData, budget: e.target.value })
                    }
                    placeholder="$7,500"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={newProjectData.notes}
                    onChange={(e) =>
                      setNewProjectData({ ...newProjectData, notes: e.target.value })
                    }
                    placeholder="Milestones or requirements..."
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProjectModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Add Project to Client'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
