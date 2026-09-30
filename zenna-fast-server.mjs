import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DIST_DIR = path.join(__dirname, 'dist');
const DB_PATH = path.join(__dirname, 'zenna_db.json');

function getDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { leads: [], calls: [], settings: {}, tenants: {} };
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch (err) {
    return { leads: [], calls: [], settings: {}, tenants: {} };
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to save DB:', err);
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

async function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({ raw: body });
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- API ROUTES ---
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');

    if (pathname === '/api/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', product: 'Zenna', timestamp: new Date().toISOString() }));
      return;
    }

    if (pathname === '/api/leads') {
      const db = getDB();
      if (req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify(db.leads || []));
        return;
      }
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const newLead = {
          id: 'lead_' + Date.now(),
          tenant_id: 'default',
          name: body.name || 'Caller',
          phone: body.phone || '',
          status: body.status || 'New Lead',
          job_value: body.job_value || body.value || '$500',
          city: body.city || 'Christchurch',
          notes: body.notes || 'Inbound lead captured via Zenna UI',
          created_at: new Date().toISOString()
        };
        db.leads = [newLead, ...(db.leads || [])];
        saveDB(db);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, lead: newLead }));
        return;
      }
    }

    if (pathname === '/api/calls') {
      const db = getDB();
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, calls: db.calls || [] }));
      return;
    }

    if (pathname === '/api/stats') {
      const db = getDB();
      const leads = db.leads || [];
      const calls = db.calls || [];
      const confirmedValue = leads.reduce((acc, current) => {
        const val = parseInt(String(current.job_value || '$0').replace(/[^0-9]/g, '')) || 0;
        return val + acc;
      }, 0);

      res.writeHead(200);
      res.end(JSON.stringify({
        today: {
          confirmedValue: confirmedValue || 18500,
          newLeads: leads.length,
          callsCaught: calls.length || leads.length,
          actionRequired: "Review upcoming schedule and site diagnostic dispatches"
        }
      }));
      return;
    }

    if (pathname === '/api/business-config') {
      const db = getDB();
      if (req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
          businessName: db.settings?.businessName || 'Zenna by Hammer & Code',
          ownerName: db.settings?.ownerName || 'Dave Hartley',
          ownerPhone: db.settings?.ownerPhone || '+64 20 4115 3617',
          calloutFee: db.settings?.calloutFee || '$150',
          bookingLink: db.settings?.bookingLink || 'https://zenna.au/book',
          region: db.settings?.region || 'NZ',
          currency: db.settings?.currency || 'NZD',
          plan: db.settings?.plan || 'Solo Tradie ($199/mo)',
          subscriptionStatus: db.settings?.subscriptionStatus || 'Active (7-Day Trial)',
          twilioForwardingNumberNZ: db.settings?.twilioForwardingNumberNZ || '+6421912345',
          twilioForwardingNumberAU: db.settings?.twilioForwardingNumberAU || '+61291234567'
        }));
        return;
      }
      if (req.method === 'POST') {
        const body = await parseBody(req);
        db.settings = { ...(db.settings || {}), ...body };
        saveDB(db);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: 'Configuration saved', config: db.settings }));
        return;
      }
    }

    if (pathname === '/api/ask') {
      const body = await parseBody(req);
      const question = body.question || body.userMessage || '';
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        text: `G'day! I'm Zenna, your AI receptionist. I've logged your request: "${question.substring(0, 80)}". Our team will follow up promptly!`,
        source: 'zenna-engine'
      }));
      return;
    }

    if (pathname === '/api/draft-quote') {
      const body = await parseBody(req);
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        quote: {
          id: 'QT-' + Math.floor(1000 + Math.random() * 9000),
          client: body.name || 'Valued Client',
          items: [
            { desc: 'Emergency Callout & Diagnosis', amount: 150 },
            { desc: 'Plumbing / HVAC Labor (Standard)', amount: 350 }
          ],
          total: 500,
          currency: 'NZD'
        }
      }));
      return;
    }

    if (pathname === '/api/simulate-call') {
      const body = await parseBody(req);
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        lookupGreeting: `Identified caller (${body.phone || 'Unknown'}).`,
        voiceScript: `G'day! Thanks for calling Hartley Plumbing. This is Zenna, Dave's AI receptionist. How can I help you out today?`,
        callLog: {
          id: 'call_' + Date.now(),
          phone: body.phone || '+64 20 4115 3617',
          timestamp: new Date().toISOString(),
          status: 'Handled by Zenna AI'
        }
      }));
      return;
    }

    if (pathname.startsWith('/api/voice/')) {
      res.writeHead(200);
      res.end(JSON.stringify({
        session_id: 'sess_' + Date.now(),
        status: 'active',
        ai_reply: "G'day! Zenna is listening live."
      }));
      return;
    }

    if (pathname === '/api/marketing/ad-copy' || pathname === '/api/marketing/video-scripts') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        items: [
          { title: 'Emergency Trade Missed Calls Ad', hook: 'Never lose a $1,200 plumbing job while under the sink.' },
          { title: 'Tradie Freedom Script', hook: 'Zenna answers 24/7, quotes instantly, and books the calendar.' }
        ]
      }));
      return;
    }

    // Default fallback for any other API route
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, message: 'OK' }));
    return;
  }

  // --- STATIC ASSET SERVING ---
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  let filePath = path.join(DIST_DIR, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // SPA fallback
    const indexPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(indexPath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡ Zenna UI Server running on http://localhost:${PORT}`);
});
