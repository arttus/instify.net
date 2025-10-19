// ==================================================
// EXAMPLE: Fetching Payload Data in Next.js Pages
// ==================================================

// ---------------------------------------------
// 1. Homepage - Show featured attorneys and case studies
// app/(app)/page.tsx
// ---------------------------------------------

import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'

export default async function HomePage() {
  const payload = await getPayloadHMR({ config: configPromise })

  // Fetch featured attorneys
  const attorneys = await payload.find({
    collection: 'attorneys',
    where: {
      status: { equals: 'active' },
    },
    limit: 3,
  })

  // Fetch featured case studies
  const caseStudies = await payload.find({
    collection: 'case-studies',
    where: {
      featured: { equals: true },
    },
    limit: 3,
    sort: '-publishedDate',
  })

  // Fetch practice areas
  const practiceAreas = await payload.find({
    collection: 'practice-areas',
    limit: 6,
  })

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">
            Experienced Legal Representation
          </h1>
          <p className="text-xl mb-8">
            Protecting your rights with personalized attention and proven results
          </p>
          <Link
            href="/contact"
            className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Free Consultation
          </Link>
        </div>
      </section>

      {/* Practice Areas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Practice Areas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {practiceAreas.docs.map((area) => (
              <Link
                key={area.id}
                href={`/practice-areas/${area.slug}`}
                className="border rounded-lg p-6 hover:shadow-lg transition"
              >
                {area.icon && (
                  <Image
                    src={area.icon.url}
                    alt={area.icon.alt}
                    width={64}
                    height={64}
                    className="mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold mb-2">{area.name}</h3>
                <p className="text-gray-600">{area.shortDescription}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Attorneys */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Our Attorneys</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {attorneys.docs.map((attorney) => (
              <div key={attorney.id} className="text-center">
                <Image
                  src={attorney.photo.url}
                  alt={attorney.photo.alt}
                  width={200}
                  height={200}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold">{attorney.name}</h3>
                <p className="text-gray-600">{attorney.title}</p>
                <Link
                  href={`/attorneys/${attorney.slug}`}
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  View Profile →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Recent Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {caseStudies.docs.map((study) => (
              <div key={study.id} className="border rounded-lg p-6">
                <div className="text-sm text-blue-600 mb-2">
                  {study.practiceArea.name}
                </div>
                <h3 className="text-xl font-semibold mb-2">{study.title}</h3>
                <p className="text-gray-600 mb-4">{study.summary}</p>
                <div className="font-bold text-green-600">{study.outcome}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// ---------------------------------------------
// 2. Attorney Detail Page
// app/(app)/attorneys/[slug]/page.tsx
// ---------------------------------------------

import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise })
  const attorneys = await payload.find({
    collection: 'attorneys',
    limit: 100,
  })

  return attorneys.docs.map((attorney) => ({
    slug: attorney.slug,
  }))
}

export default async function AttorneyPage({ params }: { params: { slug: string } }) {
  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'attorneys',
    where: {
      slug: { equals: params.slug },
    },
    limit: 1,
  })

  if (result.docs.length === 0) {
    notFound()
  }

  const attorney = result.docs[0]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div>
          <Image
            src={attorney.photo.url}
            alt={attorney.photo.alt}
            width={300}
            height={300}
            className="rounded-lg mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">{attorney.name}</h1>
          <p className="text-xl text-gray-600 mb-4">{attorney.title}</p>
          
          <div className="space-y-2 mb-6">
            {attorney.email && (
              <a href={`mailto:${attorney.email}`} className="block text-blue-600">
                {attorney.email}
              </a>
            )}
            {attorney.phone && (
              <a href={`tel:${attorney.phone}`} className="block text-blue-600">
                {attorney.phone}
              </a>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Practice Areas</h3>
            <ul className="space-y-1">
              {attorney.practiceAreas.map((area) => (
                <li key={area.id}>
                  <a href={`/practice-areas/${area.slug}`} className="text-blue-600">
                    {area.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: attorney.bio }} />
          </div>

          {attorney.barAdmissions && attorney.barAdmissions.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Bar Admissions</h2>
              <ul className="list-disc list-inside">
                {attorney.barAdmissions.map((admission, i) => (
                  <li key={i}>
                    {admission.state} ({admission.year})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {attorney.education && attorney.education.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Education</h2>
              <ul className="space-y-2">
                {attorney.education.map((edu, i) => (
                  <li key={i}>
                    <div className="font-semibold">{edu.degree}</div>
                    <div className="text-gray-600">
                      {edu.school} {edu.year && `(${edu.year})`}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------
// 3. Practice Area Page with FAQs
// app/(app)/practice-areas/[slug]/page.tsx
// ---------------------------------------------

import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise })
  const areas = await payload.find({
    collection: 'practice-areas',
    limit: 100,
  })

  return areas.docs.map((area) => ({
    slug: area.slug,
  }))
}

export default async function PracticeAreaPage({ params }: { params: { slug: string } }) {
  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'practice-areas',
    where: {
      slug: { equals: params.slug },
    },
    limit: 1,
  })

  if (result.docs.length === 0) {
    notFound()
  }

  const area = result.docs[0]

  // Get attorneys in this practice area
  const attorneys = await payload.find({
    collection: 'attorneys',
    where: {
      'practiceAreas.slug': { equals: params.slug },
      status: { equals: 'active' },
    },
  })

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">{area.name}</h1>
      <p className="text-xl text-gray-600 mb-8">{area.shortDescription}</p>

      {/* Full Content */}
      <div className="prose max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: area.fullContent }} />
      </div>

      {/* FAQs */}
      {area.faqs && area.faqs.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {area.faqs.map((faq, i) => (
              <details key={i} className="border rounded-lg p-4">
                <summary className="font-semibold cursor-pointer">
                  {faq.question}
                </summary>
                <div className="mt-4 prose">
                  <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Related Attorneys */}
      {attorneys.docs.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-6">Our {area.name} Attorneys</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {attorneys.docs.map((attorney) => (
              <a
                key={attorney.id}
                href={`/attorneys/${attorney.slug}`}
                className="border rounded-lg p-4 hover:shadow-lg transition"
              >
                <img
                  src={attorney.photo.url}
                  alt={attorney.photo.alt}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h3 className="font-semibold">{attorney.name}</h3>
                <p className="text-gray-600 text-sm">{attorney.title}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------
// 4. API Route for AI System
// app/api/ai-context/route.ts
// ---------------------------------------------

import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const practiceArea = searchParams.get('practiceArea')

  const payload = await getPayloadHMR({ config: configPromise })

  // Get practice area info
  let areaInfo = null
  if (practiceArea) {
    const areaResult = await payload.find({
      collection: 'practice-areas',
      where: {
        slug: { equals: practiceArea },
      },
      limit: 1,
    })
    areaInfo = areaResult.docs[0] || null
  }

  // Get general FAQs
  const generalFaqs = await payload.find({
    collection: 'faqs',
    where: {
      showInAI: { equals: true },
    },
    limit: 20,
    sort: '-priority',
  })

  // Get attorneys for this practice area
  const attorneys = practiceArea
    ? await payload.find({
        collection: 'attorneys',
        where: {
          'practiceAreas.slug': { equals: practiceArea },
          status: { equals: 'active' },
        },
      })
    : { docs: [] }

  return NextResponse.json({
    practiceArea: areaInfo
      ? {
          name: areaInfo.name,
          description: areaInfo.shortDescription,
          faqs: areaInfo.faqs || [],
        }
      : null,
    generalFaqs: generalFaqs.docs.map((faq) => ({
      question: faq.question,
      answer: faq.answer, // Note: You'll want to convert rich text to plain text
      category: faq.category?.name,
    })),
    attorneys: attorneys.docs.map((attorney) => ({
      name: attorney.name,
      title: attorney.title,
      email: attorney.email,
      phone: attorney.phone,
    })),
  })
}

// ---------------------------------------------
// 5. Utility: Convert Rich Text to Plain Text
// lib/richtext-to-plain.ts
// ---------------------------------------------

export function richtextToPlain(richText: any): string {
  if (!richText || !richText.root) return ''

  function extractText(node: any): string {
    if (node.type === 'text') {
      return node.text || ''
    }

    if (node.children && Array.isArray(node.children)) {
      return node.children.map(extractText).join('')
    }

    return ''
  }

  return extractText(richText.root)
}

// Use in your API:
// answer: richtextToPlain(faq.answer)
