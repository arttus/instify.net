// ============================================
// Development Seed Data
// Creates test tenants, users, and sample data
// ============================================

import { db } from '../db';
import { 
  tenants, 
  users, 
  conversations, 
  messages, 
  leads,
  workflows,
  usageMetrics 
} from '../schema';

// ============================================
// Seed Data
// ============================================

export async function seedDevelopmentData() {
  console.log('🌱 Seeding development data...');

  try {
    // ============================================
    // Create Test Tenants
    // ============================================
    console.log('Creating test tenants...');
    
    const [tenant1, tenant2] = await db.insert(tenants).values([
      {
        clerkOrgId: 'org_test_realestate_123',
        name: 'Sunset Real Estate',
        slug: 'sunset-real-estate',
        industry: 'real_estate',
        status: 'active',
        plan: 'pro',
        monthlyRate: 39700, // $397
        maxConversationsPerMonth: 1000,
        maxVoiceMinutesPerMonth: 60,
        billingEmail: 'billing@sunsetrealestate.com',
        settings: {
          branding: {
            logo: 'https://example.com/sunset-logo.png',
            primaryColor: '#FF6B35'
          },
          notifications: {
            email: 'alerts@sunsetrealestate.com'
          },
          timezone: 'America/Los_Angeles',
          features: ['instagram_dm', 'sms', 'voice_ai']
        },
        notes: 'Premium client, pays monthly via Stripe'
      },
      {
        clerkOrgId: 'org_test_dental_456',
        name: 'Bright Smile Dental',
        slug: 'bright-smile-dental',
        industry: 'dental',
        status: 'active',
        plan: 'basic',
        monthlyRate: 29700, // $297
        maxConversationsPerMonth: 500,
        maxVoiceMinutesPerMonth: 30,
        billingEmail: 'admin@brightsmile.com',
        settings: {
          branding: {
            logo: 'https://example.com/dental-logo.png',
            primaryColor: '#4A90E2'
          },
          notifications: {
            email: 'notifications@brightsmile.com'
          },
          timezone: 'America/New_York',
          features: ['instagram_dm', 'sms']
        },
        notes: 'Basic plan, good payment history'
      }
    ]).returning();

    // ============================================
    // Create Test Users
    // ============================================
    console.log('Creating test users...');
    
    await db.insert(users).values([
      {
        clerkUserId: 'user_test_john_123',
        tenantId: tenant1.id,
        email: 'john@sunsetrealestate.com',
        firstName: 'John',
        lastName: 'Smith',
        role: 'owner'
      },
      {
        clerkUserId: 'user_test_sarah_456',
        tenantId: tenant1.id,
        email: 'sarah@sunsetrealestate.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'admin'
      },
      {
        clerkUserId: 'user_test_mike_789',
        tenantId: tenant2.id,
        email: 'mike@brightsmile.com',
        firstName: 'Mike',
        lastName: 'Wilson',
        role: 'owner'
      }
    ]);

    // ============================================
    // Create Test Conversations
    // ============================================
    console.log('Creating test conversations...');
    
    const [conv1, conv2, conv3] = await db.insert(conversations).values([
      {
        tenantId: tenant1.id,
        contactId: 'instagram_user_12345',
        platform: 'instagram',
        status: 'active',
        lastMessageAt: new Date(),
        metadata: {
          contactName: 'Alice Cooper',
          contactPhone: '+1234567890',
          source: 'instagram_ad',
          tags: ['interested', 'first_time_buyer']
        }
      },
      {
        tenantId: tenant1.id,
        contactId: '+1987654321',
        platform: 'sms',
        status: 'qualified',
        lastMessageAt: new Date(Date.now() - 3600000), // 1 hour ago
        metadata: {
          contactName: 'Bob Martinez',
          contactEmail: 'bob@example.com',
          source: 'referral',
          tags: ['qualified', 'ready_to_buy']
        }
      },
      {
        tenantId: tenant2.id,
        contactId: 'instagram_user_67890',
        platform: 'instagram',
        status: 'active',
        lastMessageAt: new Date(Date.now() - 1800000), // 30 minutes ago
        metadata: {
          contactName: 'Carol Davis',
          contactPhone: '+1122334455',
          source: 'instagram_story',
          tags: ['dental_cleaning', 'new_patient']
        }
      }
    ]).returning();

    // ============================================
    // Create Test Messages
    // ============================================
    console.log('Creating test messages...');
    
    await db.insert(messages).values([
      {
        tenantId: tenant1.id,
        conversationId: conv1.id,
        role: 'user',
        content: 'Hi! I saw your listing for the house on Oak Street. Is it still available?'
      },
      {
        tenantId: tenant1.id,
        conversationId: conv1.id,
        role: 'assistant',
        content: 'Hello Alice! Yes, the beautiful 3-bedroom home on Oak Street is still available. Would you like to schedule a viewing? I can show you around this weekend.',
        metadata: {
          aiModel: 'gpt-4o',
          sentiment: 'positive',
          confidence: 0.95
        }
      },
      {
        tenantId: tenant1.id,
        conversationId: conv2.id,
        role: 'user',
        content: 'I\'m ready to make an offer on the downtown condo we discussed.'
      },
      {
        tenantId: tenant1.id,
        conversationId: conv2.id,
        role: 'assistant',
        content: 'That\'s fantastic news, Bob! I\'ll prepare the offer documents right away. What price point were you thinking?',
        metadata: {
          aiModel: 'claude-sonnet-4.5',
          sentiment: 'positive',
          confidence: 0.98
        }
      }
    ]);

    // ============================================
    // Create Test Leads
    // ============================================
    console.log('Creating test leads...');
    
    await db.insert(leads).values([
      {
        tenantId: tenant1.id,
        conversationId: conv2.id,
        firstName: 'Bob',
        lastName: 'Martinez',
        email: 'bob@example.com',
        phone: '+1987654321',
        isQualified: true,
        qualificationScore: 95,
        qualificationData: {
          budget: '$400k-500k',
          timeline: 'within_30_days',
          decisionMaker: true,
          painPoints: ['need_more_space', 'better_location'],
          interests: ['downtown', 'modern_amenities']
        },
        source: 'referral',
        tags: ['hot_lead', 'ready_to_buy', 'cash_buyer']
      },
      {
        tenantId: tenant2.id,
        conversationId: conv3.id,
        firstName: 'Carol',
        lastName: 'Davis',
        email: 'carol@example.com',
        phone: '+1122334455',
        isQualified: false,
        qualificationScore: 65,
        qualificationData: {
          budget: 'insurance_covered',
          timeline: 'next_month',
          decisionMaker: true,
          painPoints: ['tooth_pain', 'overdue_cleaning'],
          interests: ['preventive_care', 'cosmetic_options']
        },
        source: 'instagram_story',
        tags: ['new_patient', 'insurance_verification_needed']
      }
    ]);

    // ============================================
    // Create Test Usage Metrics
    // ============================================
    console.log('Creating test usage metrics...');
    
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    
    await db.insert(usageMetrics).values([
      {
        tenantId: tenant1.id,
        month: currentMonth,
        conversationCount: 45,
        messageCount: 234,
        voiceMinutes: 28,
        apiCalls: 156,
        openaiCost: 1250, // $12.50
        anthropicCost: 890, // $8.90
        twilioCost: 340, // $3.40
        totalCost: 2480 // $24.80
      },
      {
        tenantId: tenant2.id,
        month: currentMonth,
        conversationCount: 23,
        messageCount: 98,
        voiceMinutes: 12,
        apiCalls: 67,
        openaiCost: 560, // $5.60
        anthropicCost: 420, // $4.20
        twilioCost: 180, // $1.80
        totalCost: 1160 // $11.60
      }
    ]);

    console.log('✅ Development data seeded successfully!');
    console.log(`Created ${tenant1.name} (ID: ${tenant1.id}) and ${tenant2.name} (ID: ${tenant2.id})`);
    
  } catch (error) {
    console.error('❌ Error seeding development data:', error);
    throw error;
  }
}

// ============================================
// Clean Development Data
// ============================================

export async function cleanDevelopmentData() {
  console.log('🧹 Cleaning development data...');
  
  try {
    // Delete in reverse order of dependencies
    await db.delete(usageMetrics);
    await db.delete(messages);
    await db.delete(leads);
    await db.delete(conversations);
    await db.delete(users);
    await db.delete(tenants);
    
    console.log('✅ Development data cleaned successfully!');
  } catch (error) {
    console.error('❌ Error cleaning development data:', error);
    throw error;
  }
}

// ============================================
// Run if called directly
// ============================================

if (require.main === module) {
  seedDevelopmentData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
