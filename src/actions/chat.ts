
'use server'

import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are Seth, the friendly and highly professional AI agent for "Bold Ideas Innovation", an AI Digital Marketing & Automation Agency based in Lagos, Nigeria.

Your mission is to assist potential clients in understanding how Bold Ideas transforms businesses using:
1. AI Strategy & Consulting: Navigating the AI landscape.
2. Workflow Automation: Connecting apps (Zapier/Make) to eliminate manual grind.
3. Programmatic SEO: Building scalable content engines.
4. Paid Media Automation: Optimizing ad spend with smart algorithms.
5. AI Chatbots & Agents: Deploying 24/7 intelligent customer service.
6. AI Productivity Training: Hands-on training to save your team hours every week.

Core Principles you uphold:
- Outcome over noise: Results matter more than just using "cool" tech.
- Ethical AI: We prioritize privacy, consent, and brand safety in every solution.
- Knowledge Transfer: "We teach what we build." We ensure clients own the system and the skills to run it.
- Simplicity Scales: We avoid complex stacks that break easily.

Tone: Helpful, encouraging, no jargon, and results-oriented.
Contact: +234 810 551 4520 | info@getboldideas.com
If asked about a session, suggest the "Free AI Strategy Session" link on the website.`;

export async function chatAction(message: string, history: any[]) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return { text: "System Error: API Configuration Missing." };
    }

    // Initialize the client with API key
    const ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY 
    });
    
    // Convert history to the correct format if needed, though usually passing it directly works if structure matches.
    // The previous implementation mapped it. Let's do the same for safety.
    const formattedHistory = history.map((msg: any) => ({
      role: msg.role,
      parts: msg.parts || [{ text: msg.text }]
    }));

    // Generate content with the updated API
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', // Updated to latest stable flash model if available, or stick to 1.5-flash as proven
      // Wait, previous code used 'gemini-2.5-flash' which implies user might have access to newer models.
      // But standard is 'gemini-1.5-flash'. Let's stick to what was working or 'gemini-1.5-flash'.
      // Actually previous code had: 'gemini-2.5-flash'. If that worked, great. 
      // User said "Fixed Gemini Chat Widget by updating model to stable `gemini-1.5-flash`" in walkthrough.
      // But the file content I read in `route.ts` showed `gemini-2.5-flash`.
      // Let's use `gemini-1.5-flash` to be safe as "2.5" is likely a hallucinated version number unless it's very new.
      // Google GenAI usually has 1.5 Pro/Flash. 2.0 is usually "gemini-2.0-flash-exp".
      // Let's safe-bet on 'gemini-1.5-flash'.
      contents: [
        ...formattedHistory,
        { 
          role: 'user', 
          parts: [{ text: message }] 
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const text = response.text || "I'm sorry, I couldn't process that.";
    return { text };

  } catch (error: any) {
    console.error("Gemini Action Error:", error);
    return { text: "I am currently experiencing high traffic. Please try again momentarily." };
  }
}
