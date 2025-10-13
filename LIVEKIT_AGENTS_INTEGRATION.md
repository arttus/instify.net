# LiveKit Agents Voice AI Integration - Complete Setup

## 🎯 Integration Summary

**✅ COMPLETED**: LiveKit Agents with Voice AI capabilities have been successfully integrated into the Instify Docker development environment.

## 📋 What Was Implemented

### 1. Docker Compose Configuration
- **File**: `docker-compose.dev.yml`
- **Service**: `livekit-agents`
- **Features**:
  - Full LiveKit Agents service configuration
  - Environment variables for all AI service providers
  - Volume mounts for hot reload and persistent data
  - Health checks and monitoring
  - Port exposure (8000 for API, 8001 for health/metrics)

### 2. Agent Application Structure
```
agents/
├── src/
│   ├── main.py                 # Main agent entry point
│   ├── config/
│   │   └── settings.py         # Pydantic configuration management
│   ├── agents/
│   │   └── instify_agent.py    # Instify-specific agent logic
│   └── utils/
│       ├── logging_config.py   # Structured logging setup
│       └── health_server.py    # FastAPI health check server
├── config/
│   └── agent.yaml             # Agent behavior configuration
├── Dockerfile.dev             # Development Docker image
├── start.sh                   # Startup script with dependency checks
├── requirements.txt           # Python dependencies
├── requirements-dev.txt       # Development dependencies
└── README.md                  # Comprehensive documentation
```

### 3. Voice AI Pipeline Components

#### Speech-to-Text (STT)
- **AssemblyAI**: Universal streaming transcription (default)
- **OpenAI Whisper**: Robust multilingual support
- **Deepgram**: Low-latency real-time transcription

#### Large Language Models (LLM)
- **OpenAI GPT-4.1 mini**: Advanced reasoning and conversation (default)
- **Anthropic Claude**: Helpful, harmless, and honest responses

#### Text-to-Speech (TTS)
- **Cartesia Sonic-2**: Ultra-low latency voice synthesis (default)
- **OpenAI TTS**: Natural-sounding voices
- **ElevenLabs**: Premium voice cloning and emotions

### 4. Environment Variables Added

#### Core LiveKit Configuration
```bash
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_URL=ws://livekit:7880
```

#### AI Service Providers
```bash
# Required (at least one)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional Advanced Services
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
CARTESIA_API_KEY=your_cartesia_api_key
DEEPGRAM_API_KEY=your_deepgram_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### 5. LiveKit Server Configuration
- **File**: `config/livekit-dev.yaml`
- **Updates**: Added webhook endpoint for agent integration
- **Agent Support**: Enabled automatic agent dispatch and room assignment

### 6. Monitoring & Health Checks
- **Health Endpoint**: `http://localhost:8001/health`
- **Detailed Metrics**: `http://localhost:8001/health/detailed`
- **Prometheus Metrics**: `http://localhost:8001/metrics`
- **Agent Management API**: `http://localhost:8000`

## 🚀 How to Use

### 1. Set Up Environment Variables
Copy the required API keys to your `.env` file:

```bash
# Copy from .env.example
cp .env.example .env

# Edit with your API keys
nano .env
```

### 2. Start the Development Environment
```bash
# Start all services including LiveKit Agents
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# View agent logs
docker-compose -f docker-compose.dev.yml logs -f livekit-agents
```

### 3. Test Voice AI
1. **Open Demo**: Visit `http://localhost:3000/livekit-demo`
2. **Join Room**: Click "Connect to Room"
3. **Enable Microphone**: Allow microphone access
4. **Start Talking**: The AI agent will respond with voice

### 4. Monitor Agent Health
```bash
# Basic health check
curl http://localhost:8001/health

# Detailed system metrics
curl http://localhost:8001/health/detailed

# Prometheus metrics
curl http://localhost:8001/metrics
```

## 🔧 Configuration Options

### Agent Behavior
Edit `agents/config/agent.yaml`:
```yaml
agent:
  conversation:
    max_duration_seconds: 1800  # 30 minutes
    timeout_seconds: 300        # 5 minutes inactivity
    enable_interruptions: true
    default_language: "en"
```

### AI Model Selection
Use environment variables to override defaults:
```bash
STT_PROVIDER=assemblyai    # or openai, deepgram
LLM_PROVIDER=openai       # or anthropic
TTS_PROVIDER=cartesia     # or openai, elevenlabs
```

## 🎤 Voice AI Features

### Real-time Conversation
- **Voice Activity Detection**: Silero VAD for accurate speech detection
- **Turn Detection**: Multilingual model for natural conversation flow
- **Noise Cancellation**: BVC (Background Voice Cancellation) plugin
- **Interruption Handling**: Users can interrupt the agent naturally

### Customer Context Awareness
- **Platform Integration**: Receives customer data from Instify platform
- **Conversation History**: Maintains context across interactions
- **Escalation Logic**: Automatically escalates complex issues to humans
- **Analytics Tracking**: Logs conversation metrics and performance

### Multi-language Support
- **STT**: Supports 50+ languages with AssemblyAI and Deepgram
- **LLM**: GPT-4 and Claude support multiple languages
- **TTS**: Cartesia and ElevenLabs offer multilingual voices

## 🛠️ Development Features

### Hot Reload
```bash
# Enable hot reload
export HOT_RELOAD=true
docker-compose -f docker-compose.dev.yml restart livekit-agents
```

### Debug Mode
```bash
# Enable debug logging
export AGENT_LOG_LEVEL=DEBUG
export DEBUG_MODE=true
docker-compose -f docker-compose.dev.yml restart livekit-agents
```

### Local Development
```bash
# Run agent outside Docker (for development)
cd agents
pip install -r requirements.txt -r requirements-dev.txt
python src/main.py dev
```

## 📊 Integration Points

### LiveKit Server
- **Webhook Integration**: Agent events sent to LiveKit server
- **Room Management**: Automatic agent assignment to rooms
- **Recording Support**: Optional conversation recording

### Instify Platform
- **Customer Context**: Receives customer data via API
- **Webhook Events**: Sends conversation events to platform
- **Analytics Integration**: Conversation metrics and insights

### Docker Network
- **Service Discovery**: Agents communicate with LiveKit via Docker network
- **Health Monitoring**: Integrated with Docker Compose health checks
- **Log Aggregation**: Centralized logging with structured JSON format

## ✅ Verification Checklist

- [x] Docker Compose service configured
- [x] Agent application code implemented
- [x] Environment variables documented
- [x] Health checks and monitoring setup
- [x] Voice AI pipeline configured
- [x] LiveKit server integration
- [x] Documentation completed
- [x] Docker build successful
- [x] Ready for testing

## 🎉 Next Steps

1. **Add API Keys**: Configure your AI service API keys in `.env`
2. **Start Services**: Launch the complete development environment
3. **Test Voice AI**: Try the voice conversation features
4. **Customize Agent**: Modify agent behavior and responses
5. **Monitor Performance**: Use health endpoints to track metrics
6. **Scale Up**: Add more agent instances as needed

The LiveKit Agents Voice AI integration is now **complete and ready for use**! 🚀
