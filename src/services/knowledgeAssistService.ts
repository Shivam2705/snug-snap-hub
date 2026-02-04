// Knowledge Assist Agent Service
// Service for interacting with the Knowledge Assist Agent API

const BASE_URL = import.meta.env.VITE_KNOWLEDGE_ASSIST_BASE_URL || "https://2tvyko1og8.execute-api.us-east-1.amazonaws.com/";

export interface QueryResponse {
  answer: string;
  sources?: string[];
  history?: any[];
  model: string;
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
  } = {}
): Promise<QueryResponse> {
  const {
    stream = false,
    history = true,
    model = "groq",
    fileId
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

    const response = await fetch(`${BASE_URL}/query?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Query failed with status ${response.status}`);
    }

    const data = await response.json();
    return data as QueryResponse;
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
