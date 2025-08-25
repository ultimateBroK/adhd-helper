// Centralized Ollama provider configuration
// Uses env when available and falls back to localhost

const base = process.env.NEXT_PUBLIC_OLLAMA_BASE_URL || process.env.OLLAMA_BASE_URL || "http://localhost:11434";

export const OLLAMA_API_URL = `${base}/api`;

export function getOllamaApiUrl(path: string): string {
  if (!path.startsWith("/")) return `${OLLAMA_API_URL}/${path}`;
  return `${OLLAMA_API_URL}${path}`;
}

// Optional: prepare provider instance for future AI SDK integration
// import { createOllama } from 'ollama-ai-provider';
// export const ollama = createOllama({ baseURL: OLLAMA_API_URL });


