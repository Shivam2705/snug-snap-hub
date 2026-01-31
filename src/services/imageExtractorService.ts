import { v4 as uuidv4 } from "uuid";

const API_BASE_URL = import.meta.env.VITE_NEXT_LENS_API_BASE_URL;
const USER_ID = import.meta.env.VITE_USER_ID;

interface Attributes {
  category: string;
  color: string;
  pattern: string;
  sleeve: string;
  style: string;
}

interface ApiRunResponse {
  attributes: Attributes;
}

interface ApiResponseData {
  [key: string]: any;
}

class ImageExtractorService {
  /**
   * Create a new session for image extractor analysis and get response
   */
//   async createSessionAndGetResponse(base64_string: string = ""): Promise<{success: boolean; data?: ApiRunResponse; error?: string}> {
//     try {
//       const sessionId = uuidv4();
//       const sessionUrl = `${API_BASE_URL}/apps/similar_prod_analyser/users/${USER_ID}/sessions/${sessionId}`;
//       const response = await fetch(sessionUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!response.ok) {
//         throw new Error(`Session creation failed: ${response.statusText}`);
//       }

//       const appRun = `${API_BASE_URL}/run`;

//       const payload = {
//         app_name: "product_attribute_extractor",
//         user_id: USER_ID,
//         session_id: sessionId,
//         new_message: {
//           role: "user",
//           parts: [
//             {
//               "inline_data": {
//                 "mime_type": "image/jpeg",
//                 "data": base64_string
//               }
//             }
//           ],
//         },
//       };

//       const apiResponse = await fetch(appRun, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!apiResponse.ok) {
//         throw new Error(`API run failed: ${apiResponse.statusText}`);
//       }

//       const data = await apiResponse.json();
//       return {
//         success: true,
//         data,
//       };
//     } catch (error) {
//       console.error("Error in session and API call:", error);
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : "Unknown error",
//       };
//     }
//   }

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
          const sessionUrl = `${baseUrl}/apps/product_attribute_extractor/users/${userId}/sessions/${sessionId}`;
          await fetch(sessionUrl, { method: 'POST' });
   
          // 3. Run the Analysis
          const runUrl = `${baseUrl}/run`;
          const payload = {
              app_name: "product_attribute_extractor",
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
        console.log('result', result[result.length - 1]['actions']['stateDelta'])
        return {success:true, data: result[result.length - 1]['actions']['stateDelta']};
   
      } catch (error) {
          console.error("Analysis failed:", error);
          throw error;
      }
    }
}

export const imageExtractorService = new ImageExtractorService();
