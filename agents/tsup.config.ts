import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  treeshake: true,
  dts: true,
  external: [
    '@livekit/agents',
    '@livekit/agents-plugin-openai',
    '@livekit/agents-plugin-google',
    '@livekit/agents-plugin-cartesia',
    '@livekit/agents-plugin-deepgram',
    '@livekit/agents-plugin-elevenlabs',
    '@livekit/agents-plugin-silero',
    '@livekit/agents-plugin-livekit'
  ],
  esbuildOptions(options) {
    options.banner = {
      js: '#!/usr/bin/env node'
    };
  },
  onSuccess: 'chmod +x dist/main.js'
});
