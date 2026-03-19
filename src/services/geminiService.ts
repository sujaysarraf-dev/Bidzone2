/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { AuctionListing } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  /**
   * Get personalized auction recommendations based on user interests and history.
   */
  async getRecommendations(userInterests: string[], availableAuctions: AuctionListing[]) {
    const model = "gemini-3-flash-preview";
    const prompt = `
      Based on the user's interests: ${userInterests.join(", ")}, 
      recommend the top 3 most relevant auctions from the following list:
      ${JSON.stringify(availableAuctions.map(a => ({ id: a.id, title: a.title, type: a.assetType, description: a.description })))}
      
      Return the response as a JSON array of auction IDs.
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      return JSON.parse(response.text || "[]") as string[];
    } catch (error) {
      console.error("Error getting recommendations:", error);
      return [];
    }
  },

  /**
   * Chatbot to answer questions about auctions and the platform.
   */
  async chat(message: string, context?: string) {
    const model = "gemini-3-flash-preview";
    const systemInstruction = `
      You are the Bidzone Assistant. You help users navigate the intelligent financial asset auction platform.
      You can answer questions about specific auctions, bidding rules, and how to use the platform.
      Be professional, helpful, and concise.
      ${context ? `Context: ${context}` : ""}
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: message,
        config: {
          systemInstruction
        }
      });

      return response.text;
    } catch (error) {
      console.error("Error in chat:", error);
      return "I'm sorry, I'm having trouble responding right now. Please try again later.";
    }
  }
};
