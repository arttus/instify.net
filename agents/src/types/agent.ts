/**
 * Type definitions for Instify Voice AI Agent
 */

export interface CustomerContext {
  company_name?: string;
  industry?: string;
  previous_interactions?: string;
  current_plan?: string;
  integration_channels?: string[];
  [key: string]: any;
}

export interface ConversationEvent {
  timestamp: string;
  room_name: string;
  event_type: string;
  data: Record<string, any>;
}

export interface ConversationSummary {
  room_name: string;
  duration_seconds: number;
  start_time: string;
  customer_context: CustomerContext;
  event_count: number;
  events: ConversationEvent[];
}

export interface AgentMetrics {
  active_sessions: number;
  total_conversations: number;
  average_session_duration: number;
  last_activity: string | null;
}

export interface SystemMetrics {
  cpu_percent: number;
  memory: {
    total: number;
    available: number;
    percent: number;
    used: number;
  };
  disk: {
    total: number;
    free: number;
    used: number;
    percent: number;
  };
  network: {
    bytes_sent: number;
    bytes_recv: number;
    packets_sent: number;
    packets_recv: number;
  };
  processes: number;
}

export interface HealthStatus {
  status: 'starting' | 'healthy' | 'unhealthy';
  start_time: string;
  last_check: string | null;
  checks: Record<string, any>;
  system_metrics?: SystemMetrics;
  agent_metrics?: AgentMetrics;
}

export type AgentMode = 'dev' | 'console' | 'production';

export interface EscalationKeywords {
  keywords: string[];
  auto_escalate_after: number;
  max_escalation_attempts: number;
}
