import { GoogleGenAI } from "@google/genai";
import fs from 'fs';

// Manual env loader
function loadEnv() {
  try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    envFile.split('\n').forEach(line => {
      const [key, ...values] = line.split('=');
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join('=').trim();
      }
    });
  } catch (e) {
    // ignore
  }
}
loadEnv();

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
if (!apiKey) {
  console.error("NO_API_KEY_FOUND");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function extract() {
  try {
    const imageBuffer = fs.readFileSync('public/context_image.jpg');
    const imageBase64 = imageBuffer.toString('base64');

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: "Extract all the text content from this image verbatim. Do not add any conversational filler." },
            { inlineData: { mimeType: "image/jpeg", data: imageBase64 } }
          ]
        }
      ]
    });

    console.log(response.text());
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}

extract();
