import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AIServiceConfig {
  businessName: string;
  ownerName: string;
  calloutFee: string;
  bookingLink: string;
}

const DEFAULT_CONFIG: AIServiceConfig = {
  businessName: process.env.BUSINESS_NAME || 'Hartley Plumbing & Drainage',
  ownerName: process.env.OWNER_NAME || 'Dave',
  calloutFee: process.env.CALLOUT_FEE || '$150',
  bookingLink: process.env.BOOKING_LINK || 'https://zenna.au/book'
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo');

/**
 * Resolves Ollama host across localhost, WSL2 host bridge, or custom env
 */
function getOllamaEndpoints(): string[] {
  const customHost = process.env.OLLAMA_HOST;
  const endpoints: string[] = [];

  if (customHost) {
    endpoints.push(customHost.startsWith('http') ? `${customHost}/api/generate` : `http://${customHost}:11434/api/generate`);
  }

  // Standard localhost
  endpoints.push('http://localhost:11434/api/generate');
  endpoints.push('http://127.0.0.1:11434/api/generate');

  return endpoints;
}

/**
 * Tier 1: Local GPU Inference via Ollama (Sub-50ms latency, $0.00 cost)
 */
async function tryOllamaInference(prompt: string, timeoutMs = 3000): Promise<string | null> {
  const endpoints = getOllamaEndpoints();
  const models = [
    process.env.OLLAMA_MODEL,
    'hermes3:3b',
    'llama3.2',
    'qwen2.5-coder:3b-instruct-q4_K_M',
    'llama3.2:3b',
    'mistral'
  ].filter(Boolean) as string[];

  for (const endpoint of endpoints) {
    for (const model of models) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            prompt,
            stream: false,
            options: {
              temperature: 0.7,
              num_predict: 250
            }
          }),
          signal: controller.signal
        });

        clearTimeout(timer);

        if (response.ok) {
          const data = await response.json();
          if (data.response && data.response.trim()) {
            return data.response.trim();
          }
        }
      } catch (err) {
        // Continue to next endpoint/model on failure
      }
    }
  }

  return null;
}

/**
 * Tier 2: Cloud Gemini Flash API (High throughput, 1000+ RPM)
 */
async function tryGeminiInference(systemPrompt: string, userMessage: string): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'demo') {
    return null;
  }

  const modelNames = ['gemini-2.5-flash', 'gemini-1.5-flash-latest', 'gemini-2.0-flash-exp', 'gemini-1.5-pro'];
  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        { text: `${systemPrompt}\n\nUser Message/Trigger: ${userMessage}` }
      ]);
      const text = result.response.text();
      if (text && text.trim()) {
        return text.trim();
      }
    } catch (err) {
      // try next model
    }
  }

  return null;
}

/**
 * Unified Multi-Tier AI Gateway for Zenna
 * 1. Local GPU (Ollama) -> 2. Cloud Gemini Flash -> 3. Deterministic Tradie Rule Engine
 */
export async function askZennaEngine(
  systemPrompt: string,
  userMessage: string,
  config: AIServiceConfig = DEFAULT_CONFIG
): Promise<{ text: string; provider: 'local_gpu_ollama' | 'cloud_gemini' | 'rule_engine_fallback' }> {
  const combinedPrompt = `${systemPrompt}\n\nCustomer Message: ${userMessage}\n\nRespond as Zenna in 1-2 authentic Australian tradie conversational sentences:`;

  // Tier 1: Local GPU Inference
  const localGPUResponse = await tryOllamaInference(combinedPrompt);
  if (localGPUResponse) {
    return { text: localGPUResponse, provider: 'local_gpu_ollama' };
  }

  // Tier 2: Cloud Gemini API
  const cloudResponse = await tryGeminiInference(systemPrompt, userMessage);
  if (cloudResponse) {
    return { text: cloudResponse, provider: 'cloud_gemini' };
  }

  // Tier 3: Deterministic Rule Engine
  const fallback = `G'day! Zenna here, ${config.ownerName}'s AI receptionist at ${config.businessName}. We're on the tools right now, but we've got your details and will get you sorted shortly! Standard call-out diagnostic is ${config.calloutFee}. 🤙`;
  return { text: fallback, provider: 'rule_engine_fallback' };
}
