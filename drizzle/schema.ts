// ============================================
// ODEUO Multi-Tenant Database Schema
// Using Drizzle ORM with PostgreSQL
// ============================================

import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  boolean, 
  integer, 
  json, 
  uuid,
  index,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================
// Tenants/Clients Table (Core Multi-Tenancy)
// ============================================
export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  
  // Clerk Organization ID (critical for linking)
  clerkOrgId: text('clerk_org_id').unique().notNull(),
  
  // Basic tenant information
  name: text('name').notNull(), // Client company name
  slug: text('slug').unique().notNull(), // URL-friendly identifier
  industry: text('industry'), // 'real_estate' | 'dental' | 'medspa' | etc
  
  // Subscription Management (Manual for MVP)
  status: text('status').notNull().default('pending'), // 'pending' | 'active' | 'suspended' | 'cancelled'
  plan: text('plan').default('basic'), // 'basic' | 'pro' | 'enterprise' | 'custom'
  monthlyRate: integer('monthly_rate'), // In cents (e.g., 29700 = $297)
  
  // Contract tracking
  contractStartDate: timestamp('contract_start_date'),
  contractEndDate: timestamp('contract_end_date'),
  
  // Usage limits (set manually per plan)
  maxConversationsPerMonth: integer('max_conversations_per_month').default(500),
  maxVoiceMinutesPerMonth: integer('max_voice_minutes_per_month').default(20),
  
  // Admin notes and billing
  notes: text('notes'), // "Paying via wire transfer, invoice sent monthly"
  billingEmail: text('billing_email'),
  
  // Settings and customization
  settings: json('settings').$type<{
    branding?: { logo?: string; primaryColor?: string };
    notifications?: { email?: string; slack?: string };
    timezone?: string;
    features?: string[];
  }>(),
  
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  clerkOrgIdx: uniqueIndex('idx_tenants_clerk_org').on(table.clerkOrgId),
  slugIdx: uniqueIndex('idx_tenants_slug').on(table.slug),
  statusIdx: index('idx_tenants_status').on(table.status),
}));

// ============================================
// Users Table (synced from Clerk)
// ============================================
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  
  // Clerk User ID (critical for linking)
  clerkUserId: text('clerk_user_id').unique().notNull(),
  
  // Organization relationship
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  
  // User info (synced from Clerk)
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  imageUrl: text('image_url'),
  
  // Role within organization
  role: text('role').notNull().default('member'), // 'owner' | 'admin' | 'member'
  
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  clerkUserIdx: uniqueIndex('idx_users_clerk_user').on(table.clerkUserId),
  tenantIdx: index('idx_users_tenant').on(table.tenantId),
  emailIdx: index('idx_users_email').on(table.email),
}));

// ============================================
// Conversations Table (Multi-tenant)
// ============================================
export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(), // CRITICAL: Tenant isolation
  
  // Contact and platform information
  contactId: text('contact_id').notNull(), // External ID (Instagram user ID, phone number, etc.)
  platform: text('platform').notNull(), // 'instagram' | 'sms' | 'whatsapp' | 'voice'
  
  // Conversation status and metadata
  status: text('status').notNull().default('active'), // 'active' | 'qualified' | 'not_interested' | 'closed'
  lastMessageAt: timestamp('last_message_at'),
  
  // Additional data
  metadata: json('metadata').$type<{
    contactName?: string;
    contactPhone?: string;
    contactEmail?: string;
    source?: string;
    tags?: string[];
  }>(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tenantCreatedIdx: index('idx_conversations_tenant_created').on(table.tenantId, table.createdAt),
  contactIdx: index('idx_conversations_contact').on(table.contactId),
  statusIdx: index('idx_conversations_status').on(table.tenantId, table.status),
  platformIdx: index('idx_conversations_platform').on(table.platform),
}));

