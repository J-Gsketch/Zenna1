import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // --- CRM & STATE (In-Memory for now) ---
  const crm = {
    leads: [
      { name: 'Mike Torrence', phone: '+61 412 891 044', status: 'New', value: '$12,500', time: '2:14 PM', notes: 'Pending proposal on custom mobile SaaS MVP and stripe backend billing workflow.' },
      { name: 'Sandra Wu', phone: '+61 423 044 112', status: 'Scheduled', value: '$1,800', time: '11:32 AM', notes: 'Scheduled developer scoping block for React web app launch tomorrow morning.' },
      { name: 'Daniel Nguyen', phone: '+61 401 553 221', status: 'Won', value: '$8,000', time: '8:45 AM', notes: 'Successfully deployed AI Assistant portal. Highly satisfied repeat enterprise client.' },
    ],
    calls: [
      { id: '1', from: '+61 412 891 044', timestamp: new Date(Date.now() - 3600000).toISOString(), duration: '45s', status: 'Caught & Notified' },
      { id: '2', from: '+61 423 044 112', timestamp: new Date(Date.now() - 7200000).toISOString(), duration: '1m 20s', status: 'Live Personalized Response' }
    ],
    config: {
      businessName: process.env.BUSINESS_NAME || "Zenna App Studio",
      ownerName: process.env.OWNER_NAME || "Operator",
      ownerPhone: process.env.OWNER_PHONE || "",
      bookingLink: process.env.BOOKING_LINK || "https://calendly.com/zenna-app-studio",
    }
  };

  // Helper helper to normalize numbers for uniform lookups
  function normalizePhone(num: string): string {
    return num.replace(/\D/g, '').replace(/^61/, '0').replace(/^00/, '0');
  }

  // --- AI LOGIC (Gemini) ---
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  async function askZenna(systemPrompt: string, userMessage: string) {
    try {
      const result = await model.generateContent([
        { text: `${systemPrompt}\n\nUser: ${userMessage}` }
      ]);
      return result.response.text();
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Hello! Zenna here. We've got your number, and we will get right back to you.";
    }
  }

  // --- API ROUTES ---
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", product: "Zenna" });
  });

  app.get("/api/stats", (req, res) => {
    res.json({
      today: {
        confirmedValue: crm.leads.reduce((acc, current) => {
          const val = parseInt(current.value.replace(/[^0-9]/g, '')) || 0;
          return val + acc;
        }, 0),
        newLeads: crm.leads.length,
        callsCaught: crm.calls.length,
        actionRequired: "Review Mike T. custom SaaS MVP wireframe"
      }
    });
  });

  app.get("/api/leads", (req, res) => {
    res.json(crm.leads);
  });

  app.post("/api/leads", (req, res) => {
    const { name, phone, value, status, notes } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: "Name and phone are required" });
    }
    const newLead = {
      name,
      phone,
      value: value || "$0",
      status: status || "New",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: notes || "Manual CRM entry"
    };
    crm.leads.push(newLead);
    res.json({ success: true, lead: newLead });
  });

  // Client lookup endpoint by phone
  app.get("/api/lookup", (req, res) => {
    const phoneQuery = req.query.phone as string;
    if (!phoneQuery) {
      return res.status(400).json({ error: "Phone query parameter is required" });
    }

    const normQuery = normalizePhone(phoneQuery);
    const matched = crm.leads.find(lead => normalizePhone(lead.phone) === normQuery || normQuery.includes(normalizePhone(lead.phone)) || normalizePhone(lead.phone).includes(normQuery));

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
  app.post("/api/simulate-call", async (req, res) => {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Phone is required for call simulation" });
    }

    const normQuery = normalizePhone(phone);
    const matched = crm.leads.find(lead => normalizePhone(lead.phone) === normQuery || normQuery.includes(normalizePhone(lead.phone)) || normalizePhone(lead.phone).includes(normQuery));

    let clientContext = "";
    let lookupGreeting = "";

    if (matched) {
      clientContext = `CRM LOOKUP MATCHED:
Name: ${matched.name}
Phone: ${matched.phone}
Project/Notes: ${matched.notes}
Current Status: ${matched.status}
Value: ${matched.value}`;
      
      lookupGreeting = `Recognised existing customer ${matched.name}.`;
    } else {
      clientContext = `CRM LOOKUP:
Name: Unrecognised / New Caller
Phone: ${phone}
This caller is not in your CRM directory yet. Introduce yourself as Zenna, collect their name and job details beautifully.`;
      
      lookupGreeting = `Identified new potential caller.`;
    }

    const systemPrompt = `You are Zenna, the ultra-smart voice AI receptionist for ${crm.config.businessName} (owner: ${crm.config.ownerName}).
    You are on the line taking a live voice call. Use the CRM database lookup info provided below to customize your response contextually.
    
    CRITICAL: 
    - If they are an existing client, greet them by their name, refer directly to their current project status/notes, and offer specific updates. DO NOT pretend you do not know them.
    - If they are dynamic or new, be warm, introduce the business, and ask what custom software, mobile app, or SaaS idea they'd like to build.
    
    ${clientContext}

    Keep the response highly realistic, spoken, professional but warm (not robotic). Speak in 1-2 smooth, conversational sentences suitable for a live phone conversation. Keep it within 35-50 words. No robotic lists.`;

    const voiceScript = await askZenna(systemPrompt, "The customer has dialed in and call is answered live.");
    
    // Log calls caught
    const newCall = {
      id: String(crm.calls.length + 1),
      from: phone,
      timestamp: new Date().toISOString(),
      duration: '45s',
      status: matched ? 'Live Personalized Answer' : 'Call Logged & Handled'
    };
    crm.calls.push(newCall);

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
      call: newCall
    });
  });

  app.post("/api/ask", async (req, res) => {
    const { question } = req.body;
    const stats = {
      confirmedToday: 4200,
      newLeads: crm.leads.length,
      pipelineValue: 14500
    };
    
    const systemPrompt = `You are Zenna, a business assistant for ${crm.config.ownerName} at ${crm.config.businessName}. 
    Answer questions about the business based on this context: ${JSON.stringify(stats)}. 
    Be concise, warm, and chief-of-staff professional.`;
    
    const answer = await askZenna(systemPrompt, question);
    res.json({ answer });
  });

  // --- BRAND NEW: INSTANT SOFTWARE MVP QUOTES & SAAS RUNTIME ONBOARDINGS ---

  // Generate an instant structured quote drafted by Zenna
  app.post("/api/draft-quote", async (req, res) => {
    const { clientName, clientNotes, phone } = req.body;
    if (!clientName || !clientNotes) {
      return res.status(400).json({ error: "Client name and project notes are required" });
    }

    const systemPrompt = `You are Zenna, the AI Elite workflow assistant for ${crm.config.businessName}.
    Given the client "${clientName}" and their project request: "${clientNotes}".
    Create a highly realistic, professional, formatted Australian software development and app scoping quote (GST inclusive 10%).
    
    Structure the output as a JSON object containing:
    1. "intro": A warm, professional introductory note addressed to ${clientName} mentioning ${crm.config.businessName}.
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
          intro: `G'day ${clientName}, here is the initial scoping estimate for ${crm.config.businessName} to kick off building your app: ${clientNotes}.`,
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

    const systemPrompt = `You are Zenna, the lead DevOps and delivery coordinator for ${crm.config.businessName}.
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
    const { From, CallSid } = req.body;
    console.log(`Missed call from: ${From}`);

    const systemPrompt = `You are Zenna, the AI receptionist for ${crm.config.businessName}. 
    Write a warm, professional missed call SMS response. Under 160 characters. 
    Mention that you'll call them back soon or they can text back with their inquiry.
    ${crm.config.bookingLink ? `If they want to book a time directly, include this link: ${crm.config.bookingLink}` : ""}`;
    
    const smsContent = await askZenna(systemPrompt, "The owner missed a call from this person.");
    
    // In a real app, we'd call Twilio API here.
    // For now, we log it.
    const newLead = {
      name: "Unknown Caller",
      phone: From || "Unknown",
      value: "$0",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "New",
      notes: "Missed call caught by Zenna",
      smsSent: smsContent
    };
    
    crm.leads.push(newLead);
    crm.calls.push({ id: CallSid, from: From || "Unknown", timestamp: new Date().toISOString(), duration: 'N/A', status: 'Missed' });

    res.json({ success: true, message: smsContent });
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
