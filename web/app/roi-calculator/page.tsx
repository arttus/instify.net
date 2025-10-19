import { Metadata } from 'next';
import { generateMetadata, seoPages } from '@/lib/seo';
import { StructuredData, createBreadcrumbSchema } from '@/components/structured-data';
import ROICalculatorClient from './roi-calculator-client';

export const metadata: Metadata = generateMetadata(seoPages.roiCalculator);

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', url: 'https://odeuo.com' },
  { name: 'ROI Calculator', url: 'https://odeuo.com/roi-calculator' }
]);

export default function ROICalculatorPage() {
  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <ROICalculatorClient />
    </>
  );
}