// ============================================
// Messages Table
// ============================================
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(), // CRITICAL: Tenant isolation
  conversationId: integer('conversation_id').references(() => conversations.id).notNull(),
  
  // Message content
  role: text('role').notNull(), // 'user' | 'assistant' | 'system'
  content: text('content').notNull(),
  
  // Additional message data
  metadata: json('metadata').$type<{
    aiModel?: string;
    voiceRecordingUrl?: string;
    attachments?: string[];
    sentiment?: 'positive' | 'neutral' | 'negative';
    confidence?: number;
  }>(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  tenantCreatedIdx: index('idx_messages_tenant_created').on(table.tenantId, table.createdAt),
  conversationIdx: index('idx_messages_conversation').on(table.conversationId),
  roleIdx: index('idx_messages_role').on(table.role),
}));

// ============================================
// Leads Table
// ============================================
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(), // CRITICAL: Tenant isolation
  conversationId: integer('conversation_id').references(() => conversations.id),

  // Lead information
  firstName: text('first_name'),
  lastName: text('last_name'),
  email: text('email'),
  phone: text('phone'),
  company: text('company'),

  // Qualification data
  isQualified: boolean('is_qualified').default(false),
  qualificationScore: integer('qualification_score'), // 0-100
  qualificationData: json('qualification_data').$type<{
    budget?: string;
    timeline?: string;
    decisionMaker?: boolean;
    painPoints?: string[];
    interests?: string[];
  }>(),

  // Source and categorization
  source: text('source').notNull(), // 'instagram' | 'facebook' | 'sms' | 'voice' | 'web'
  tags: json('tags').$type<string[]>(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tenantCreatedIdx: index('idx_leads_tenant_created').on(table.tenantId, table.createdAt),
  qualifiedIdx: index('idx_leads_qualified').on(table.tenantId, table.isQualified),
  emailIdx: index('idx_leads_email').on(table.email),
  phoneIdx: index('idx_leads_phone').on(table.phone),
  sourceIdx: index('idx_leads_source').on(table.source),
}));

// ============================================
// AI Sessions Table (CopilotKit context)
// ============================================
export const aiSessions = pgTable('ai_sessions', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  conversationId: integer('conversation_id').references(() => conversations.id).notNull(),

  sessionId: text('session_id').notNull().unique(),
  context: json('context').$type<{
    memory?: Record<string, any>;
    tools?: string[];
    model?: string;
    temperature?: number;
  }>(),
  toolCalls: json('tool_calls').$type<any[]>(), // Record of tool executions

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  sessionIdx: uniqueIndex('idx_ai_sessions_session').on(table.sessionId),
  tenantIdx: index('idx_ai_sessions_tenant').on(table.tenantId),
  conversationIdx: index('idx_ai_sessions_conversation').on(table.conversationId),
}));

// ============================================
// Voice Calls Table (Livekit)
// ============================================
export const voiceCalls = pgTable('voice_calls', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  conversationId: integer('conversation_id').references(() => conversations.id),
  leadId: integer('lead_id').references(() => leads.id),

  // Livekit session data
  livekitRoomId: text('livekit_room_id').notNull(),
  duration: integer('duration'), // seconds
  recordingUrl: text('recording_url'),
  transcription: text('transcription'),

  // Call analysis
  sentiment: text('sentiment'), // 'positive' | 'neutral' | 'negative'
  outcome: text('outcome'), // 'qualified' | 'not_interested' | 'callback' | 'voicemail'

  metadata: json('metadata').$type<{
    participantCount?: number;
    qualityScore?: number;
    keyTopics?: string[];
    nextSteps?: string[];
  }>(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
}, (table) => ({
  tenantCreatedIdx: index('idx_voice_calls_tenant_created').on(table.tenantId, table.createdAt),
  livekitRoomIdx: index('idx_voice_calls_livekit_room').on(table.livekitRoomId),
  outcomeIdx: index('idx_voice_calls_outcome').on(table.outcome),
}));

// ============================================
// Automation Workflows Table (n8n tracking)
// ============================================
export const workflows = pgTable('workflows', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),

  // n8n workflow information
  n8nWorkflowId: text('n8n_workflow_id').notNull(),
  name: text('name').notNull(),
  platform: text('platform').notNull(), // 'instagram' | 'sms' | 'voice'

  // Status and metrics
  isActive: boolean('is_active').default(true),
  triggerCount: integer('trigger_count').default(0),
  successCount: integer('success_count').default(0),
  errorCount: integer('error_count').default(0),
  lastRunAt: timestamp('last_run_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tenantIdx: index('idx_workflows_tenant').on(table.tenantId),
  n8nWorkflowIdx: index('idx_workflows_n8n').on(table.n8nWorkflowId),
  platformIdx: index('idx_workflows_platform').on(table.platform),
  activeIdx: index('idx_workflows_active').on(table.isActive),
}));

