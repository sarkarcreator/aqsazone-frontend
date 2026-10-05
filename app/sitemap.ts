import { MetadataRoute } from 'next';
import { getServices, getProjects, getCaseStudies } from '@/lib/db-queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_URL || 'https://aqsazone.com';

  const [servicesList, projectsList, caseStudiesList] = await Promise.all([
    getServices({ publishedOnly: true }),
    getProjects({ publishedOnly: true }),
    getCaseStudies({ publishedOnly: true }),
  ]);

  const staticRoutes = [
    '',
    '/about',
    '/services',
    '/portfolio',
    '/case-studies',
    '/testimonials',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const serviceRoutes = servicesList.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: new Date(s.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const projectRoutes = projectsList.map((p) => ({
    url: `${baseUrl}/portfolio/${p.slug}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const caseStudyRoutes = caseStudiesList.map((cs) => ({
    url: `${baseUrl}/case-studies/${cs.slug}`,
    lastModified: new Date(cs.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...caseStudyRoutes];
}
