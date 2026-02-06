// Knowledge Assist Agent Service
// Service for interacting with the Knowledge Assist Agent API

const BASE_URL = import.meta.env.VITE_KNOWLEDGE_ASSIST_BASE_URL || "https://2tvyko1og8.execute-api.us-east-1.amazonaws.com";

// Helper for non-blocking delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface QueryResponse {
  answer: string;
  sources?: string[];
  history?: any[];
  model: string;
  references?: Record<string, string>;
}

export interface UploadResponse {
  file_id: string;
  filename: string;
  status: string;
}

export interface ResetChatResponse {
  status: string;
  message: string;
}

/**
 * Query the Knowledge Assist Agent
 * @param query - The question or query to ask
 * @param userToken - User identifier token
 * @param options - Optional parameters
 */
export async function queryKnowledgeAssistant(
  query: string,
  userToken: string,
  options: {
    stream?: boolean;
    history?: boolean;
    model?: "openai" | "groq";
    fileId?: string;
    agents?: string[];
    onChunk?: (chunk: string) => void;
  } = {}
): Promise<QueryResponse> {
  const {
    stream = false,
    history = true,
    model = "groq",
    fileId,
    agents = [],
    onChunk
  } = options;

  try {
    const params = new URLSearchParams({
      query,
      user_token: userToken,
      stream: stream.toString(),
      history: history.toString(),
      model
    });

    if (fileId) {
      params.append("file_id", fileId);
    }

    // Add agents to the query parameters
    if (agents && agents.length > 0) {
      agents.forEach(agent => {
        params.append("agents", agent);
      });
    }

    const response = await fetch(`${BASE_URL}/query?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Query failed with status ${response.status}`);
    }

    // Handle streaming responses
    if (stream && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullAnswer = "";
      let references: Record<string, string> = {};
      let model_name = "";
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          
          // Keep the last incomplete line in the buffer
          buffer = lines[lines.length - 1];

          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            try {
              // Handle both SSE format (data: {...}) and raw JSON format ({...})
              let jsonData;
              if (line.startsWith("data: ")) {
                jsonData = JSON.parse(line.slice(6));
              } else {
                jsonData = JSON.parse(line);
              }
              
              // The body is the FULL incremental text, not a delta
              // Pass the full body as-is to the callback
              if (jsonData.body) {
                fullAnswer = jsonData.body; // Replace, don't concatenate
                onChunk?.(jsonData.body);
              }
              if (jsonData.references) {
                references = jsonData.references;
              }
              if (jsonData.model) {
                model_name = jsonData.model;
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
        
        // Process any remaining data in buffer
        if (buffer.trim()) {
          try {
            let jsonData;
            if (buffer.startsWith("data: ")) {
              jsonData = JSON.parse(buffer.slice(6));
            } else {
              jsonData = JSON.parse(buffer);
            }
            
            if (jsonData.body) {
              fullAnswer = jsonData.body; // Replace, don't concatenate
              onChunk?.(jsonData.body);
            }
            if (jsonData.references) {
              references = jsonData.references;
            }
            if (jsonData.model) {
              model_name = jsonData.model;
            }
          } catch (e) {
            // Ignore final buffer parse errors
          }
        }
      } finally {
        reader.releaseLock();
      }

      return {
        answer: fullAnswer,
        model: model_name || "",
        references,
        sources: [],
        history: []
      } as QueryResponse;
    }

    // Handle non-streaming responses
    const data = await response.json();
    
    // Map 'body' field to 'answer' for compatibility with different backend formats
    return {
      answer: data.body || data.answer || "",
      model: data.model || "",
      references: data.references,
      sources: data.sources,
      history: data.history,
    } as QueryResponse;
  } catch (error) {
    console.error("Knowledge Assist Query Error:", error);
    throw error;
  }
}

/**
 * Upload a document to the Knowledge Assist Agent
 * @param file - The file to upload
 * @param userToken - User identifier token
 */
export async function uploadDocumentToKnowledgeAssistant(
  file: File,
  userToken: string
): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_token", userToken);

    const response = await fetch(`${BASE_URL}/upload`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    return data as UploadResponse;
  } catch (error) {
    console.error("Knowledge Assist Upload Error:", error);
    throw error;
  }
}

/**
 * Reset the chat history for a user
 * @param userToken - User identifier token
 * @param fileId - Optional file ID to clear chat for a specific document
 */
export async function resetKnowledgeAssistantChat(
  userToken: string,
  fileId?: string
): Promise<ResetChatResponse> {
  try {
    const params = new URLSearchParams({
      user_token: userToken
    });

    if (fileId) {
      params.append("file_id", fileId);
    }

    const response = await fetch(`${BASE_URL}/reset_chat?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Reset chat failed with status ${response.status}`);
    }

    const data = await response.json();
    return data as ResetChatResponse;
  } catch (error) {
    console.error("Knowledge Assist Reset Chat Error:", error);
    throw error;
  }
}

/**
 * Generate a unique user token (can be UUID or custom identifier)
 */
export function generateUserToken(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
