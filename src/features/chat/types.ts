/**
 * Represents the role of a message sender in the chat
 */
export type Role = "user" | "assistant" | "typing";

/**
 * Represents a chat message with metadata
 */
export interface Message {
  /** Unique identifier for the message */
  id: string;
  /** The role of the message sender */
  role: Role;
  /** The text content of the message */
  content: string;
  /** When the message was created */
  timestamp: Date;
  /** Optional thinking content for assistant messages (used for streaming responses) */
  thinking?: string;
}

/**
 * Represents a line from the Ollama streaming API response
 * This type matches the structure returned by Ollama's streaming endpoint
 */
export interface OllamaStreamLine {
  /** Message object containing role and content information */
  message?: {
    role?: string;
    content?: string;
  };
  /** Direct response string (alternative to message object) */
  response?: string;
}


