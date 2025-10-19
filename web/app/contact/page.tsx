import { Metadata } from 'next';
import { generateMetadata, seoPages } from '@/lib/seo';
import { StructuredData, createBreadcrumbSchema } from '@/components/structured-data';
import ContactPageClient from './contact-client';

export const metadata: Metadata = generateMetadata(seoPages.contact);

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', url: 'https://odeuo.com' },
  { name: 'Contact', url: 'https://odeuo.com/contact' }
]);

export default function ContactPage() {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <ContactPageClient />
    </>
  );
}

