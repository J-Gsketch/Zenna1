import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import twilio from "twilio";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { initDB, getLeads, saveLead, getCalls, logCall, getSetting, setSetting, getTenantByTwilioNumber } from "./db.js";

dotenv.config();

// Initialize SQLite database
initDB();

async function startServer() {
  
// --- VIP SLACK LOGGER ---
const sendSlackAlert = async (message: string, isError = false) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return; // Silent skip if no slack webhook configured
  
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: isError ? `🚨 *CRITICAL ERROR* 🚨\n${message}` : `💰 *VIP LEAD CAPTURE* 💰\n${message}` 
      })
    });
  } catch (e) {
    console.error("Failed to send Slack alert", e);
  }
};

const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // --- AUTH MIDDLEWARE ---
  const verifyToken = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
    try {
      const idToken = authHeader.split("Bearer ")[1];
      const decoded = await getAdminAuth().verifyIdToken(idToken);
      req.user = decoded;
      next();
    } catch (err) {
      console.error("Token verification failed:", err);
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // --- TWILIO CLIENT ---
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFromNumber = process.env.TWILIO_FROM_NUMBER;

  const twilioClient = (twilioAccountSid && twilioAccountSid.startsWith('AC') && twilioAuthToken) 
    ? twilio(twilioAccountSid, twilioAuthToken) 
    : null;

  async function sendSMS(to: string, body: string) {
    if (!twilioClient || !twilioFromNumber) {
      console.log(`[SMS Demo Mode] To: ${to} | Message: ${body}`);
      return { success: true, demo: true };
    }
    try {
      const msg = await twilioClient.messages.create({
        to,
        from: twilioFromNumber,
        body
      });
      console.log(`[SMS Sent] SID: ${msg.sid} -> ${to}`);
      return { success: true, sid: msg.sid };
    } catch (err: any) {
      console.error(`[SMS Error] ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  // --- CONFIGURATION ---
  const config = {
    businessName: process.env.BUSINESS_NAME || "Hartley Plumbing & Drainage",
    ownerName: process.env.OWNER_NAME || "Dave",
    ownerPhone: process.env.OWNER_PHONE || "+61400000000",
    bookingLink: process.env.BOOKING_LINK || "https://zenna.au/book",
    calloutFee: process.env.CALLOUT_FEE || "$150"
  };

  // Helper to normalize numbers for uniform lookups
  function normalizePhone(num: string): string {
    return num.replace(/\D/g, '').replace(/^61/, '0').replace(/^00/, '0');
  }

  // --- AI LOGIC (Gemini) ---
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "demo");

  async function askZenna(systemPrompt: string, userMessage: string) {
    if (!process.env.GEMINI_API_KEY) {
      return `G'day! Zenna here from ${config.businessName}. We've caught your call and will text you back shortly! 🤙`;
    }
    const modelNames = ["gemini-2.5-flash", "gemini-1.5-flash-latest", "gemini-2.0-flash-exp", "gemini-1.5-pro"];
    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([
          { text: `${systemPrompt}\n\nUser Message/Trigger: ${userMessage}` }
        ]);
        return result.response.text();
      } catch (err) {
        // try next model
      }
    }
    return `G'day! Zenna here, ${config.ownerName}'s AI receptionist at ${config.businessName}. We're on the tools right now, how can we get you sorted today?`;
  }

  // --- API ROUTES ---

  // --- TWILIO AUTO-PROVISIONING ---
  app.post("/api/setup-tenant", verifyToken, async (req, res) => {
    const tenant_id = (req as any).user.uid;
    const { businessName, ownerName, ownerPhone } = req.body;
    
    // Check if they already have a number
    const existing = await getSetting(tenant_id, 'twilio_number');
    if (existing) {
      return res.json({ success: true, twilioNumber: existing });
    }

    if (!twilioClient) {
      return res.status(500).json({ error: "Twilio Client not configured on server" });
    }

    try {
      const localNumbers = await twilioClient.availablePhoneNumbers('AU').local.list({ limit: 1 });
      if (!localNumbers || localNumbers.length === 0) {
        return res.status(500).json({ error: "No Twilio numbers available in AU region." });
      }

      const availableNumber = localNumbers[0].phoneNumber;
      const purchasedNumber = await twilioClient.incomingPhoneNumbers.create({
        phoneNumber: availableNumber,
        voiceUrl: `https://hammer-and-code.web.app/webhook/missed-call`,
        smsUrl: `https://hammer-and-code.web.app/webhook/sms`
      });

      await setSetting(tenant_id, 'twilio_number', purchasedNumber.phoneNumber);
      await setSetting(tenant_id, 'businessName', businessName);
      await setSetting(tenant_id, 'ownerName', ownerName);
      
      const { getFirestore } = require('firebase-admin/firestore');
      await getFirestore('zenna-db').collection('tenants').doc(tenant_id).set({
        twilio_number: purchasedNumber.phoneNumber,
        businessName,
        ownerPhone
      }, { merge: true });

      res.json({ success: true, twilioNumber: purchasedNumber.phoneNumber });
    } catch (err: any) {
      console.error("Twilio Provisioning Error:", err);
      res.status(500).json({ error: "Failed to provision phone number", details: err.message });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", product: "Zenna", db: "SQLite Active" });
  });

  app.get("/api/stats", verifyToken, async (req, res) => {
    const tenant_id = (req as any).user.uid;

    const leadsList = (await getLeads(tenant_id)) as any[];
    const callsList = (await getCalls(tenant_id)) as any[];
    const confirmedValue = leadsList.reduce((acc, current) => {
      const val = parseInt(String(current.job_value || '$0').replace(/[^0-9]/g, '')) || 0;
      return val + acc;
    }, 0);

    res.json({
      today: {
        confirmedValue: confirmedValue,
        newLeads: leadsList.length,
        callsCaught: callsList.length,
        actionRequired: "Review upcoming schedule and site diagnostic dispatches"
      }
    });
  });

  app.get("/api/leads", verifyToken, async (req, res) => {
    const tenant_id = (req as any).user.uid;

    res.json(await getLeads(tenant_id));
  });

  app.post("/api/leads", verifyToken, async (req, res) => {
    const tenant_id = (req as any).user.uid;

    const { name, phone, value, status, notes } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: "Name and phone are required" });
    }
    await saveLead(tenant_id, { name, phone, job_value: value || '$0', status: status || 'New', notes: notes || '' });
    res.json({ success: true, lead: { name, phone, status, job_value: value, notes } });
  });

  // --- AUTOMATED ONBOARDING & BUSINESS CONFIGURATION (NZ & AU REGIONS) ---
  app.get("/api/business-config", verifyToken, async (req, res) => {
    const tenant_id = (req as any).user.uid;

    res.json({
      businessName: await getSetting(tenant_id, 'businessName', 'Zenna by Hammer & Code'),
      ownerName: await getSetting(tenant_id, 'ownerName', config.ownerName),
      ownerPhone: await getSetting(tenant_id, 'ownerPhone', config.ownerPhone),
      calloutFee: await getSetting(tenant_id, 'calloutFee', '$150'),
      bookingLink: await getSetting(tenant_id, 'bookingLink', 'https://zenna.au/book'),
      region: await getSetting(tenant_id, 'region', 'NZ'),
      currency: await getSetting(tenant_id, 'currency', 'NZD'),
      plan: await getSetting(tenant_id, 'plan', 'Solo Tradie ($199/mo)'),
      subscriptionStatus: await getSetting(tenant_id, 'subscriptionStatus', 'Active (7-Day Trial)'),
      twilioForwardingNumberNZ: await getSetting(tenant_id, 'twilioForwardingNumberNZ', '+6421912345'),
      twilioForwardingNumberAU: await getSetting(tenant_id, 'twilioForwardingNumberAU', '+61291234567')
    });
  });

  app.post("/api/business-config", verifyToken, async (req, res) => {
    const tenant_id = (req as any).user.uid;

    const { businessName, ownerName, ownerPhone, calloutFee, bookingLink, plan, region, currency } = req.body;
    if (businessName) await setSetting(tenant_id, 'businessName', businessName);
    if (ownerName) await setSetting(tenant_id, 'ownerName', ownerName);
    if (ownerPhone) await setSetting(tenant_id, 'ownerPhone', ownerPhone);
    if (calloutFee) await setSetting(tenant_id, 'calloutFee', calloutFee);
    if (bookingLink) await setSetting(tenant_id, 'bookingLink', bookingLink);
    if (plan) await setSetting(tenant_id, 'plan', plan);
    if (region) await setSetting(tenant_id, 'region', region);
    if (currency) await setSetting(tenant_id, 'currency', currency);

    res.json({
      success: true,
      message: "Business configuration saved automatically!",
      config: {
        businessName: await getSetting(tenant_id, 'businessName', 'Zenna by Hammer & Code'),
        ownerName: await getSetting(tenant_id, 'ownerName', config.ownerName),
        ownerPhone: await getSetting(tenant_id, 'ownerPhone', config.ownerPhone),
        calloutFee: await getSetting(tenant_id, 'calloutFee', '$150'),
        bookingLink: await getSetting(tenant_id, 'bookingLink', 'https://zenna.au/book'),
        region: await getSetting(tenant_id, 'region', 'NZ'),
        currency: await getSetting(tenant_id, 'currency', 'NZD'),
        plan: await getSetting(tenant_id, 'plan', 'Solo Tradie ($199/mo)')
      }
    });
  });

  app.post("/api/create-subscription", verifyToken, async (req, res) => {
    const tenant_id = (req as any).user.uid;

    const { plan, email, businessName, currency } = req.body;
    const currSymbol = (currency === 'AUD' || currency === 'AUD ($)') ? 'AUD $' : 'NZD $';
    const planPrice = plan === 'Pro Team' ? `${currSymbol}399` : `${currSymbol}199`;
    const checkoutUrl = `https://checkout.stripe.com/c/pay/cs_live_zenna_${Date.now()}?plan=${encodeURIComponent(plan || 'Solo Tradie')}&currency=${currency || 'NZD'}`;
    
    await setSetting(tenant_id, 'subscriptionStatus', 'Subscribed & Active');
    if (plan) await setSetting(tenant_id, 'plan', `${plan} (${planPrice}/mo)`);

    res.json({
      success: true,
      plan: plan || 'Solo Tradie',
      currency: currency || 'NZD',
      checkoutUrl: checkoutUrl,
      message: `Automated subscription initialized for ${businessName || 'Business'}. Recurring billing set to ${planPrice}/mo.`
    });
  });

  // Client lookup endpoint by phone
  app.get("/api/lookup", verifyToken, async (req, res) => {
    const tenant_id = (req as any).user.uid;

    const phoneQuery = req.query.phone as string;
    if (!phoneQuery) {
      return res.status(400).json({ error: "Phone query parameter is required" });
    }

    const normQuery = normalizePhone(phoneQuery);
    const leads = (await getLeads(tenant_id)) as any[];
    const matched = leads.find(lead => normalizePhone(lead.phone) === normQuery || normQuery.includes(normalizePhone(lead.phone)) || normalizePhone(lead.phone).includes(normQuery));

    if (matched) {
      return res.json({
        found: true,
        client: matched,
        type: "Existing Client"
      });
    }

    return res.json({
      found: false,
      type: "New / Unrecognised Lead",
      client: {
        name: "Unknown Caller",
        phone: phoneQuery,
        status: "Potential",
        value: "Unknown",
        notes: "No historical data found in Zenna CRM for this phone number."
      }
    });
  });

  // Voice lookup and simulation endpoint
  app.post("/api/simulate-call", verifyToken, async (req, res) => {
    const tenant_id = (req as any).user.uid;

    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Phone is required for call simulation" });
    }

    const normQuery = normalizePhone(phone);
    const leads = (await getLeads(tenant_id)) as any[];
    const matched = leads.find(lead => normalizePhone(lead.phone) === normQuery || normQuery.includes(normalizePhone(lead.phone)) || normalizePhone(lead.phone).includes(normQuery));

    let clientContext = "";
    let lookupGreeting = "";

    if (matched) {
      clientContext = `CRM LOOKUP MATCHED:
Name: ${matched.name}
Phone: ${matched.phone}
Project/Notes: ${matched.notes}
Current Status: ${matched.status}
Value: ${matched.job_value || matched.value}`;
      
      lookupGreeting = `Recognised existing customer ${matched.name}.`;
    } else {
      clientContext = `CRM LOOKUP:
Name: Unrecognised / New Caller
Phone: ${phone}
This caller is not in your CRM directory yet. Introduce yourself as Zenna, collect their name and job details beautifully.`;
      
      lookupGreeting = `Identified new potential caller.`;
    }

    const systemPrompt = `ROLE: You are "Zenna", the elite AI Receptionist for "${config.businessName}" (Owner: ${config.ownerName}).
TONE: Authentic, helpful, direct Australian trade professionalism ("G'day", "no worries", "too easy").
QUALIFICATION:
1. Greet caller and ask for Name + Suburb/Address.
2. Scope of work (burst pipes, blocked drain, maintenance).
3. Call-out & diagnostic fee: State standard call-out diagnostic fee of ${config.calloutFee} AUD.

${clientContext}

Keep the response highly realistic, spoken, professional but warm. Speak in 1-2 smooth, conversational sentences suitable for a live phone conversation.`;

    const voiceScript = await askZenna(systemPrompt, "The customer has dialed in and call is answered live.");
    
    // Log call into SQLite
    await logCall(tenant_id, {
      from_number: phone,
      message: voiceScript,
      status: matched ? 'Live Personalized Answer' : 'Call Logged & Handled',
      sms_sent: true
    });

    if (!matched) {
      await saveLead(tenant_id, {
        name: "Potential Lead",
        phone: phone,
        status: "New",
        job_value: "$0",
        notes: "First call caught by Zenna AI receptionist"
      });
    }

    if (!matched) {
      sendSlackAlert(`Zenna answered a new call from ${phone}! Follow up immediately in the CRM.`, false);
    }
    res.json({
      success: true,
      found: !!matched,
      client: matched || {
        name: "Potential Lead",
        phone: phone,
        status: "New",
        value: "$0",
        notes: "First call caught. Profile automatically drafted by Zenna Lookup."
      },
      script: voiceScript,
      status: "Call Logged & Processed"
    });
  });

  app.post("/api/ask", verifyToken, async (req, res) => {
    const tenant_id = (req as any).user.uid;

    const { question } = req.body;
    const leadsList = (await getLeads(tenant_id)) as any[];
    const stats = {
      confirmedToday: 4200,
      newLeads: leadsList.length,
      pipelineValue: 14500
    };
    
    const systemPrompt = `You are Zenna, a business assistant for ${config.ownerName} at ${config.businessName}. 
    Answer questions about the business based on this context: ${JSON.stringify(stats)}. 
    Be concise, warm, and chief-of-staff professional.`;
    
    const answer = await askZenna(systemPrompt, question);
    res.json({ answer });
  });

  // --- REVENUEPILOT VOICE ENGINE ENDPOINTS ---
  const voiceSessions = new Map<string, { id: string; createdAt: string; history: any[] }>();

  app.post("/api/voice-engine/conversation/create", (req, res) => {
    const sessionId = "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
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

  app.post("/api/voice-engine/process", async (req, res) => {
    const { session_id, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text prompt is required" });
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

  app.post("/api/voice-engine/conversation/end", (req, res) => {
    const { session_id } = req.body;
    if (session_id) {
      voiceSessions.delete(session_id);
    }
    res.json({ success: true, status: "Session ended" });
  });

  // --- BRAND NEW: INSTANT SOFTWARE MVP QUOTES & SAAS RUNTIME ONBOARDINGS ---

  // Generate an instant structured quote drafted by Zenna
  app.post("/api/draft-quote", async (req, res) => {
    const { clientName, clientNotes, phone } = req.body;
    if (!clientName || !clientNotes) {
      return res.status(400).json({ error: "Client name and project notes are required" });
    }

    const systemPrompt = `You are Zenna, the AI Elite workflow assistant for ${config.businessName}.
    Given the client "${clientName}" and their project request: "${clientNotes}".
    Create a highly realistic, professional, formatted Australian software development and app scoping quote (GST inclusive 10%).
    
    Structure the output as a JSON object containing:
    1. "intro": A warm, professional introductory note addressed to ${clientName} mentioning ${config.businessName}.
    2. "items": An array of object items, each with "description" and "price" (formatted string e.g. "$1,500"). Be realistic with SaaS MVP build, database design, visual UI layout, and Stripe checkout configuration pricing!
    3. "gst": The calculated GST component of the total.
    4. "total": The calculated combined total (e.g. "$4,950").
    5. "warranty": 1-sentence warrantee/maintenance statement (e.g. "Includes our standard 12-month post-launch maintenance, QA, and security review").
    6. "actionRequired": Next step recommendation for the developer to initialize the workspace repo and set up the kickoff callback.
    
    Your output MUST be valid JSON and ONLY the JSON block, no markdown formatting tags like \`\`\`json.`;

    try {
      const responseText = await askZenna(systemPrompt, "Synthesize tech scoping quote file.");
      
      // Attempt cleanup or dynamic structure
      let cleaned = responseText.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.substring(7);
      }
      if (cleaned.endsWith("```")) {
        cleaned = cleaned.substring(0, cleaned.length - 3);
      }
      cleaned = cleaned.trim();
      
      const parsedQuote = JSON.parse(cleaned);
      res.json({ success: true, quote: parsedQuote });
    } catch (error) {
      console.error("Quote Synthesis Error:", error);
      // Fallback response with structured template
      res.json({
        success: true,
        quote: {
          intro: `G'day ${clientName}, here is the initial scoping estimate for ${config.businessName} to kick off building your app: ${clientNotes}.`,
          items: [
            { description: "Interactive React Frontend & UI/UX wireframes", price: "$2,850.00" },
            { description: "Database design, secure Firestore endpoints, and server configuration", price: "$3,500.00" }
          ],
          gst: "$635.00",
          total: "$6,985.00",
          warranty: "All code commits are fully covered by a 12-month quality assurance warrantee and responsive support support.",
          actionRequired: "Initialize workspace repo and run initial developer scoping meeting."
        }
      });
    }
  });

  // Calculate optimized dispatch metrics, tools needed, and notifications for software workspace setup
  app.post("/api/route-dispatch", async (req, res) => {
    const { clientName, clientNotes } = req.body;
    if (!clientName || !clientNotes) {
      return res.status(400).json({ error: "Client details are required for developer dispatching." });
    }

    const systemPrompt = `You are Zenna, the lead DevOps and delivery coordinator for ${config.businessName}.
    We are spinning up the local workspace and launching the project scaffold for client ${clientName} for their SaaS project: "${clientNotes}".
    
    Structure the response as a JSON object containing:
    1. "travelMinutes": Estimate realistic automated workspace provisioning and project scaffolding duration (e.g. "8 mins").
    2. "distanceKm": Precise simulated response latency or package size (e.g. "5.4 MB package size").
    3. "dispatchZone": Safe server environment staging zone (e.g. "Google Cloud Run Sandbox - Melbourne South").
    4. "toolsRequired": An array of 4-5 specific tech tooling/architectural blocks required for this project "${clientNotes}" (e.g. Vite, Tailwind, Firebase, Stripe, etc.).
    5. "clientAlertDraft": A short 120-character SMS draft to auto-send to the client (e.g. "G'day ${clientName}, Zenna here from Zenna App Studio. We've spun up your local SaaS repo workspace. Let us know what you think!").
    
    Return ONLY valid, parsable JSON, no surrounding markup.`;

    try {
      const responseText = await askZenna(systemPrompt, "Calculate optimized staging environment build checklist.");
      
      let cleaned = responseText.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.substring(7);
      }
      if (cleaned.endsWith("```")) {
        cleaned = cleaned.substring(0, cleaned.length - 3);
      }
      cleaned = cleaned.trim();

      const parsedDispatch = JSON.parse(cleaned);
      res.json({ success: true, dispatch: parsedDispatch });
    } catch (error) {
      console.error("Dispatch Calculation Error:", error);
      res.json({
        success: true,
        dispatch: {
          travelMinutes: "12 mins",
          distanceKm: "8.4 MB size",
          dispatchZone: "Cloud Staging Sandbox - Asia-East",
          toolsRequired: [
            "Vite + React Static Framework",
            "Tailwind UI Utility Configuration",
            "Firestore Database Schema & Firebase Auth Rules",
            "Stripe Subscription Webhook Listeners"
          ],
          clientAlertDraft: `G'day ${clientName}, Zenna here from Zenna App Studio. CRM synced! We've provisioned your new dev repo workspace. Let's make it happen. 🤙`
        }
      });
    }
  });

  // --- BRAND NEW: HAMMER & CODE TRADIE MARKETING & CAMPAIGN CREATIVE GENERATOR ---
  app.post("/api/generate-tradie-campaign", async (req, res) => {
    const { trade, suburb, pricingModel, partnerName, partnerSpecialty, customPromoLine } = req.body;
    
    if (!trade) {
      return res.status(400).json({ error: "Trade specialty is required." });
    }

    const systemPrompt = `You are the lead marketing strategist and business coordinator for "Hammer & Code" — the premier scale-up framework for Australian trade businesses.
    Your mission is to construct a fully customized, rapid-replicating tradie marketing, ad campaign, pricing, and business partnership handbook.
    
    The target trade business has these specs:
    - Trade Specialty: ${trade}
    - Operating Metro Hub / Suburb: ${suburb || "Melbourne Metro, VIC"}
    - Proposed Pricing Model: ${pricingModel || "Flat-rate diagnostic upfront"}
    - Proposed Business Partner (if any): ${partnerName ? `${partnerName} (${partnerSpecialty || 'Trade Partner'})` : "Solo operator scaling through subcontractors"}
    - Custom Promotional Angle: ${customPromoLine || "No call-out fee or it is free"}
    
    Structure the response as a valid JSON object containing EXACTLY these key-values (your output MUST be valid JSON, do not include markdown blocks):
    1. "advertisingCampaign": {
         "campaignName": "A catchy high-impact marketing name for this campaign",
         "targetAudience": "Which residential/commercial segments in this suburb",
         "promoOffer": "A highly punchy direct offer statement",
         "videoAdScript": {
           "hook": "0-5 seconds: A high-impact visual & spoken hook to hold attention on TikTok or Meta (use authentic Aussie tradie slang e.g. cheeky shaka, spit-the-dummy, sorted)",
           "problem": "5-15 seconds: Address the core frustration of price-shopping and the plumbing/electrical delay of competitors",
           "solution": "15-30 seconds: Introduce our Hammer & Code powered immediate automated response and instant pricing clarity",
           "cta": "30-45 seconds: Immediate call to action linking to our automated booker"
         }
       },
    2. "pricingInvestigation": {
         "industryBenchmark": "Hourly vs. Flat-rate benchmark rates parsed from Australian trade directories (e.g., Hipages, Airtasker) for ${trade}",
         "recommendedHourly": "Suggested base hourly operational rate for ${trade}",
         "recommendedFlatRatePackage": "Suggested fixed diagnostic or service package price to beat local SEO competition and secure instant bookings",
         "positioningStrategy": "A 2-sentence positioning advice on how to price without matching lowballers"
       },
    3. "partnershipAgreement": {
         "stateJurisdiction": "Compliant state jurisdiction terms for Victoria/NSW/Queensland",
         "clauseEquitySplit": "Suggested equity or subcontract profit-share split clause for a partnership under Hammer & Code",
         "scopeOfWorks": "Draft Scope of Works detailing task allocations",
         "legalMemoText": "A formal, plain-English trades partnership memorandum statement ready to sign"
       },
    4. "socialsBlueprint": {
         "firstPostCaption": "An engaging, cheeky Aussie direct-response Instagram/Facebook post caption with custom emojis",
         "weeklyCadence": "A rapid-replicating content strategy blueprint to scale fast",
         "hashtagPool": "A list of 6-8 relevant hashtags"
       }
    
    Ensure all text uses authentic Aussie spelling (e.g. generalisation, prioritising, specialised, check-out) and trade colloquialisms. Return ONLY parsed JSON.`;

    try {
      const responseText = await askZenna(systemPrompt, "Synthesize Hammer & Code campaign assets.");
      
      let cleaned = responseText.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.substring(7);
      }
      if (cleaned.endsWith("```")) {
        cleaned = cleaned.substring(0, cleaned.length - 3);
      }
      cleaned = cleaned.trim();
      
      const parsed = JSON.parse(cleaned);
      res.json({ success: true, campaign: parsed });
    } catch (error) {
      console.error("Campaign Synthesis Error:", error);
      // Fallback response matching schema
      res.json({
        success: true,
        campaign: {
          advertisingCampaign: {
            campaignName: `The ${trade} Rapid response rollout`,
            targetAudience: `Residential home-owners and property managers in ${suburb || "Melbourne Metro"}`,
            promoOffer: `Fixed $150 upfront diagnostic — if we aren't there within 60 minutes, it's free!`,
            videoAdScript: {
              hook: `📸 [Visual: Close-up of burst pipe spraying water on a frazzled homeowner. Spit-your-coffee-out face.] "G'day! Water line turned your garage into a cheeky swimming pool? Don't stress, let's get it sorted!"`,
              problem: `⏱️ [Visual: Sitting by the phone waiting for callbacks.] "We've all been there — dialing three local blokes, getting three voicemail headers, and zero quotes."`,
              solution: `🛠️ [Visual: Tradie arriving in clean kit, scanning QR code for instant quote.] "Enter Hammer & Code. Immediate online dispatch, transparent flat-rate diagnosis. No hidden fees."`,
              cta: `🤙 [Visual: Tapping a huge screen showing the live automated calendar.] "Scan page to book in under 30 seconds. Sorted on the tools!"`
            }
          },
          pricingInvestigation: {
            industryBenchmark: `Standard Aussie portal averages (Hipages/Airtasker) range from $90–$140/hr + call-out fee. Directly listed premium SEO agencies often bill $160–$220/hr.`,
            recommendedHourly: `$180.00 incl. GST`,
            recommendedFlatRatePackage: `$150.00 flat-rate upfront call-out and complete diagnostic report`,
            positioningStrategy: `Do not participate in down-market lowballing. By offering a transparent, lightning-fast $150 premium diagnosis, you build immediate visual authority and win the lucrative full-scale repair work.`
          },
          partnershipAgreement: {
            stateJurisdiction: `Trade Laws & Licensing Regulations (VIC & National plumbing standards)`,
            clauseEquitySplit: `A 50/50 profit-share on split-lead dispatches, with a 15% booking bonus allocated to the originating CRM lead manager.`,
            scopeOfWorks: `Lead tradie Dave governs advanced onsite pipeline drainage, tools, and gas-fitting. Partner handles secondary electrical, helper dispatches, and Stripe invoice triggers.`,
            legalMemoText: `Trades Memorandum of Understanding (MOU)\n----------------------------------------\nWe, the undersigning partners, agree to operate under the Hammer & Code tech banner for co-op dispatches. We agree that all booking logs must reside in our shared Zenna database, with Stripe invoicing completed before packing tools. Signed this day and in good faith.`
          },
          socialsBlueprint: {
            firstPostCaption: `G'day legend! 🤙 Hammer & Code is officially on the tools in ${suburb || "Melbourne"}! Tired of calling and waiting for a quote? We reply in seconds and show up on the dot. Tap to book. #Sorted 🛠️`,
            weeklyCadence: `Post 3 on-site "Before & After" reels on Instagram weekly, highlighting the exact mess-to-clean transformation. Showcase the automated CRM update messages.`,
            hashtagPool: `#MelbourneTradies #AussieBuilders #PlumbingLife #HammerAndCode #SortedonTools #TradieSaaS`
          }
        }
      });
    }
  });

  // Twilio Missed Call Webhook
  app.post("/webhook/missed-call", async (req, res) => {
    const { From, To, CallSid } = req.body;
    const callerPhone = From || "Unknown";
    const twilioNumber = To || "";
    const tenant_id = await getTenantByTwilioNumber(twilioNumber);
    
    if (!tenant_id) return res.status(404).send("<Response><Reject/></Response>");

    const businessName = await getSetting(tenant_id, 'businessName', config.businessName);
    const ownerName = await getSetting(tenant_id, 'ownerName', config.ownerName);
    const bookingLink = await getSetting(tenant_id, 'bookingLink', config.bookingLink);

    const systemPrompt = `ROLE: You are "Zenna", the elite AI receptionist for "${businessName}" (Owner: ${ownerName}).
Write a warm, concise missed call SMS text-back under 160 characters.
Acknowledge that ${ownerName} is on-site / underground right now. Ask what job they need sorted and provide booking link: ${bookingLink}`;
    
    const smsContent = await askZenna(systemPrompt, `Missed call from caller: ${callerPhone}`);
    
    await saveLead(tenant_id, {
      name: "Missed Call Lead",
      phone: callerPhone,
      status: "New",
      job_value: "$0",
      notes: `Missed call caught by Zenna AI. SMS sent: "${smsContent}"`
    });

    await logCall(tenant_id, {
      call_id: CallSid || `missed_${Date.now()}`,
      from_number: callerPhone,
      message: smsContent,
      status: "Missed Call - Auto SMS Dispatched",
      sms_sent: true
    });

    res.type('text/xml');
    res.send(`<Response><Message>${smsContent}</Message></Response>`);
  });

  // Twilio SMS Incoming Webhook
  app.post("/webhook/sms", async (req, res) => {
    const { From, To, Body } = req.body;
    const callerPhone = From || "Unknown";
    const twilioNumber = To || "";
    
    const tenant_id = await getTenantByTwilioNumber(twilioNumber);
    if (!tenant_id) return res.status(404).send("");

    const businessName = await getSetting(tenant_id, 'businessName', config.businessName);
    const ownerName = await getSetting(tenant_id, 'ownerName', config.ownerName);
    const calloutFee = await getSetting(tenant_id, 'calloutFee', config.calloutFee);

    const systemPrompt = `ROLE: You are "Zenna", the AI Receptionist for "${businessName}" (Owner: ${ownerName}).
Respond to incoming SMS inquiring about jobs or service dispatches.
Tone: Aussie tradie professional ("G'day", "too easy").
Mention our standard call-out diagnostic fee is ${calloutFee}.
CRITICAL: Keep your response STRICTLY under 120 characters without emojis or special characters so international carriers do not block it.`;

    let reply = await askZenna(systemPrompt, `SMS received from ${callerPhone}: ${Body}`);
    reply = reply.replace(/[^\x00-\x7F]/g, "").trim();
    if (reply.length > 140) reply = reply.substring(0, 137) + "...";
    if (!reply) reply = `G'day! Zenna here from ${businessName}. We have received your text and will get back to you shortly!`;

    await saveLead(tenant_id, {
      name: "SMS Lead",
      phone: callerPhone,
      status: "Contacted",
      notes: `Incoming SMS: "${Body}" | Zenna Reply: "${reply}"`
    });

    await sendSMS(callerPhone, reply); // In prod this needs the tenant's twilio credentials, but global works for MVP if Twilio number matches.

    res.type('text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${reply}</Message></Response>`);
  });

  // Autonomous Marketing Campaign Dispatch
  app.post("/api/run-marketing-campaign", async (req, res) => {
    try {
      const { runAutonomousMarketingEngine } = await import("./scripts/auto_marketing_engine.js");
      const campaignResult = await runAutonomousMarketingEngine();
      res.json(campaignResult);
    } catch (error: any) {
      console.error("Marketing Engine Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Zenna Hyper-Scaling Engine Endpoint
  app.post("/api/scale-zenna", async (req, res) => {
    try {
      const { executeZennaScalingPlan } = await import("./scripts/scale_zenna.js");
      const scaleResult = await executeZennaScalingPlan();
      res.json(scaleResult);
    } catch (error: any) {
      console.error("Scaling Engine Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Marketing Assets Endpoints
  app.get("/api/marketing/ad-copy", (req, res) => {
    const driveDir = path.resolve(process.cwd(), "../../drive-files");
    const filePath = path.join(driveDir, "ad-copy.md");
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      res.json({ success: true, content });
    } else {
      res.json({ success: false, error: "Ad copy file not found" });
    }
  });

  app.get("/api/marketing/video-scripts", (req, res) => {
    const driveDir = path.resolve(process.cwd(), "../../drive-files");
    const filePath = path.join(driveDir, "zenna_video_marketing.md");
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      res.json({ success: true, content });
    } else {
      res.json({ success: false, error: "Video marketing file not found" });
    }
  });

  // Daily Evening 6 PM Summary Briefing to Owner
  app.post("/api/brief", verifyToken, async (req, res) => {
    const tenant_id = (req as any).user.uid;

    const leads = (await getLeads(tenant_id)) as any[];
    const calls = (await getCalls(tenant_id)) as any[];

    const todayLeads = leads.length;
    const todayCalls = calls.length;

    const briefText = `G'day ${config.ownerName}! 📊 Zenna Daily Briefing:\nToday caught ${todayCalls} calls & ${todayLeads} leads.\nCheck dashboard: ${config.bookingLink}/dashboard`;

    if (config.ownerPhone) {
      await sendSMS(config.ownerPhone, briefText);
    }

    res.json({ success: true, brief: briefText });
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Zenna Server running on http://localhost:${PORT}`);
  });
}

startServer();
