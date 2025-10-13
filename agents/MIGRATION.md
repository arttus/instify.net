# Migration from Python to JavaScript/TypeScript

This document outlines the migration of the Instify Voice AI Agent from Python to JavaScript/TypeScript using the LiveKit Agents JS framework.

## 🔄 Migration Overview

### What Changed
- **Runtime**: Python 3.11 → Node.js 20
- **Language**: Python → TypeScript
- **Framework**: LiveKit Agents Python → LiveKit Agents JS
- **Package Manager**: pip/uv → pnpm
- **Build System**: None → tsup (TypeScript bundler)
- **Testing**: pytest → vitest
- **Linting**: flake8/black → ESLint + TypeScript
- **Configuration**: Pydantic → Zod validation
- **Web Framework**: FastAPI → Express.js
- **Logging**: structlog → Winston

### What Stayed the Same
- **Agent Configuration**: `config/agent.yaml` structure preserved
- **Environment Variables**: All environment variable names maintained
- **Docker Structure**: Similar multi-stage builds and health checks
- **Health Endpoints**: Same API endpoints (`/health`, `/metrics`, `/status`)
- **Agent Behavior**: All business logic and conversation flow preserved
- **LiveKit Integration**: Same LiveKit server compatibility

## 📁 File Mapping

| Python File | TypeScript File | Notes |
|-------------|-----------------|-------|
| `src/main.py` | `src/main.ts` | Main entry point with agent definition |
| `src/agents/instify_agent.py` | `src/agents/instify-agent.ts` | Core agent logic |
| `src/config/settings.py` | `src/config/settings.ts` | Configuration with Zod validation |
| `src/utils/logging_config.py` | `src/utils/logger.ts` | Winston-based logging |
| `src/utils/health_server.py` | `src/utils/health-server.ts` | Express.js health server |
| `requirements.txt` | `package.json` | Dependencies |
| N/A | `src/types/agent.ts` | TypeScript type definitions |

## 🔧 Key Technical Changes

### 1. Agent Definition
**Python (Before):**
```python
class InstifyAgentRunner:
    async def entrypoint(self, ctx: agents.JobContext):
        session = AgentSession(...)
        agent = InstifyVoiceAgent(...)
        await session.start(room=ctx.room, agent=agent)
```

**TypeScript (After):**
```typescript
export default defineAgent({
  prewarm: async (proc: JobProcess) => {
    proc.userData.vad = await silero.VAD.load();
  },
  entry: async (ctx: JobContext) => {
    const agent = new InstifyVoiceAgent(ctx.room.name);
    const session = new voice.AgentSession({...});
    await session.start({ agent, room: ctx.room });
  },
});
```

### 2. Configuration Management
**Python (Before):**
```python
class AgentSettings(BaseSettings):
    livekit_url: str = Field(env="LIVEKIT_URL")
    llm_model: str = Field(env="LLM_MODEL")
```

**TypeScript (After):**
```typescript
const AgentSettingsSchema = z.object({
  livekit_url: z.string().default('ws://livekit:7880'),
  llm_model: z.string().default('openai/gpt-4.1-mini'),
});
```

### 3. Health Server
**Python (Before):**
```python
app = FastAPI()

@app.get("/health")
async def health_check():
    return JSONResponse(content=health_status)
```

**TypeScript (After):**
```typescript
const app = express();

app.get('/health', async (req, res) => {
  res.status(200).json(healthStatus);
});
```

## 🚀 Running the Migrated Agent

### Development
```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Or with Docker
docker build -f Dockerfile.dev -t instify-agents:dev .
docker run instify-agents:dev
```

### Production
```bash
# Build the application
pnpm build

# Run in production mode
pnpm start

# Or with Docker
docker build -f Dockerfile.prod -t instify-agents:prod .
docker run instify-agents:prod
```

### Testing
```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Lint code
pnpm lint
```

## 🔍 Validation Checklist

- [ ] All environment variables work correctly
- [ ] Agent connects to LiveKit server successfully
- [ ] Voice conversation flow works as expected
- [ ] Customer context handling preserved
- [ ] Escalation logic functions correctly
- [ ] Health endpoints return expected data
- [ ] Metrics collection works
- [ ] Logging outputs structured data
- [ ] Docker builds complete successfully
- [ ] All tests pass

## 🐛 Known Issues & Considerations

1. **Memory Usage**: Node.js single-threaded nature may have different memory patterns than Python
2. **Audio Processing**: Ensure all audio processing libraries work correctly in Node.js environment
3. **Error Handling**: JavaScript error handling patterns differ from Python exceptions
4. **Async Patterns**: While similar, subtle differences in async/await behavior may exist

## 📚 Additional Resources

- [LiveKit Agents JS Documentation](https://docs.livekit.io/agents/)
- [LiveKit Agents JS GitHub](https://github.com/livekit/agents-js)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Winston Logging](https://github.com/winstonjs/winston)
- [Express.js Documentation](https://expressjs.com/)

## 🎯 Next Steps

1. **Test thoroughly** with real LiveKit server and voice calls
2. **Monitor performance** compared to Python implementation
3. **Update deployment scripts** and CI/CD pipelines
4. **Train team** on TypeScript/Node.js development patterns
5. **Consider gradual rollout** with feature flags
