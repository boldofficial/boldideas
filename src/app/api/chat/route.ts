import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';

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

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not set" }, { status: 500 });
    }

    // Initialize the client with API key
    const ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY 
    });
    
    // Convert history to the correct format
    const formattedHistory = history.map((msg: any) => ({
      role: msg.role,
      parts: msg.parts || [{ text: msg.text }]
    }));

    // Generate content with the updated API
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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

    // Extract text from response
    const text = response.text || "I'm sorry, I couldn't process that.";
    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Log more detailed error information
    if (error.message) {
      console.error("Error message:", error.message);
    }
    if (error.response) {
      console.error("Error response:", error.response);
    }
    
    return NextResponse.json({ 
      error: "Failed to process request",
      details: error.message || "Unknown error"
    }, { status: 500 });
  }
}
