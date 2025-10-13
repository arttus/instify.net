/**
 * Instify Voice AI Agent - Main Entry Point
 * Migrated from Python to TypeScript using LiveKit Agents JS framework
 */

import {
  type JobContext,
  type JobProcess,
  WorkerOptions,
  cli,
  defineAgent,
  voice,
} from '@livekit/agents';
import * as silero from '@livekit/agents-plugin-silero';
import * as openai from '@livekit/agents-plugin-openai';
import * as google from '@livekit/agents-plugin-google';
import * as cartesia from '@livekit/agents-plugin-cartesia';
import * as deepgram from '@livekit/agents-plugin-deepgram';
import * as elevenlabs from '@livekit/agents-plugin-elevenlabs';
import * as livekit from '@livekit/agents-plugin-livekit';

import { fileURLToPath } from 'node:url';
import { InstifyVoiceAgent } from './agents/instify-agent.js';
import { settings } from './config/settings.js';
import { setupLogging, agentLogger } from './utils/logger.js';
import { startHealthServer, updateAgentMetrics } from './utils/health-server.js';
import type { CustomerContext } from './types/agent.js';

// Setup logging
setupLogging();

// Global state for tracking active sessions
let activeSessions = 0;
let totalConversations = 0;

const updateMetrics = () => {
  updateAgentMetrics({
    active_sessions: activeSessions,
    total_conversations: totalConversations,
    average_session_duration: 0, // TODO: Calculate from conversation history
    last_activity: new Date().toISOString(),
  });
};

// Create model instances based on configuration
const createSTTModel = () => {
  const provider = settings.stt_provider;

  switch (provider) {
    case 'openai':
      return new openai.STT();
    case 'deepgram':
      return new deepgram.STT();
    default:
      // Default to OpenAI Whisper since AssemblyAI plugin is not available
      return new openai.STT();
  }
};

const createLLMModel = () => {
  const provider = settings.llm_provider;
  const model = settings.llm_model;

  switch (provider) {
    case 'openai':
      return new openai.LLM({
        model: model.replace('openai/', ''),
        temperature: 0.7,
      });
    case 'google':
      return new google.LLM({
        model: model.replace('google/', ''),
        temperature: 0.7,
      });
    default:
      return new openai.LLM({
        model: 'gpt-4.1-mini',
        temperature: 0.7,
      });
  }
};

const createTTSModel = () => {
  const provider = settings.tts_provider;
  
  switch (provider) {
    case 'cartesia':
      return new cartesia.TTS();
    case 'openai':
      return new openai.TTS();
    case 'elevenlabs':
      return new elevenlabs.TTS();
    default:
      return new cartesia.TTS();
  }
};

// Define the agent
export default defineAgent({
  prewarm: async (proc: JobProcess) => {
    agentLogger.info('🔥 Prewarming agent components...');
    
    // Load VAD model
    proc.userData.vad = await silero.VAD.load();
    agentLogger.info('✅ VAD model loaded');
    
    // Prewarm AI models
    proc.userData.sttModel = createSTTModel();
    proc.userData.llmModel = createLLMModel();
    proc.userData.ttsModel = createTTSModel();
    
    agentLogger.info('✅ AI models prewarmed');
  },

  entry: async (ctx: JobContext) => {
    agentLogger.info('🚀 Starting Instify Voice AI Agent');
    agentLogger.info(`Agent Mode: ${settings.agent_mode}`);
    agentLogger.info(`LiveKit URL: ${settings.livekit_url}`);

    // Start health server in development mode
    if (settings.agent_mode === 'dev') {
      try {
        await startHealthServer(
          settings.health_server_host,
          settings.health_server_port
        );
      } catch (error) {
        agentLogger.error('Failed to start health server:', error);
      }
    }

    // Extract customer context from room metadata or participant info
    const customerContext: CustomerContext = {};
    
    // TODO: Extract customer context from room metadata
    // This would typically come from your application when creating the room
    if (ctx.room.metadata) {
      try {
        const metadata = JSON.parse(ctx.room.metadata);
        Object.assign(customerContext, metadata.customerContext || {});
      } catch (error) {
        agentLogger.warn('Failed to parse room metadata:', error);
      }
    }

    // Create the Instify-specific agent
    const agent = new InstifyVoiceAgent(ctx.room.name || 'unknown', customerContext);

    // Create agent session with configured models
    const session = new voice.AgentSession({
      stt: ctx.proc.userData.sttModel as any,
      llm: ctx.proc.userData.llmModel as any,
      tts: ctx.proc.userData.ttsModel as any,
      vad: ctx.proc.userData.vad as silero.VAD,
      turnDetection: new livekit.turnDetector.MultilingualModel(),
    });

    // Track session lifecycle
    activeSessions++;
    totalConversations++;
    updateMetrics();

    try {
      // Start the session
      await session.start({
        agent,
        room: ctx.room,
      });

      agentLogger.info(`✅ Agent session started in room: ${ctx.room.name}`);

      // Generate initial greeting
      await session.generateReply({
        instructions: agent.getGreetingInstructions(),
      });

      agentLogger.info(`👋 Initial greeting sent for room: ${ctx.room.name}`);

    } catch (error) {
      agentLogger.error(`💥 Error in agent session for room ${ctx.room.name}:`, error);
      throw error;
    } finally {
      // Clean up session tracking
      activeSessions = Math.max(0, activeSessions - 1);
      updateMetrics();
      
      agentLogger.info(`🏁 Agent session ended for room: ${ctx.room.name}`);
    }
  },
});

// Run the agent if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const workerOptions = new WorkerOptions({
    agent: fileURLToPath(import.meta.url),
    wsURL: settings.livekit_url,
    apiKey: settings.livekit_api_key,
    apiSecret: settings.livekit_api_secret,
  });

  cli.runApp(workerOptions);
}
