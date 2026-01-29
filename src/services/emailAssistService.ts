import { v4 as uuidv4 } from "uuid";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;
const USER_ID = import.meta.env.VITE_USER_ID;

interface SessionResponse {
  sessionId: string;
  success: boolean;
  error?: string;
}

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
      const sessionId = uuidv4();
      const sessionUrl = `${API_BASE_URL}/apps/email_assist_agent/users/${USER_ID}/sessions/${sessionId}`;

      const response = await fetch(sessionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Session creation failed: ${response.statusText}`);
      }

      const appRun = `${API_BASE_URL}/run`;

      const payload = {
        app_name: "email_assist_agent",
        user_id: USER_ID,
        session_id: sessionId,
        new_message: {
          role: "user",
          parts: [
            {
              text: email,
            },
          ],
        },
      };

      const apiResponse = await fetch(appRun, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  /**
   * Run analysis on the email with the given session ID
   */
  async runAnalysis(
    sessionId: string,
    emailContent: string,
  ): Promise<AnalysisResponse> {
    try {
      const analysisUrl = `${API_BASE_URL}/apps/email_assist_agent/users/${USER_ID}/sessions/${sessionId}/analyze`;

      const response = await fetch(analysisUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailContent,
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Error running analysis:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get session results
   */
  async getSessionResults(sessionId: string): Promise<AnalysisResponse> {
    try {
      const resultsUrl = `${API_BASE_URL}/apps/email_assist_agent/users/${USER_ID}/sessions/${sessionId}/results`;

      const response = await fetch(resultsUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch results: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Error fetching results:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export const emailAssistService = new EmailAssistService();
