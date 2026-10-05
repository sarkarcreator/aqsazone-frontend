import { apiUrl } from '@/lib/api-client';

async function getJson<T>(path: string, init?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(apiUrl(path), { ...init, cache: 'no-store' });
    if (!res.ok) throw new Error(`API request failed: ${res.status}`);
    return (await res.json()) as T;
  } catch (error) {
    console.error(`API request failed for ${path}:`, error);
    if (fallback !== undefined) return fallback;
    throw error;
  }
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  const data = await getJson<{ settings: Record<string, string> }>('/api/settings', undefined, { settings: {} });
  return data.settings || {};
}

export async function getCategories() {
  const data = await getJson<{ categories: any[] }>('/api/services', undefined, { categories: [] });
  return data.categories || [];
}

export async function getServices(options?: { publishedOnly?: boolean; featuredOnly?: boolean }) {
  const params = new URLSearchParams();
  if (options?.publishedOnly) params.set('admin', 'false');
  if (options?.featuredOnly) params.set('featured', 'true');
  const data = await getJson<{ services: any[] }>(`/api/services${params.toString() ? `?${params}` : ''}`, undefined, { services: [] });
  let services = data.services || [];
  if (options?.featuredOnly) services = services.filter((item) => item.isFeatured);
  return services;
}

export async function getServiceBySlug(slug: string) {
  const data = await getJson<{ service: any }>(`/api/services/${encodeURIComponent(slug)}`, undefined, { service: null });
  return data.service || null;
}

export async function getProjects(options?: {
  publishedOnly?: boolean; featuredOnly?: boolean; categorySlug?: string; format?: string; sourceType?: string; search?: string;
}) {
  const params = new URLSearchParams();
  if (!options?.publishedOnly) params.set('admin', 'true');
  else params.set('admin', 'false');
  if (options?.featuredOnly) params.set('featured', 'true');
  if (options?.categorySlug && options.categorySlug !== 'all') params.set('category', options.categorySlug);
  if (options?.format && options.format !== 'all') params.set('format', options.format);
  if (options?.sourceType && options.sourceType !== 'all') params.set('sourceType', options.sourceType);
  if (options?.search) params.set('search', options.search);
  const data = await getJson<{ projects: any[] }>(`/api/projects?${params}`, undefined, { projects: [] });
  return data.projects || [];
}

export async function getProjectBySlug(slug: string) {
  const data = await getJson<{ project: any }>(`/api/projects/${encodeURIComponent(slug)}`, undefined, { project: null });
  return data.project || null;
}

export async function getCaseStudies(options?: { publishedOnly?: boolean; featuredOnly?: boolean }) {
  const params = new URLSearchParams();
  if (!options?.publishedOnly) params.set('admin', 'true');
  else params.set('admin', 'false');
  if (options?.featuredOnly) params.set('featured', 'true');
  const data = await getJson<{ caseStudies: any[] }>(`/api/case-studies?${params}`, undefined, { caseStudies: [] });
  return data.caseStudies || [];
}

export async function getCaseStudyBySlug(slug: string) {
  const data = await getJson<{ caseStudy: any }>(`/api/case-studies/${encodeURIComponent(slug)}`, undefined, { caseStudy: null });
  return data.caseStudy || null;
}

export async function getTestimonials(options?: { publishedOnly?: boolean; featuredOnly?: boolean }) {
  const params = new URLSearchParams();
  if (!options?.publishedOnly) params.set('admin', 'true');
  else params.set('admin', 'false');
  if (options?.featuredOnly) params.set('featured', 'true');
  const data = await getJson<{ testimonials: any[] }>(`/api/testimonials?${params}`, undefined, { testimonials: [] });
  let list = data.testimonials || [];
  if (options?.featuredOnly) list = list.filter((item) => item.isFeatured);
  return list;
}

export async function createLead(data: Record<string, unknown>) {
  return getJson('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}

export async function getLeads(options?: Record<string, string>) {
  const params = new URLSearchParams(options || {});
  const data = await getJson<{ leads: any[] }>(`/api/leads?${params}`, undefined, { leads: [] });
  return data.leads || [];
}

export async function updateLead(id: number, data: Record<string, unknown>, token?: string) {
  return getJson(`/api/leads/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(data) });
}

export async function convertLeadToClient(leadId: number, token?: string) {
  return getJson(`/api/leads/${leadId}/convert`, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {} });
}

export async function getClients(token?: string) {
  const data = await getJson<{ clients: any[] }>('/api/clients', { headers: token ? { Authorization: `Bearer ${token}` } : {} }, { clients: [] });
  return data.clients || [];
}

export async function getAdminAnalytics(token?: string): Promise<any> {
  const data = await getJson('/api/analytics', { headers: token ? { Authorization: `Bearer ${token}` } : {} }, {});
  return data;
}

export async function getActivityLogs(token?: string): Promise<any[]> {
  const data = await getJson('/api/analytics', { headers: token ? { Authorization: `Bearer ${token}` } : {} }, {});
  return data.activityLogs || [];
}

export async function getMediaItems(token?: string) {
  const data = await getJson<{ media: any[] }>('/api/media', { headers: token ? { Authorization: `Bearer ${token}` } : {} }, { media: [] });
  return data.media || [];
}
