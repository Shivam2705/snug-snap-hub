import { v4 as uuidv4 } from "uuid";

const API_BASE_URL = import.meta.env.VITE_NEXT_LENS_API_BASE_URL;
const USER_ID = import.meta.env.VITE_USER_ID;

interface Product {
  id: string;
  name: string;
  category: string;
  color: string;
  price: number;
}

interface ApiRunResponse {
  final_styled_response?: {
    products: Product[];
    message: string;
  };
  intent_classification?: string;
  intent_score?: number;
  intent_reason?: string;
  vul_classification?: string;
  vul_score?: number;
  vul_reason?: string;
}

// Type for API response data when products array is returned directly
type ApiResponseData = Product[];

const mockProductsResponse: ApiRunResponse = {
  final_styled_response: {
    products: [
      {
        id: "B1",
        name: "Classic Navy Wool Blazer",
        category: "Blazer",
        color: "Blue",
        price: 145.0
      },
      {
        id: "B2",
        name: "Midnight Blue Double-Breasted",
        category: "Blazer",
        color: "Blue",
        price: 160.0
      },
      {
        id: "B3",
        name: "Navy Pinstripe Blazer",
        category: "Blazer",
        color: "Blue",
        price: 150.0
      },
      {
        id: "B4",
        name: "Navy Slim Fit Blazer",
        category: "Blazer",
        color: "Blue",
        price: 130.0
      },
      {
        id: "B5",
        name: "Navy Wool Blend Blazer",
        category: "Blazer",
        color: "Blue",
        price: 155.0
      },
      {
        id: "B6",
        name: "Navy Casual Blazer",
        category: "Blazer",
        color: "Blue",
        price: 125.0
      }
    ],
    message: "Here are some sophisticated blue blazers that might catch your eye!"
  }
};

class NextLensService {
  /**
   * Create a new session for product recommendation analysis and get response
   */
  async createSessionAndGetResponse(imageFile: File): Promise<{ success: boolean; data?: ApiResponseData; error?: string }> {
    const userId = "u_123";
    const sessionId = uuidv4(); // Generates a unique session ID
    const baseUrl = "https://next-lens-attribute-agent-1037311574972.us-central1.run.app";
 
    try {
        // 1. Convert Image to Base64
        const base64String = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = () => resolve((reader.result as string).split(',')[1]); // Strip data:image/jpeg;base64,
            reader.onerror = error => reject(error);
        });
 
        // 2. Initialize the Session
        const sessionUrl = `${baseUrl}/apps/similar_prod_analyser/users/${userId}/sessions/${sessionId}`;
        await fetch(sessionUrl, { method: 'POST' });
 
        // 3. Run the Analysis
        const runUrl = `${baseUrl}/run`;
        const payload = {
            app_name: "similar_prod_analyser",
            user_id: userId,
            session_id: sessionId,
            new_message: {
                parts: [{
                    inline_data: {
                        mime_type: imageFile.type || "image/jpeg",
                        data: base64String
                    }
                }]
            }
        };
 
        const response = await fetch(runUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result =  await response.json();
        console.log('result', result[result.length - 1]['actions']['stateDelta']['final_styled_response']["products"])
        return {success:true, data: result[result.length - 1]['actions']['stateDelta']['final_styled_response']["products"]};
 
    } catch (error) {
        console.error("Analysis failed:", error);
        throw error;
    }
  }
}

export const nextLensService = new NextLensService();
