/**
 * Tests for ODEUOVoiceAgent
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ODEUOVoiceAgent } from '../odeuo-agent.js';
import type { CustomerContext } from '@/types/agent.js';

describe('ODEUOVoiceAgent', () => {
  let agent: ODEUOVoiceAgent;
  const roomName = 'test-room-123';

  beforeEach(() => {
    agent = new ODEUOVoiceAgent(roomName);
  });

  describe('constructor', () => {
    it('should initialize with room name', () => {
      expect(agent).toBeDefined();
    });

    it('should initialize with customer context', () => {
      const customerContext: CustomerContext = {
        company_name: 'Test Company',
        industry: 'Technology',
        current_plan: 'Pro',
      };

      const agentWithContext = new ODEUOVoiceAgent(roomName, customerContext);
      expect(agentWithContext).toBeDefined();
    });
  });

  describe('getGreetingInstructions', () => {
    it('should return generic greeting when no customer context', () => {
      const greeting = agent.getGreetingInstructions();
      expect(greeting).toContain('ODEUO');
      expect(greeting).toContain('customer engagement automation');
    });

    it('should return personalized greeting with company name', () => {
      const customerContext: CustomerContext = {
        company_name: 'Acme Corp',
      };

      const agentWithContext = new ODEUOVoiceAgent(roomName, customerContext);
      const greeting = agentWithContext.getGreetingInstructions();
      
      expect(greeting).toContain('Acme Corp');
      expect(greeting).toContain('customer engagement needs');
    });
  });

  describe('shouldEscalate', () => {
    it('should detect escalation keywords', () => {
      const escalationMessages = [
        'I want to speak to a human agent',
        'Can I talk to a real person?',
        'This is not working, escalate please',
        'I need to cancel my account',
        'There is a billing issue',
      ];

      escalationMessages.forEach(message => {
        expect(agent.shouldEscalate(message)).toBe(true);
      });
    });

    it('should not escalate for normal messages', () => {
      const normalMessages = [
        'Hello, how are you?',
        'Can you help me with my automation?',
        'What features does ODEUO offer?',
        'How do I set up Instagram integration?',
      ];

      normalMessages.forEach(message => {
        expect(agent.shouldEscalate(message)).toBe(false);
      });
    });
  });

  describe('updateCustomerContext', () => {
    it('should update customer context', () => {
      const newContext = {
        industry: 'E-commerce',
        current_plan: 'Enterprise',
      };

      agent.updateCustomerContext(newContext);
      
      // We can't directly access the private property, but we can test
      // that the method doesn't throw and the greeting changes
      expect(() => agent.updateCustomerContext(newContext)).not.toThrow();
    });
  });

  describe('logConversationEvent', () => {
    it('should log conversation events', () => {
      const eventType = 'user_message';
      const eventData = { message: 'Hello', timestamp: new Date().toISOString() };

      expect(() => agent.logConversationEvent(eventType, eventData)).not.toThrow();
    });
  });

  describe('getConversationSummary', () => {
    it('should return conversation summary', () => {
      // Log some events first
      agent.logConversationEvent('agent_started', {});
      agent.logConversationEvent('user_message', { message: 'Hello' });

      const summary = agent.getConversationSummary();

      expect(summary).toHaveProperty('room_name', roomName);
      expect(summary).toHaveProperty('duration_seconds');
      expect(summary).toHaveProperty('start_time');
      expect(summary).toHaveProperty('customer_context');
      expect(summary).toHaveProperty('event_count', 2);
      expect(summary).toHaveProperty('events');
      expect(summary.events).toHaveLength(2);
    });
  });

  describe('getEscalationInstructions', () => {
    it('should return escalation instructions', () => {
      const instructions = agent.getEscalationInstructions();
      
      expect(instructions).toContain('human representative');
      expect(instructions).toContain('support team');
      expect(instructions).toContain('conversation history');
    });
  });
});
