import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DIST_DIR = path.join(__dirname, 'dist');
const DB_PATH = path.join(__dirname, 'zenna_db.json');

let cachedApplicants = [];

import { getAtomicDB, saveAtomicDB, createBackup } from './src/lib/atomicDb.mjs';

function getDB() {
  return getAtomicDB(DB_PATH);
}

function saveDB(data) {
  return saveAtomicDB(DB_PATH, data);
}

function scanCraigslistInbox() {
  return new Promise((resolve) => {
    exec('python3 scripts/poll_inbox_json.py', { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        console.warn('Inbox scan warning:', error.message);
        resolve({ error: error.message, applicants: cachedApplicants });
        return;
      }
      try {
        const data = JSON.parse(stdout.trim());
        cachedApplicants = data.applicants || [];
        resolve(data);
      } catch (e) {
        resolve({ error: 'Parse error', applicants: cachedApplicants });
      }
    });
  });
}

// Initial scan
scanCraigslistInbox().catch(() => {});

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

  // --- SPECIAL ROUTE: /outreach -> serve outreach.html ---
  if (pathname === '/outreach' || pathname === '/outreach/') {
    const outreachFile = path.join(DIST_DIR, 'outreach.html');
    if (fs.existsSync(outreachFile)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(outreachFile).pipe(res);
      return;
    }
  }

  // --- API ROUTES ---
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');

    if (pathname === '/api/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', product: 'Zenna', timestamp: new Date().toISOString() }));
      return;
    }

    if (pathname === '/api/outreach/applicants') {
      if (cachedApplicants.length === 0) {
        const scanRes = await scanCraigslistInbox();
        res.writeHead(200);
        res.end(JSON.stringify(scanRes));
        return;
      }
      res.writeHead(200);
      res.end(JSON.stringify({ applicants: cachedApplicants, total: cachedApplicants.length }));
      return;
    }

    if (pathname === '/api/outreach/poll') {
      const scanRes = await scanCraigslistInbox();
      res.writeHead(200);
      res.end(JSON.stringify(scanRes));
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
          confirmedValue: confirmedValue,
          newLeads: leads.length,
          callsCaught: calls.length,
          actionRequired: leads.length === 0 ? "System operational. Standing by for incoming calls." : "Review active leads and customer dispatches"
        }
      }));
      return;
    }

    if (pathname === '/api/business-config') {
      const db = getDB();
      if (req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
          businessName: db.settings?.businessName || process.env.BUSINESS_NAME || 'Hammer & Code',
          ownerName: db.settings?.ownerName || process.env.OWNER_NAME || 'Joshua Harris',
          ownerPhone: db.settings?.ownerPhone || process.env.OWNER_PHONE || '+64 20 4115 3617',
          calloutFee: db.settings?.calloutFee || process.env.CALLOUT_FEE || '$150',
          bookingLink: db.settings?.bookingLink || process.env.BOOKING_LINK || 'https://zenna.au/book',
          region: db.settings?.region || 'NZ',
          currency: db.settings?.currency || 'NZD',
          plan: db.settings?.plan || 'Solo Tradie ($199/mo)',
          subscriptionStatus: db.settings?.subscriptionStatus || 'Active',
          forwardingNumberNZ: db.settings?.forwardingNumberNZ || '+64 20 4115 3617',
          forwardingNumberAU: db.settings?.forwardingNumberAU || '+61 412 345 678'
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

    if (pathname === '/api/telephony/status') {
      const username = process.env.CLICKSEND_USERNAME || 'jsaharris@gmail.com';
      const apiKey = process.env.CLICKSEND_API_KEY || '6F28976A-8EEB-6C9A-46C9-E8FB3DE5EAF1';

      try {
        const authHeader = 'Basic ' + Buffer.from(`${username}:${apiKey}`).toString('base64');
        const response = await fetch('https://rest.clicksend.com/v3/account', {
          headers: { 'Authorization': authHeader }
        });
        const data = await response.json();
        res.writeHead(200);
        res.end(JSON.stringify({
          status: data.http_code === 200 ? 'HEALTHY' : 'DEGRADED',
          provider: 'CLICKSEND',
          balance: data.data?.balance || '0.00',
          currency: data.data?._currency?.currency_name_short || 'NZD',
          accountName: data.data?.account_name || 'Zenna',
          failoverReady: true
        }));
      } catch (err) {
        res.writeHead(200);
        res.end(JSON.stringify({
          status: 'DEGRADED',
          provider: 'CLICKSEND',
          error: err.message,
          failoverReady: true
        }));
      }
      return;
    }

    if (pathname === '/api/sms/send' && req.method === 'POST') {
      const body = await parseBody(req);
      const rawTo = body.to || '+642041153617';
      const message = body.message || "G'day! This is Zenna AI catching your missed call in < 3s.";

      // E.164 Normalization
      let target = rawTo.trim().replace(/[\s\-\(\)\.\,\/]/g, '');
      if (target.startsWith('0') && target.startsWith('02')) {
        target = '+64' + target.slice(1);
      } else if (target.startsWith('04')) {
        target = '+61' + target.slice(1);
      } else if (target.startsWith('64') && !target.startsWith('+')) {
        target = '+' + target;
      } else if (target.startsWith('61') && !target.startsWith('+')) {
        target = '+' + target;
      } else if (!target.startsWith('+')) {
        target = '+64' + target.replace(/^0+/, '');
      }

      const username = process.env.CLICKSEND_USERNAME || 'jsaharris@gmail.com';
      const apiKey = process.env.CLICKSEND_API_KEY || '6F28976A-8EEB-6C9A-46C9-E8FB3DE5EAF1';

      try {
        const authHeader = 'Basic ' + Buffer.from(`${username}:${apiKey}`).toString('base64');
        const response = await fetch('https://rest.clicksend.com/v3/sms/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify({
            messages: [
              {
                to: target,
                body: message,
                source: 'zenna-speed-to-lead'
              }
            ]
          })
        });
        const result = await response.json();
        res.writeHead(200);
        res.end(JSON.stringify({
          success: result.http_code === 200,
          provider: 'CLICKSEND',
          normalizedTo: target,
          result
        }));
        return;
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, normalizedTo: target, error: err.message }));
        return;
      }
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

    // Default fallback
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
