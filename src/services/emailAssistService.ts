import { v4 as uuidv4 } from "uuid";

const API_BASE_URL = `https://next-email-assist-caller-1037311574972.us-central1.run.app`
const USER_ID = import.meta.env.VITE_USER_ID;

interface AnalysisResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface ApiRunResponse {
  intent_classification: string;
  intent_score: number;
  intent_reason: string;
  vul_classification: string;
  vul_score: number;
  vul_reason: string;
}

class EmailAssistService {
  /**
   * Create a new session for email analysis and get response
   */
  async createSessionAndGetResponse(email: string = ""): Promise<{success: boolean; data?: ApiRunResponse; error?: string}> {
    try {

      const appRun = `${API_BASE_URL}/process-email`;

      const apiResponse = await fetch(appRun, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email:email}),
      });

      if (!apiResponse.ok) {
        throw new Error(`API run failed: ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Error in session and API call:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export const emailAssistService = new EmailAssistService();
