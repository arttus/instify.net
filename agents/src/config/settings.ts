/**
 * Configuration settings for ODEUO Voice AI agents
 * Migrated from Python Pydantic settings to TypeScript with Zod validation
 */

import { z } from 'zod';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { load as yamlLoad } from 'js-yaml';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: '.env.local' });
config();

// Zod schemas for validation
const AgentSettingsSchema = z.object({
  // LiveKit Configuration
  livekit_url: z.string().default('ws://livekit:7880'),
  livekit_api_key: z.string(),
  livekit_api_secret: z.string(),
  
  // Agent Configuration
  agent_mode: z.enum(['dev', 'console', 'production']).default('dev'),
  agent_log_level: z.string().default('INFO'),
  
  // AI Model Configuration
  stt_provider: z.string().default('openai'),
  stt_model: z.string().default('openai/whisper-1'),

  llm_provider: z.string().default('openai'),
  llm_model: z.string().default('openai/gpt-4.1-mini'),
  
  tts_provider: z.string().default('cartesia'),
  tts_model: z.string().default('cartesia/sonic-2:9626c31c-bec5-4cca-baa8-f8ba9e84c8bc'),
  
  // API Keys
  openai_api_key: z.string().optional(),
  google_api_key: z.string().optional(),
  cartesia_api_key: z.string().optional(),
  deepgram_api_key: z.string().optional(),
  elevenlabs_api_key: z.string().optional(),
  
  // Agent Behavior
  default_language: z.string().default('en'),
  max_conversation_duration: z.number().default(1800), // 30 minutes
  enable_interruptions: z.boolean().default(true),
  conversation_timeout: z.number().default(300), // 5 minutes
  
  // Health Server
  health_server_port: z.number().default(8001),
  health_server_host: z.string().default('0.0.0.0'),
  
  // Development
  hot_reload: z.boolean().default(false),
  debug_enabled: z.boolean().default(false),
});

export type AgentSettings = z.infer<typeof AgentSettingsSchema>;

// Load YAML configuration
let yamlConfig: any = {};
try {
  const yamlPath = path.join(__dirname, '../../config/agent.yaml');
  const yamlContent = readFileSync(yamlPath, 'utf8');
  yamlConfig = yamlLoad(yamlContent) as any;
} catch (error) {
  console.warn('Could not load agent.yaml configuration:', error);
}

// Create settings with environment variables and YAML config
function createSettings(): AgentSettings {
  const envSettings = {
    livekit_url: process.env.LIVEKIT_URL,
    livekit_api_key: process.env.LIVEKIT_API_KEY,
    livekit_api_secret: process.env.LIVEKIT_API_SECRET,
    
    agent_mode: process.env.AGENT_MODE,
    agent_log_level: process.env.AGENT_LOG_LEVEL,
    
    stt_provider: process.env.STT_PROVIDER,
    stt_model: process.env.STT_MODEL,
    
    llm_provider: process.env.LLM_PROVIDER,
    llm_model: process.env.LLM_MODEL,
    
    tts_provider: process.env.TTS_PROVIDER,
    tts_model: process.env.TTS_MODEL,
    
    openai_api_key: process.env.OPENAI_API_KEY,
    google_api_key: process.env.GOOGLE_API_KEY,
    cartesia_api_key: process.env.CARTESIA_API_KEY,
    deepgram_api_key: process.env.DEEPGRAM_API_KEY,
    elevenlabs_api_key: process.env.ELEVENLABS_API_KEY,
    
    default_language: process.env.DEFAULT_LANGUAGE,
    max_conversation_duration: process.env.MAX_CONVERSATION_DURATION ? 
      parseInt(process.env.MAX_CONVERSATION_DURATION) : undefined,
    enable_interruptions: process.env.ENABLE_INTERRUPTIONS === 'true',
    conversation_timeout: process.env.CONVERSATION_TIMEOUT ? 
      parseInt(process.env.CONVERSATION_TIMEOUT) : undefined,
    
    health_server_port: process.env.HEALTH_SERVER_PORT ? 
      parseInt(process.env.HEALTH_SERVER_PORT) : undefined,
    health_server_host: process.env.HEALTH_SERVER_HOST,
    
    hot_reload: process.env.HOT_RELOAD === 'true',
    debug_enabled: process.env.DEBUG_ENABLED === 'true',
  };

  // Merge YAML config with environment variables (env takes precedence)
  const mergedConfig = {
    ...yamlConfig,
    ...Object.fromEntries(
      Object.entries(envSettings).filter(([_, value]) => value !== undefined)
    ),
  };

  return AgentSettingsSchema.parse(mergedConfig);
}

export const settings = createSettings();

// Export YAML config for access to detailed configuration
export { yamlConfig as agentConfig };
