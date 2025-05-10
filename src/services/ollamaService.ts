/* eslint-disable @typescript-eslint/no-explicit-any */

import { toast } from "sonner";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

// Default Ollama API endpoint (assumes Ollama is running locally)
const OLLAMA_API_URL = "http://localhost:11434";

export const getModels = async (): Promise<{id: string, name: string}[]> => {
  return [];
};

export const sendMessage = async (
  message: string, 
  model: string,
  previousMessages: ChatMessage[]
): Promise<string> => {
  return "";
};
