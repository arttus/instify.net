# 🎙️ ODEUO Voice AI Agents

AI-powered voice assistant for customer engagement automation using the LiveKit Agents JS framework.

## 🎯 Overview

This directory contains the LiveKit Agents JS implementation for ODEUO's Voice AI capabilities. The agents provide:

- **Real-time voice conversations** with customers
- **Multi-language support** for global customer engagement
- **Customer context awareness** from the ODEUO platform
- **Intelligent escalation** to human agents when needed
- **Comprehensive analytics** and conversation tracking

## 🏗️ Architecture

```
agents/
├── src/
│   ├── main.ts                 # Main agent entry point (TypeScript)
│   ├── config/
│   │   └── settings.ts         # Configuration management with Zod validation
│   ├── agents/
│   │   └── odeuo-agent.ts    # ODEUO-specific agent logic
│   ├── utils/
│   │   ├── logger.ts           # Winston-based logging setup
│   │   └── health-server.ts    # Express.js health check server
│   └── types/
│       └── agent.ts            # TypeScript type definitions
├── config/
│   └── agent.yaml             # Agent configuration
├── dist/                      # Built JavaScript output
├── Dockerfile.dev             # Development Docker image
├── Dockerfile.prod            # Production Docker image
├── package.json               # Node.js dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── tsup.config.ts             # Build configuration
└── vitest.config.ts           # Test configuration
```

## 🚀 Quick Start

### 1. Environment Setup

Install Node.js dependencies:

```bash
pnpm install
```

Ensure your `.env` file contains the required API keys:

```bash
# LiveKit Configuration
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_URL=ws://livekit:7880

# AI Service Providers (at least one required)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional Advanced Services
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
CARTESIA_API_KEY=your_cartesia_api_key
DEEPGRAM_API_KEY=your_deepgram_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### 2. Start the Development Environment

```bash
# Start all services including LiveKit Agents
docker-compose -f docker-compose.dev.yml up -d

# View agent logs
docker-compose -f docker-compose.dev.yml logs -f livekit-agents

# Check agent health
curl http://localhost:8001/health
```

### 3. Test Voice AI

1. **Open the LiveKit Demo**: Visit `http://localhost:3000/livekit-demo`
2. **Join a Room**: Click "Connect to Room"
3. **Start Voice Chat**: Enable microphone and start talking
4. **AI Response**: The agent will respond with voice

## 🔧 Configuration

### Agent Behavior

Edit `config/agent.yaml` to customize:

```yaml
agent:
  conversation:
    max_duration_seconds: 1800  # 30 minutes
    timeout_seconds: 300        # 5 minutes inactivity
    enable_interruptions: true
    default_language: "en"
```

### AI Models

Configure different AI service providers:

```yaml
models:
  stt:
    default_provider: "assemblyai"  # or "openai", "deepgram"
  llm:
    default_provider: "openai"      # or "anthropic"
  tts:
    default_provider: "cartesia"    # or "openai", "elevenlabs"
```

### Environment Variables

Override configuration with environment variables:

```bash
# Model selection
STT_PROVIDER=assemblyai
LLM_PROVIDER=openai
TTS_PROVIDER=cartesia

# Agent behavior
AGENT_MODE=dev
AGENT_LOG_LEVEL=debug
MAX_CONVERSATION_DURATION=1800
```

## 🎤 Voice AI Features

### Speech-to-Text (STT)
- **AssemblyAI**: High-accuracy streaming transcription
- **OpenAI Whisper**: Robust multilingual support
- **Deepgram**: Low-latency real-time transcription

### Large Language Models (LLM)
- **OpenAI GPT-4**: Advanced reasoning and conversation
- **Anthropic Claude**: Helpful, harmless, and honest responses

### Text-to-Speech (TTS)
- **Cartesia**: Ultra-low latency voice synthesis
- **OpenAI TTS**: Natural-sounding voices
- **ElevenLabs**: Premium voice cloning and emotions

## 📊 Monitoring & Analytics

### Health Checks

