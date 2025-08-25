export type Role = "user" | "assistant" | "typing";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  thinking?: string;
}

export type OllamaStreamLine = {
  message?: { role?: string; content?: string };
  response?: string;
};


