import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

// --- CONFIGURATION ---
// Ensure you set these in your local .env file before running
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_GEMINI_KEY";
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "YOUR_ELEVENLABS_KEY";
const VERTEX_PROJECT_ID = process.env.VERTEX_PROJECT_ID || "gen-lang-client-0496094478";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

/**
 * STEP 1: The Brain (Gemini)
 * Generates the ad script and the visual prompts for Veo.
 */
async function generateCampaignScript(trade: string, city: string) {
    console.log(`\n🧠 STEP 1: Gemini is writing a campaign for ${trade}s in ${city}...`);
    
    const prompt = `
    You are an elite B2B copywriter. Write a 15-second video ad script for a SaaS product called 'Zenna'.
    Zenna is an AI receptionist for trades businesses.
    Target Audience: ${trade}s in ${city}.
    Pain Point: Missing phone calls while on the tools means losing money.
    
    Return JSON format:
    {
      "hook_voiceover": "...",
      "pitch_voiceover": "...",
      "veo_visual_prompt": "Cinematic 4k vertical shot of..."
    }
    `;

    // Mock response to prevent crashing if no API key is present or invalid
    if (GEMINI_API_KEY === "YOUR_GEMINI_KEY" || GEMINI_API_KEY.length < 10) {
        console.warn("   ⚠️ No valid Gemini Key found. Using mock script.");
        return {
            hook_voiceover: `Hey ${city} ${trade}s, stop letting phone calls interrupt your work.`,
            pitch_voiceover: `Zenna is the AI receptionist that books your jobs while you're on the tools. Link in bio.`,
            veo_visual_prompt: `Cinematic 4k vertical shot of a stressed ${trade} in ${city} dropping a tool to answer a ringing phone.`
        };
    }

    const response = await ai.models.generateContent({
        model: 'gemini-1.5-pro',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    
    return JSON.parse(response.text);
}

/**
 * STEP 2: The Visuals (Google Veo)
 * Calls Vertex AI to generate the B-roll video.
 */
async function generateVeoVideo(visualPrompt: string) {
    console.log(`\n🎥 STEP 2: Google Veo is rendering the video...`);
    console.log(`   Prompt: "${visualPrompt}"`);
    
    // TODO: Integrate google-auth-library and Vertex AI REST API for Veo 3.1
    // POST https://{REGION}-aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT_ID}/locations/{REGION}/publishers/google/models/veo-3.1-fast-generate-preview:predict
    
    console.log(`   ⏳ Simulated 60s render wait...`);
    return "path/to/generated/veo_broll.mp4";
}

/**
 * STEP 3: The Voice (ElevenLabs)
 * Generates the aggressive, high-converting voiceover.
 */
async function generateVoiceover(text: string) {
    console.log(`\n🗣️ STEP 3: ElevenLabs is generating the voiceover...`);
    
    if (ELEVENLABS_API_KEY === "YOUR_ELEVENLABS_KEY") {
         console.log(`   ⚠️ No ElevenLabs key. Skipping audio generation.`);
         return "path/to/mock_audio.mp3";
    }

    // Example fetch to ElevenLabs API
    /*
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/TRADIE_VOICE_ID', {
        method: 'POST',
        headers: { 'xi-api-key': ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, model_id: "eleven_multilingual_v2" })
    });
    const buffer = await response.arrayBuffer();
    fs.writeFileSync('output_audio.mp3', Buffer.from(buffer));
    */
    
    return "path/to/generated_audio.mp3";
}

/**
 * STEP 4: The Assembly (Remotion)
 * Stitches the Veo video and ElevenLabs audio together.
 */
async function assembleVideo(videoPath: string, audioPath: string) {
    console.log(`\n⚙️ STEP 4: Remotion is compiling the final MP4...`);
    // Here we would call: npx remotion render src/video/index.ts ZennaAd out/final_ad.mp4
    console.log(`   ✅ Final Ad Generated: out/final_ad.mp4`);
}

// --- MAIN FACTORY LOOP ---
async function runFactory() {
    console.log("🚀 STARTING ZENNA MARKETING FACTORY");
    console.log("=====================================");
    
    const targetTrade = "Electrician";
    const targetCity = "Melbourne";
    
    try {
        const script = await generateCampaignScript(targetTrade, targetCity);
        const videoFile = await generateVeoVideo(script.veo_visual_prompt);
        
        const fullScript = `${script.hook_voiceover} ${script.pitch_voiceover}`;
        const audioFile = await generateVoiceover(fullScript);
        
        await assembleVideo(videoFile, audioFile);
        
        console.log("\n🔥 CAMPAIGN READY FOR N8N DISTRIBUTION 🔥");
    } catch (error) {
        console.error("Factory Error:", error);
    }
}

import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    runFactory();
}
