import { getOllamaApiUrl } from "./provider";

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export type StreamOptions = {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
};

export function streamChat(opts: StreamOptions) {
  return fetch(getOllamaApiUrl("/chat"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...opts, stream: true }),
  });
}

export async function listModels(): Promise<{ models: { name: string }[] }> {
  const res = await fetch(getOllamaApiUrl("/tags"));
  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  return res.json();
}


