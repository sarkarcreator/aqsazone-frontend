import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aqsa Zone | Digital Services & Creative Portfolio',
  description:
    'Turning Ideas Into Digital Experiences. Professional portfolio and digital services in Web Development, AI Automation, Branding, and Marketing by Aqsa.',
  openGraph: {
    title: 'Aqsa Zone | Digital Services & Creative Portfolio',
    description:
      'Turning Ideas Into Digital Experiences. Professional portfolio and digital services in Web Development, AI Automation, Branding, and Marketing by Aqsa.',
    type: 'website',
    siteName: 'Aqsa Zone',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aqsa Zone | Digital Services & Creative Portfolio',
    description:
      'Turning Ideas Into Digital Experiences. Professional portfolio and digital services in Web Development, AI Automation, Branding, and Marketing by Aqsa.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Aqsa Zone',
    description:
      'Turning Ideas Into Digital Experiences. Digital services, AI automation, web development, and branding by Aqsa.',
    url: 'https://aqsazone.com',
    founder: {
      '@type': 'Person',
      name: 'Aqsa',
      jobTitle: 'Digital Professional & Creative Problem Solver',
    },
    serviceType: [
      'Web Development',
      'AI Automation & Agents',
      'Brand Identity Design',
      'SEO & Google Ranking',
      'Digital Marketing',
    ],
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
