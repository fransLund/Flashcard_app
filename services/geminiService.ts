
import { GoogleGenAI, Type } from "@google/genai";
import { Flashcard } from "../types";

export const translateGlosses = async (
  glosses: string,
  targetLanguage: string
): Promise<Flashcard[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Translate the following list of terms/glosses into ${targetLanguage}. 
    Provide a clear definition and optionally a short context sentence for each.
    Glosses:
    ${glosses}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          flashcards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING, description: "The original term" },
                definition: { type: Type.STRING, description: "The translated definition or equivalent term" },
                context: { type: Type.STRING, description: "Optional usage example" }
              },
              required: ["term", "definition"]
            }
          }
        },
        required: ["flashcards"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{"flashcards": []}');
    return data.flashcards.map((card: any, index: number) => ({
      ...card,
      id: `card-${Date.now()}-${index}`
    }));
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return [];
  }
};
