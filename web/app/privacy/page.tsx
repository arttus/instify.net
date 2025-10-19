import { Metadata } from 'next';
import { generateMetadata, seoPages } from '@/lib/seo';
import { StructuredData, createBreadcrumbSchema } from '@/components/structured-data';
import PrivacyPageClient from './privacy-client';

export const metadata: Metadata = generateMetadata(seoPages.privacy);

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', url: 'https://odeuo.com' },
  { name: 'Privacy Policy', url: 'https://odeuo.com/privacy' }
]);

export default function PrivacyPage() {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <PrivacyPageClient />
    </>
  );
}
