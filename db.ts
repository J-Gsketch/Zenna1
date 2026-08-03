import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'zenna_db.json');

export interface Lead {
  phone: string;
  name: string;
  status: string;
  job_value: string;
  notes: string;
  created_at: string;
  last_reply?: string;
}

export interface CallLog {
  id: string;
  call_id: string;
  from_number: string;
  timestamp: string;
  message: string;
  status: string;
  sms_sent: boolean;
}

interface DBData {
  leads: Lead[];
  calls: CallLog[];
  settings: Record<string, string>;
}

const defaultData: DBData = {
  leads: [
    { phone: '+61412891044', name: 'Mike Torrence', status: 'New', job_value: '$12,500', notes: 'Pending proposal on custom mobile SaaS MVP and stripe backend billing workflow.', created_at: new Date().toISOString() },
    { phone: '+61423044112', name: 'Sandra Wu', status: 'Scheduled', job_value: '$1,800', notes: 'Scheduled developer scoping block for React web app launch tomorrow morning.', created_at: new Date().toISOString() },
    { phone: '+61401553221', name: 'Daniel Nguyen', status: 'Won', job_value: '$8,000', notes: 'Successfully deployed AI Assistant portal. Highly satisfied repeat enterprise client.', created_at: new Date().toISOString() }
  ],
  calls: [
    { id: '1', call_id: 'c-101', from_number: '+61412891044', timestamp: new Date(Date.now() - 3600000).toISOString(), message: 'Missed call from Mike Torrence', status: 'Caught & Notified', sms_sent: true },
    { id: '2', call_id: 'c-102', from_number: '+61423044112', timestamp: new Date(Date.now() - 7200000).toISOString(), message: 'Live AI reception response', status: 'Live Personalized Response', sms_sent: true }
  ],
  settings: {}
};

function readDB(): DBData {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const raw = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading zenna_db.json, using defaults:', err);
    return defaultData;
  }
}

function writeDB(data: DBData) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing zenna_db.json:', err);
  }
}

export function initDB() {
  const data = readDB();
  console.log('⚡ Pure JSON Database initialized at:', dbPath, `(${data.leads.length} leads loaded)`);
}

export function getLeads(): Lead[] {
  return readDB().leads;
}

export function saveLead(lead: { phone: string; name: string; status?: string; job_value?: string; notes?: string }) {
  const data = readDB();
  const existingIdx = data.leads.findIndex(l => l.phone === lead.phone);
  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    data.leads[existingIdx] = {
      ...data.leads[existingIdx],
      name: lead.name || data.leads[existingIdx].name,
      status: lead.status || data.leads[existingIdx].status,
      job_value: lead.job_value || data.leads[existingIdx].job_value,
      notes: lead.notes || data.leads[existingIdx].notes,
      last_reply: now
    };
  } else {
    data.leads.unshift({
      phone: lead.phone,
      name: lead.name,
      status: lead.status || 'New',
      job_value: lead.job_value || '$0',
      notes: lead.notes || '',
      created_at: now
    });
  }

  writeDB(data);
}

export function getCalls(): CallLog[] {
  return readDB().calls;
}

export function logCall(call: { call_id?: string; from_number: string; message: string; status: string; sms_sent?: boolean }) {
  const data = readDB();
  const newCall: CallLog = {
    id: String(data.calls.length + 1),
    call_id: call.call_id || `call_${Date.now()}`,
    from_number: call.from_number,
    timestamp: new Date().toISOString(),
    message: call.message,
    status: call.status,
    sms_sent: call.sms_sent ?? false
  };

  data.calls.unshift(newCall);
  writeDB(data);
}

export function getSetting(key: string, defaultValue: string = ''): string {
  const data = readDB();
  return data.settings[key] ?? defaultValue;
}

export function setSetting(key: string, value: string) {
  const data = readDB();
  data.settings[key] = value;
  writeDB(data);
}
