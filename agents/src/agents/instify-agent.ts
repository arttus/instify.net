/**
 * Instify Voice AI Agent
 * Migrated from Python to TypeScript using LiveKit Agents JS
 */

import { voice, llm } from '@livekit/agents';
import type { CustomerContext, ConversationEvent, ConversationSummary } from '@/types/agent.js';
import { agentLogger, logConversationEvent } from '@/utils/logger.js';
import { agentConfig } from '@/config/settings.js';

export class InstifyVoiceAgent extends voice.Agent {
  private roomName: string;
  private customerContext: CustomerContext;
  private conversationStart: Date;
  private conversationHistory: ConversationEvent[] = [];

  constructor(
    roomName: string,
    customerContext: CustomerContext = {}
  ) {
    // Build comprehensive agent instructions
    const instructions = InstifyVoiceAgent.buildAgentInstructions(customerContext);
    
    super({ instructions });
    
    this.roomName = roomName;
    this.customerContext = customerContext;
    this.conversationStart = new Date();
    
    agentLogger.info(`🤖 Instify Voice Agent initialized for room: ${roomName}`);
  }

  private static buildAgentInstructions(customerContext?: CustomerContext): string {
    const baseInstructions = `
You are an AI assistant for Instify, a cutting-edge customer engagement automation platform. 
You help businesses automate and enhance their customer interactions across multiple channels 
including Instagram DMs, SMS, WhatsApp, and voice calls.

## Your Role & Personality:
- You are professional, helpful, and knowledgeable about customer engagement
- You speak naturally and conversationally, avoiding robotic responses
- You're enthusiastic about helping businesses improve their customer relationships
- You can handle both technical questions and general business inquiries
- You maintain a friendly but professional tone

## Core Capabilities:
1. **Platform Guidance**: Help users understand Instify's features and capabilities
2. **Automation Setup**: Guide users through setting up customer engagement workflows
3. **Multi-Channel Support**: Explain how to manage Instagram, SMS, WhatsApp, and voice channels
4. **Analytics & Insights**: Help interpret customer engagement metrics
5. **Troubleshooting**: Assist with platform issues and configuration problems
6. **Best Practices**: Share customer engagement strategies and best practices

## Communication Guidelines:
- Keep responses concise and actionable
- Ask clarifying questions when needed
- Provide specific examples when explaining features
- Offer to escalate to human support for complex technical issues
- Always maintain customer confidentiality and data privacy

## Response Format:
- Speak naturally without complex formatting or symbols
- Use bullet points sparingly and only when listing specific items
- Avoid emojis, asterisks, or other text decorations in speech
- Keep responses under 100 words unless detailed explanation is requested
    `.trim();

    // Add customer-specific context if available
    if (customerContext && Object.keys(customerContext).length > 0) {
      const contextAddition = InstifyVoiceAgent.formatCustomerContext(customerContext);
      return `${baseInstructions}\n\n## Customer Context:\n${contextAddition}`;
    }

    return baseInstructions;
  }

  private static formatCustomerContext(context: CustomerContext): string {
    const contextParts: string[] = [];

    if (context.company_name) {
      contextParts.push(`Company: ${context.company_name}`);
    }

    if (context.industry) {
      contextParts.push(`Industry: ${context.industry}`);
    }

    if (context.previous_interactions) {
      contextParts.push(`Previous interactions: ${context.previous_interactions}`);
    }

    if (context.current_plan) {
      contextParts.push(`Current plan: ${context.current_plan}`);
    }

    if (context.integration_channels && context.integration_channels.length > 0) {
      const channels = context.integration_channels.join(', ');
      contextParts.push(`Active channels: ${channels}`);
    }

    return contextParts.length > 0 
      ? contextParts.join('\n') 
      : 'No specific customer context available.';
  }

  public getGreetingInstructions(): string {
    if (this.customerContext.company_name) {
      const company = this.customerContext.company_name;
      return `
        Greet the caller warmly and introduce yourself as an AI assistant from Instify. 
        Acknowledge that you're here to help ${company} with their customer engagement needs.
        Ask how you can assist them today with their automation workflows or platform questions.
        Keep the greeting under 30 words and sound natural and welcoming.
      `.trim();
    } else {
      return `
        Greet the caller warmly and introduce yourself as an AI assistant from Instify.
        Explain that you help businesses with customer engagement automation across multiple channels.
        Ask how you can assist them today with their automation needs.
        Keep the greeting under 30 words and sound natural and welcoming.
      `.trim();
    }
  }

  public updateCustomerContext(newContext: Partial<CustomerContext>): void {
    this.customerContext = { ...this.customerContext, ...newContext };
    agentLogger.info(`Updated customer context for room ${this.roomName}`);
  }

  public logConversationEvent(eventType: string, data: Record<string, any>): void {
    const event: ConversationEvent = {
      timestamp: new Date().toISOString(),
      room_name: this.roomName,
      event_type: eventType,
      data,
    };
    
    this.conversationHistory.push(event);
    logConversationEvent(this.roomName, eventType, data);
  }

  public shouldEscalate(userMessage: string): boolean {
    const escalationKeywords = [
      'speak to human', 'human agent', 'real person',
      'escalate', 'supervisor', 'manager',
      'cancel account', 'billing issue', 'refund',
      'technical problem', 'bug', 'not working'
    ];

    const messageLower = userMessage.toLowerCase();
    return escalationKeywords.some(keyword => messageLower.includes(keyword));
  }

  public getEscalationInstructions(): string {
    return `
      I understand you'd like to speak with a human representative. 
      Let me connect you with our support team who can provide more personalized assistance.
      Please hold on while I transfer your call. Your conversation history will be shared 
      with the support agent to ensure continuity.
    `.trim();
  }

  public getConversationSummary(): ConversationSummary {
    const duration = Math.floor((Date.now() - this.conversationStart.getTime()) / 1000);

    return {
      room_name: this.roomName,
      duration_seconds: duration,
      start_time: this.conversationStart.toISOString(),
      customer_context: this.customerContext,
      event_count: this.conversationHistory.length,
      events: this.conversationHistory,
    };
  }

  // Override lifecycle methods for custom behavior
  async onEnter(): Promise<void> {
    agentLogger.info(`🎯 Agent entering room: ${this.roomName}`);
    this.logConversationEvent('agent_entered', {
      customer_context: this.customerContext,
    });
  }

  async onExit(): Promise<void> {
    agentLogger.info(`👋 Agent exiting room: ${this.roomName}`);
    const summary = this.getConversationSummary();
    this.logConversationEvent('agent_exited', {
      conversation_summary: summary,
    });
  }
}
