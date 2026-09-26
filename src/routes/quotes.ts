import { Router, Request, Response } from 'express';
import { askZenna } from './voice.js';
import { generateTaxInvoice, calculateTax, InvoiceItemInput, BuyerDetails } from '../services/tax.js';
import { getTenant } from '../../db.js';

export const quotesRouter = Router();

const config = {
  businessName: process.env.BUSINESS_NAME || 'Hartley Plumbing & Drainage',
  ownerName: process.env.OWNER_NAME || 'Dave'
};

// POST /api/quotes/draft-quote or /api/quotes/draft
quotesRouter.post(['/draft-quote', '/draft', '/'], async (req: Request, res: Response) => {
  const { clientName, clientNotes, phone } = req.body;
  if (!clientName || !clientNotes) {
    return res.status(400).json({ error: 'Client name and project notes are required' });
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
    const responseText = await askZenna(systemPrompt, 'Synthesize tech scoping quote file.');
    
    let cleaned = responseText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.substring(7);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }
    cleaned = cleaned.trim();
    
    const parsedQuote = JSON.parse(cleaned);
    res.json({ success: true, quote: parsedQuote });
  } catch (error) {
    console.error('Quote Synthesis Error:', error);
    res.json({
      success: true,
      quote: {
        intro: `G'day ${clientName}, here is the initial scoping estimate for ${config.businessName} to kick off building your app: ${clientNotes}.`,
        items: [
          { description: 'Interactive React Frontend & UI/UX wireframes', price: '$2,850.00' },
          { description: 'Database design, secure Firestore endpoints, and server configuration', price: '$3,500.00' }
        ],
        gst: '$635.00',
        total: '$6,985.00',
        warranty: 'All code commits are fully covered by a 12-month quality assurance warrantee and responsive support.',
        actionRequired: 'Initialize workspace repo and run initial developer scoping meeting.'
      }
    });
  }
});

// POST /api/quotes/route-dispatch
quotesRouter.post('/route-dispatch', async (req: Request, res: Response) => {
  const { clientName, clientNotes } = req.body;
  if (!clientName || !clientNotes) {
    return res.status(400).json({ error: 'Client details are required for developer dispatching.' });
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
    const responseText = await askZenna(systemPrompt, 'Calculate optimized staging environment build checklist.');
    
    let cleaned = responseText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.substring(7);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }
    cleaned = cleaned.trim();

    const parsedDispatch = JSON.parse(cleaned);
    res.json({ success: true, dispatch: parsedDispatch });
  } catch (error) {
    console.error('Dispatch Calculation Error:', error);
    res.json({
      success: true,
      dispatch: {
        travelMinutes: '12 mins',
        distanceKm: '8.4 MB size',
        dispatchZone: 'Cloud Staging Sandbox - Asia-East',
        toolsRequired: [
          'Vite + React Static Framework',
          'Tailwind UI Utility Configuration',
          'Firestore Database Schema & Firebase Auth Rules',
          'Stripe Subscription Webhook Listeners'
        ],
        clientAlertDraft: `G'day ${clientName}, Zenna here from Zenna App Studio. CRM synced! We've provisioned your new dev repo workspace. Let's make it happen. 🤙`
      }
    });
  }
});

// POST /api/quotes/tax-invoice
quotesRouter.post('/tax-invoice', async (req: Request, res: Response) => {
  try {
    const tenantId = (req as any).user?.uid || req.body.tenantId;
    let tenant = tenantId ? await getTenant(tenantId) : null;

    if (!tenant) {
      tenant = {
        country_code: req.body.country_code || 'AU',
        is_gst_registered: req.body.is_gst_registered !== undefined ? Boolean(req.body.is_gst_registered) : true,
        abn: req.body.abn || '44 912 044 112',
        nzbn: req.body.nzbn,
        gst_number: req.body.gst_number,
        businessName: req.body.businessName || config.businessName,
        ownerName: req.body.ownerName || config.ownerName
      };
    }

    const items: InvoiceItemInput[] = req.body.items || [];
    const buyer: BuyerDetails | undefined = req.body.buyer;
    const invoice = generateTaxInvoice(tenant, items, buyer, req.body.options);

    res.json({ success: true, invoice });
  } catch (err: any) {
    console.error('Tax Invoice Generation Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/quotes/calculate-tax
quotesRouter.post('/calculate-tax', (req: Request, res: Response) => {
  const { subtotal, country_code, is_gst_registered } = req.body;
  if (subtotal === undefined) {
    return res.status(400).json({ error: 'Subtotal is required' });
  }

  const taxResult = calculateTax(Number(subtotal), {
    country_code: country_code || 'AU',
    is_gst_registered: is_gst_registered !== undefined ? Boolean(is_gst_registered) : true
  });

  res.json({ success: true, ...taxResult });
});