// ============================================
// Usage Tracking (for billing)
// ============================================
export const usageMetrics = pgTable('usage_metrics', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),

  // Time period
  month: text('month').notNull(), // '2025-10' format

  // Usage counters
  conversationCount: integer('conversation_count').default(0),
  messageCount: integer('message_count').default(0),
  voiceMinutes: integer('voice_minutes').default(0),
  apiCalls: integer('api_calls').default(0),

  // Costs (in cents)
  openaiCost: integer('openai_cost').default(0),
  anthropicCost: integer('anthropic_cost').default(0),
  twilioCost: integer('twilio_cost').default(0),
  totalCost: integer('total_cost').default(0),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tenantMonthIdx: uniqueIndex('idx_usage_metrics_tenant_month').on(table.tenantId, table.month),
}));

// ============================================
// Invoices Table (Manual tracking)
// ============================================
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),

  // Invoice details
  invoiceNumber: text('invoice_number').unique().notNull(), // "INV-2025-10-001"
  amount: integer('amount').notNull(), // In cents
  status: text('status').notNull().default('pending'), // 'pending' | 'paid' | 'overdue' | 'cancelled'

  // Dates
  dueDate: timestamp('due_date'),
  paidAt: timestamp('paid_at'),

  // Payment information
  paymentMethod: text('payment_method'), // 'wire' | 'check' | 'stripe' | 'other'
  notes: text('notes'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tenantCreatedIdx: index('idx_invoices_tenant_created').on(table.tenantId, table.createdAt),
  statusDueIdx: index('idx_invoices_status_due').on(table.status, table.dueDate),
  invoiceNumberIdx: uniqueIndex('idx_invoices_number').on(table.invoiceNumber),
}));

// ============================================
// Analytics Events Table
// ============================================
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),

  // Event information
  eventType: text('event_type').notNull(), // 'message_sent' | 'lead_qualified' | 'call_completed'
  conversationId: integer('conversation_id').references(() => conversations.id),
  leadId: integer('lead_id').references(() => leads.id),

  // Event data
  data: json('data').$type<Record<string, any>>(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  tenantCreatedIdx: index('idx_events_tenant_created').on(table.tenantId, table.createdAt),
  eventTypeIdx: index('idx_events_type').on(table.eventType),
  conversationIdx: index('idx_events_conversation').on(table.conversationId),
  leadIdx: index('idx_events_lead').on(table.leadId),
}));

// ============================================
// Table Relations (for Drizzle queries)
// ============================================

export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  conversations: many(conversations),
  leads: many(leads),
  workflows: many(workflows),
  usageMetrics: many(usageMetrics),
  invoices: many(invoices),
  events: many(events),
}));

export const usersRelations = relations(users, ({ one }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [conversations.tenantId],
    references: [tenants.id],
  }),
  messages: many(messages),
  aiSessions: many(aiSessions),
  voiceCalls: many(voiceCalls),
  leads: many(leads),
  events: many(events),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  tenant: one(tenants, {
    fields: [messages.tenantId],
    references: [tenants.id],
  }),
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [leads.tenantId],
    references: [tenants.id],
  }),
  conversation: one(conversations, {
    fields: [leads.conversationId],
    references: [conversations.id],
  }),
  voiceCalls: many(voiceCalls),
  events: many(events),
}));

export const voiceCallsRelations = relations(voiceCalls, ({ one }) => ({
  tenant: one(tenants, {
    fields: [voiceCalls.tenantId],
    references: [tenants.id],
  }),
  conversation: one(conversations, {
    fields: [voiceCalls.conversationId],
    references: [conversations.id],
  }),
  lead: one(leads, {
    fields: [voiceCalls.leadId],
    references: [leads.id],
  }),
}));
