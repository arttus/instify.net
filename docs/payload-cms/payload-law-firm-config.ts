// payload.config.ts - Law Firm Template
// Copy this file to your Next.js project root

import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // ===== ADMIN PANEL =====
  admin: {
    user: 'users',
    meta: {
      titleSuffix: `- ${process.env.NEXT_PUBLIC_FIRM_NAME || 'Law Firm'} Admin`,
      favicon: '/favicon.ico',
      ogImage: '/og-image.png',
    },
  },

  // ===== COLLECTIONS (Content Types) =====
  collections: [
    // ----- ATTORNEYS -----
    {
      slug: 'attorneys',
      admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'title', 'status'],
        group: 'Content',
      },
      access: {
        read: () => true, // Public can read
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            description: 'URL: /attorneys/[slug]',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'e.g., Managing Partner, Senior Associate',
          },
        },
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'bio',
          type: 'richText',
          required: true,
        },
        {
          name: 'practiceAreas',
          type: 'relationship',
          relationTo: 'practice-areas',
          hasMany: true,
          required: true,
        },
        {
          name: 'barAdmissions',
          type: 'array',
          fields: [
            {
              name: 'state',
              type: 'text',
              required: true,
            },
            {
              name: 'year',
              type: 'number',
              required: true,
            },
          ],
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'active',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ],
        },
      ],
    },

    // ----- PRACTICE AREAS -----
    {
      slug: 'practice-areas',
      admin: {
        useAsTitle: 'name',
        group: 'Content',
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'shortDescription',
          type: 'textarea',
          required: true,
          maxLength: 200,
          admin: {
            description: 'Brief description for cards/listings',
          },
        },
        {
          name: 'fullContent',
          type: 'richText',
          required: true,
          admin: {
            description: 'Full page content',
          },
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'faqs',
          type: 'array',
          label: 'FAQs (Available to AI)',
          fields: [
            {
              name: 'question',
              type: 'text',
              required: true,
            },
            {
              name: 'answer',
              type: 'richText',
              required: true,
            },
          ],
          admin: {
            description: 'These FAQs will be used by your AI receptionist',
          },
        },
      ],
    },

    // ----- CASE STUDIES -----
    {
      slug: 'case-studies',
      admin: {
        useAsTitle: 'title',
        group: 'Content',
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'practiceArea',
          type: 'relationship',
          relationTo: 'practice-areas',
          required: true,
        },
        {
          name: 'summary',
          type: 'textarea',
          required: true,
          maxLength: 300,
        },
        {
          name: 'fullStory',
          type: 'richText',
          required: true,
        },
        {
          name: 'outcome',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'e.g., $2.5M settlement, Charges dismissed',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show on homepage',
          },
        },
        {
          name: 'publishedDate',
          type: 'date',
          required: true,
        },
      ],
    },

    // ----- FAQS (General) -----
    {
      slug: 'faqs',
      admin: {
        useAsTitle: 'question',
        group: 'Content',
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'practice-areas',
        },
        {
          name: 'showInAI',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Make available to AI receptionist',
          },
        },
        {
          name: 'priority',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Higher = shown first (0 = normal)',
          },
        },
      ],
    },

    // ----- MEDIA (Images/Files) -----
    {
      slug: 'media',
      upload: {
        staticDir: 'media',
        imageSizes: [
          {
            name: 'thumbnail',
            width: 400,
            height: 400,
            position: 'centre',
          },
          {
            name: 'card',
            width: 768,
            height: 512,
            position: 'centre',
          },
          {
            name: 'large',
            width: 1920,
            height: undefined,
            position: 'centre',
          },
        ],
        mimeTypes: ['image/*'],
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
          admin: {
            description: 'Describe the image for accessibility',
          },
        },
      ],
    },

    // ----- USERS (Admin Access) -----
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
        group: 'Admin',
      },
      access: {
        delete: () => false, // Prevent deletion
        update: ({ req }) => req.user, // Only self-update
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          required: true,
          defaultValue: 'editor',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
          ],
          access: {
            // Only admins can change roles
            update: ({ req }) => req.user?.role === 'admin',
          },
        },
      ],
    },

    // ----- PAGES (Optional - for custom pages) -----
    {
      slug: 'pages',
      admin: {
        useAsTitle: 'title',
        group: 'Content',
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            description: 'URL: /[slug]',
          },
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'draft',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
        },
      ],
    },
  ],

  // ===== RICH TEXT EDITOR =====
  editor: lexicalEditor(),

  // ===== DATABASE =====
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI!,
    },
  }),

  // ===== SECURITY =====
  secret: process.env.PAYLOAD_SECRET || '',

  // ===== TYPESCRIPT =====
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // ===== IMAGE PROCESSING =====
  sharp,

  // ===== CORS (for API access) =====
  cors: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ].filter(Boolean),

  // ===== CSRF PROTECTION =====
  csrf: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ].filter(Boolean),
})
