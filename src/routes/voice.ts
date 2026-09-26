import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getLeads, logCall, saveLead, getSetting } from '../../db.js';

export const voiceRouter = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo');

const config = {
  businessName: process.env.BUSINESS_NAME || 'Hartley Plumbing & Drainage',
  ownerName: process.env.OWNER_NAME || 'Dave',
  ownerPhone: process.env.OWNER_PHONE || '+61400000000',
  bookingLink: process.env.BOOKING_LINK || 'https://zenna.au/book',
  calloutFee: process.env.CALLOUT_FEE || '$150'
};

function normalizePhone(num: string): string {
  return num.replace(/\D/g, '').replace(/^61/, '0').replace(/^00/, '0');
}

import { askZennaEngine } from '../services/ai.js';

export async function askZenna(systemPrompt: string, userMessage: string): Promise<string> {
  const result = await askZennaEngine(systemPrompt, userMessage, config);
  return result.text;
}

// Session store for conversational voice engine
const voiceSessions = new Map<string, { id: string; createdAt: string; history: Array<{ user: string; ai: string }> }>();

// POST /api/voice/conversation/create
voiceRouter.post('/conversation/create', (req: Request, res: Response) => {
  const sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  voiceSessions.set(sessionId, {
    id: sessionId,
    createdAt: new Date().toISOString(),
    history: []
  });
  res.json({
    session_id: sessionId,
    greeting: `G'day! I'm Zenna, your AI voice assistant powered by the RevenuePilot Engine for ${config.businessName}. How can I help your business today?`
  });
});

// POST /api/voice/process
voiceRouter.post('/process', async (req: Request, res: Response) => {
  const { session_id, text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Text prompt is required' });
  }

  const session = voiceSessions.get(session_id) || { id: session_id, createdAt: new Date().toISOString(), history: [] };
  
  const voicePrompt = `You are Zenna, an intelligent AI Voice Engine assistant for ${config.businessName} (Owner: ${config.ownerName}).
Call-out Diagnostic Fee: ${config.calloutFee}.
Booking Link: ${config.bookingLink}.
You NEVER get stuck. Answer the caller/user clearly, concisely, and naturally. If they ask about services, call-out fees, bookings, or troubleshooting, give helpful Australian tradie responses. User said: "${text}"`;

  const responseText = await askZenna(voicePrompt, text);
  session.history.push({ user: text, ai: responseText });
  voiceSessions.set(session_id, session);

  res.json({ response: responseText, session_id });
});

// POST /api/voice/conversation/end
voiceRouter.post('/conversation/end', (req: Request, res: Response) => {
  const { session_id } = req.body;
  if (session_id) {
    voiceSessions.delete(session_id);
  }
  res.json({ success: true, status: 'Session ended' });
});

// POST /api/voice/simulate-call
voiceRouter.post('/simulate-call', async (req: Request, res: Response) => {
  const tenant_id = (req as any).user?.uid || 'default_tenant';
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone is required for call simulation' });
  }

  const normQuery = normalizePhone(phone);
  const leads = (await getLeads(tenant_id)) as any[];
  const matched = leads.find(lead => normalizePhone(lead.phone) === normQuery || normQuery.includes(normalizePhone(lead.phone)) || normalizePhone(lead.phone).includes(normQuery));

  let clientContext = '';

  if (matched) {
    clientContext = `CRM LOOKUP MATCHED:
Name: ${matched.name}
Phone: ${matched.phone}
Project/Notes: ${matched.notes}
Current Status: ${matched.status}
Value: ${matched.job_value || matched.value}`;
  } else {
    clientContext = `CRM LOOKUP:
Name: Unrecognised / New Caller
Phone: ${phone}
This caller is not in your CRM directory yet. Introduce yourself as Zenna, collect their name and job details beautifully.`;
  }

  const systemPrompt = `ROLE: You are "Zenna", the elite AI Receptionist for "${config.businessName}" (Owner: ${config.ownerName}).
TONE: Authentic, helpful, direct Australian trade professionalism ("G'day", "no worries", "too easy").
QUALIFICATION:
1. Greet caller and ask for Name + Suburb/Address.
2. Scope of work (burst pipes, blocked drain, maintenance).
3. Call-out & diagnostic fee: State standard call-out diagnostic fee of ${config.calloutFee} AUD.

${clientContext}

Keep the response highly realistic, spoken, professional but warm. Speak in 1-2 smooth, conversational sentences suitable for a live phone conversation.`;

  const voiceScript = await askZenna(systemPrompt, 'The customer has dialed in and call is answered live.');

  await logCall(tenant_id, {
    from_number: phone,
    message: voiceScript,
    status: matched ? 'Live Personalized Answer' : 'Call Logged & Handled',
    sms_sent: true
  });

  if (!matched) {
    await saveLead(tenant_id, {
      name: 'Potential Lead',
      phone: phone,
      status: 'New',
      job_value: '$0',
      notes: 'First call caught by Zenna AI receptionist'
    });
  }

  res.json({
    success: true,
    found: !!matched,
    client: matched || {
      name: 'Potential Lead',
      phone: phone,
      status: 'New',
      value: '$0',
      notes: 'First call caught. Profile automatically drafted by Zenna Lookup.'
    },
    script: voiceScript,
    status: 'Call Logged & Processed'
  });
});