```bash
# Basic health check
curl http://localhost:8001/health

# Detailed system metrics
curl http://localhost:8001/health/detailed

# Prometheus metrics
curl http://localhost:8001/metrics
```

### Logging

Logs are available in multiple formats:

```bash
# View live logs
docker-compose -f docker-compose.dev.yml logs -f livekit-agents

# Access log files
ls -la logs/agents/

# Structured JSON logs for analysis
tail -f logs/agents/agent.log | jq .
```

### Conversation Analytics

The agent automatically tracks:
- Conversation duration and quality
- Customer sentiment analysis
- Escalation triggers and patterns
- Performance metrics (latency, accuracy)

## 🔌 Integration with ODEUO Platform

### Customer Context

The agent receives customer context from the ODEUO platform:

```python
customer_context = {
    "company_name": "Acme Corp",
    "industry": "E-commerce",
    "current_plan": "Professional",
    "integration_channels": ["instagram", "sms", "whatsapp"],
    "previous_interactions": 5
}
```

### Webhook Integration

LiveKit events are sent to the ODEUO platform:

```bash
# Webhook endpoint
POST http://odeuo-web:3000/api/webhooks/livekit

# Event types
- room_started
- participant_joined
- participant_left
- recording_started
- recording_finished
```

## 🛠️ Development

### Local Development

```bash
# Install dependencies
cd agents
pip install -r requirements.txt -r requirements-dev.txt

# Run agent locally (outside Docker)
python src/main.py dev

# Run with hot reload
WATCHDOG_ENABLED=true python src/main.py dev
```

### Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=src

# Load testing
locust -f tests/load_test.py
```

### Code Quality

```bash
# Format code
black src/
isort src/

# Lint code
flake8 src/
mypy src/

# Security scan
bandit -r src/
```

## 🚨 Troubleshooting

### Common Issues

1. **Agent not connecting to LiveKit**
   ```bash
   # Check LiveKit server status
   curl http://localhost:7880/health
   
   # Verify API keys
   echo $LIVEKIT_API_KEY
   ```

2. **AI services not responding**
   ```bash
   # Test OpenAI connection
   curl -H "Authorization: Bearer $OPENAI_API_KEY" \
        https://api.openai.com/v1/models
   ```

3. **Audio issues**
   ```bash
   # Check audio dependencies
   docker-compose exec livekit-agents python -c "import pyaudio; print('Audio OK')"
   ```

### Debug Mode

Enable verbose logging:

```bash
# Set debug environment
export AGENT_LOG_LEVEL=DEBUG
export DEBUG_MODE=true

# Restart with debug logging
docker-compose -f docker-compose.dev.yml restart livekit-agents
```

## 🎉 Integration Complete!

✅ **LiveKit Agents with Voice AI capabilities have been successfully integrated into the ODEUO Docker development environment!**

### What's Been Implemented:

1. **✅ LiveKit Agents Service**: Fully configured Docker service with proper networking
2. **✅ Voice AI Pipeline**: STT → LLM → TTS pipeline with multiple provider options
3. **✅ Environment Variables**: Comprehensive configuration for all AI services
4. **✅ Health Monitoring**: Built-in health checks and metrics endpoints
5. **✅ Development Tools**: Hot reload, debugging, and logging capabilities
6. **✅ Documentation**: Complete setup and usage documentation

### Next Steps:

1. **Set up API Keys**: Add your AI service API keys to `.env` file
2. **Start Services**: Run `docker-compose -f docker-compose.dev.yml up -d`
3. **Test Voice AI**: Visit the LiveKit demo page and start a voice conversation
4. **Monitor Health**: Check agent status at `http://localhost:8001/health`

## 📚 Resources

- [LiveKit Agents Documentation](https://docs.livekit.io/agents/)
- [Voice AI Quickstart](https://docs.livekit.io/agents/start/voice-ai/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [AssemblyAI Documentation](https://www.assemblyai.com/docs/)
- [Cartesia API Docs](https://docs.cartesia.ai/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is part of the ODEUO platform and follows the same licensing terms.
