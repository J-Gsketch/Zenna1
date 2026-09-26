import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

let db: FirebaseFirestore.Firestore | null = null;
let isFirestoreAvailable = false;
let isInitialized = false;

export function getLocalDBPath(): string {
  return process.env.ZENNA_DB_PATH || path.join(process.cwd(), 'zenna_db.json');
}

export interface Tenant {
  id?: string;
  country_code: 'AU' | 'NZ';
  is_gst_registered: boolean;
  abn?: string;
  nzbn?: string;
  gst_number?: string;
  businessName?: string;
  ownerName?: string;
  ownerPhone?: string;
  twilio_number?: string;
  status?: string;
  stripeCustomerId?: string;
  subscriptionId?: string;
  phoneNumber?: string;
  updatedAt?: string;
  settings?: Record<string, string>;
  [key: string]: any;
}

export interface Lead {
  tenant_id: string;
  phone: string;
  name: string;
  status: string;
  job_value: string;
  notes: string;
  created_at: string;
  last_reply?: string;
}

export interface CallLog {
  tenant_id: string;
  id: string;
  call_id: string;
  from_number: string;
  timestamp: string;
  message: string;
  status: string;
  sms_sent: boolean;
}

// --- LOCAL JSON FILE STORE HELPERS ---
function readLocalDB(): {
  leads: Lead[];
  calls: CallLog[];
  settings: Record<string, string>;
  tenants: Record<string, Tenant>;
  processed_events?: string[];
} {
  const dbPath = getLocalDBPath();
  try {
    if (!fs.existsSync(dbPath)) {
      const initial = { leads: [], calls: [], settings: {}, tenants: {}, processed_events: [] };
      fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2));
      return initial;
    }
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    return {
      leads: data.leads || [],
      calls: data.calls || [],
      settings: data.settings || {},
      tenants: data.tenants || {},
      processed_events: data.processed_events || []
    };
  } catch {
    return { leads: [], calls: [], settings: {}, tenants: {}, processed_events: [] };
  }
}

function writeLocalDB(data: any) {
  const dbPath = getLocalDBPath();
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing to local JSON store:', err);
  }
}

export async function isEventProcessed(eventId: string): Promise<boolean> {
  await initDB();
  if (isFirestoreAvailable && db) {
    try {
      const doc = await db.collection('processed_events').doc(eventId).get();
      return doc.exists;
    } catch {
      isFirestoreAvailable = false;
    }
  }

  const local = readLocalDB();
  return (local.processed_events || []).includes(eventId);
}

export async function markEventProcessed(eventId: string): Promise<void> {
  await initDB();
  if (isFirestoreAvailable && db) {
    try {
      await db.collection('processed_events').doc(eventId).set({
        processedAt: new Date().toISOString()
      });
      return;
    } catch {
      isFirestoreAvailable = false;
    }
  }

  const local = readLocalDB();
  if (!local.processed_events) {
    local.processed_events = [];
  }
  if (!local.processed_events.includes(eventId)) {
    local.processed_events.push(eventId);
    writeLocalDB(local);
  }
}

export async function initDB() {
  if (isInitialized) return;
  isInitialized = true;

  if (process.env.LOCAL_RUN === 'true') {
    isFirestoreAvailable = false;
    console.log(`⚡ Zenna Local DB Store active (LOCAL_RUN=true)`);
    return;
  }

  try {
    if (!getApps().length) {
      initializeApp({
        projectId: process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT || 'device-streaming-fdd55bb7'
      });
    }
    db = getFirestore('zenna-db');
    isFirestoreAvailable = true;
    console.log(`⚡ Firestore Database connected (Multi-Tenant Mode)`);
  } catch (err: any) {
    console.warn(`[DB Gateway] Firestore unavailable (${err.message}). Using local JSON store.`);
    isFirestoreAvailable = false;
  }
}

export async function getLeads(tenant_id: string): Promise<Lead[]> {
  await initDB();
  if (isFirestoreAvailable && db) {
    try {
      const snap = await db.collection('leads')
        .where('tenant_id', '==', tenant_id)
        .orderBy('created_at', 'desc')
        .get();
      return snap.docs.map(d => d.data() as Lead);
    } catch {
      isFirestoreAvailable = false;
    }
  }

  const local = readLocalDB();
  return (local.leads || []).filter(l => !l.tenant_id || l.tenant_id === tenant_id);
}

export async function saveLead(tenant_id: string, lead: { phone: string; name: string; status?: string; job_value?: string; notes?: string }) {
  await initDB();
  const now = new Date().toISOString();

  if (isFirestoreAvailable && db) {
    try {
      const snap = await db.collection('leads')
        .where('tenant_id', '==', tenant_id)
        .where('phone', '==', lead.phone)
        .limit(1)
        .get();

      if (!snap.empty) {
        const docRef = snap.docs[0].ref;
        await docRef.update({
          name: lead.name || snap.docs[0].data().name,
          status: lead.status || snap.docs[0].data().status,
          notes: lead.notes || snap.docs[0].data().notes,
          job_value: lead.job_value || snap.docs[0].data().job_value,
          last_reply: now
        });
        return;
      } else {
        await db.collection('leads').add({
          tenant_id,
          phone: lead.phone,
          name: lead.name || 'Caller',
          status: lead.status || 'New',
          job_value: lead.job_value || '$0',
          notes: lead.notes || '',
          created_at: now
        });
        return;
      }
    } catch {
      isFirestoreAvailable = false;
    }
  }

  const local = readLocalDB();
  const existingIdx = local.leads.findIndex(l => (!l.tenant_id || l.tenant_id === tenant_id) && l.phone === lead.phone);
  if (existingIdx >= 0) {
    local.leads[existingIdx] = {
      ...local.leads[existingIdx],
      name: lead.name || local.leads[existingIdx].name,
      status: lead.status || local.leads[existingIdx].status,
      notes: lead.notes || local.leads[existingIdx].notes,
      job_value: lead.job_value || local.leads[existingIdx].job_value,
      last_reply: now
    };
  } else {
    local.leads.unshift({
      tenant_id,
      phone: lead.phone,
      name: lead.name || 'Caller',
      status: lead.status || 'New',
      job_value: lead.job_value || '$0',
      notes: lead.notes || '',
      created_at: now
    });
  }
  writeLocalDB(local);
}

export async function getCalls(tenant_id: string): Promise<CallLog[]> {
  await initDB();
  if (isFirestoreAvailable && db) {
    try {
      const snap = await db.collection('calls')
        .where('tenant_id', '==', tenant_id)
        .orderBy('timestamp', 'desc')
        .get();
      return snap.docs.map(d => d.data() as CallLog);
    } catch {
      isFirestoreAvailable = false;
    }
  }

  const local = readLocalDB();
  return (local.calls || []).filter(c => !c.tenant_id || c.tenant_id === tenant_id);
}

export async function logCall(tenant_id: string, call: { call_id?: string; from_number: string; message: string; status: string; sms_sent?: boolean }) {
  await initDB();
  const idStr = Date.now().toString();
  const finalCall: CallLog = {
    tenant_id,
    id: idStr,
    call_id: call.call_id || `call_${idStr}`,
    from_number: call.from_number,
    timestamp: new Date().toISOString(),
    message: call.message,
    status: call.status,
    sms_sent: Boolean(call.sms_sent)
  };

  if (isFirestoreAvailable && db) {
    try {
      await db.collection('calls').doc(finalCall.id).set(finalCall);
      return;
    } catch {
      isFirestoreAvailable = false;
    }
  }

  const local = readLocalDB();
  local.calls.unshift(finalCall);
  writeLocalDB(local);
}

export async function getSetting(tenant_id: string, key: string, defaultValue: string = ''): Promise<string> {
  await initDB();
  if (isFirestoreAvailable && db) {
    try {
      const doc = await db.collection('tenants').doc(tenant_id).collection('settings').doc(key).get();
      if (doc.exists) {
        return doc.data()?.value || defaultValue;
      }
      return defaultValue;
    } catch {
      isFirestoreAvailable = false;
    }
  }

  const local = readLocalDB();
  return local.settings[`${tenant_id}_${key}`] || local.settings[key] || defaultValue;
}

export async function setSetting(tenant_id: string, key: string, value: string) {
  await initDB();
  if (isFirestoreAvailable && db) {
    try {
      await db.collection('tenants').doc(tenant_id).collection('settings').doc(key).set({ value }, { merge: true });
      return;
    } catch {
      isFirestoreAvailable = false;
    }
  }

  const local = readLocalDB();
  local.settings[`${tenant_id}_${key}`] = value;
  writeLocalDB(local);
}

export async function getTenantByTwilioNumber(twilioNumber: string): Promise<string | null> {
  await initDB();
  if (isFirestoreAvailable && db) {
    try {
      const snap = await db.collection('tenants')
        .where('twilio_number', '==', twilioNumber)
        .limit(1)
        .get();
      if (!snap.empty) return snap.docs[0].id;
    } catch {
      isFirestoreAvailable = false;
    }
  }

  const local = readLocalDB();
  for (const [id, tenant] of Object.entries(local.tenants)) {
    if (tenant.twilio_number === twilioNumber) return id;
  }
  return 'default_tenant';
}

export async function getTenant(tenant_id: string): Promise<Tenant | null> {
  await initDB();
  if (isFirestoreAvailable && db) {
    try {
      const doc = await db.collection('tenants').doc(tenant_id).get();
      if (doc.exists) return { id: doc.id, ...doc.data() } as Tenant;
    } catch {
      isFirestoreAvailable = false;
    }
  }

  const local = readLocalDB();
  return local.tenants[tenant_id] || {
    id: tenant_id,
    country_code: 'AU',
    is_gst_registered: true,
    businessName: 'Hartley Plumbing & Drainage',
    ownerName: 'Dave'
  };
}

export async function saveTenant(tenant_id: string, data: Partial<Tenant>) {
  await initDB();
  const updatedAt = new Date().toISOString();

  if (isFirestoreAvailable && db) {
    try {
      await db.collection('tenants').doc(tenant_id).set({
        ...data,
        updatedAt
      }, { merge: true });
      return;
    } catch {
      isFirestoreAvailable = false;
    }
  }

  const local = readLocalDB();
  local.tenants[tenant_id] = {
    ...(local.tenants[tenant_id] || { id: tenant_id, country_code: 'AU', is_gst_registered: true }),
    ...data,
    updatedAt
  };
  writeLocalDB(local);
}

export async function cancelTenantBySubscriptionOrCustomer(subscriptionId?: string, customerId?: string): Promise<string | null> {
  await initDB();
  const updatedAt = new Date().toISOString();

  if (isFirestoreAvailable && db) {
    try {
      if (subscriptionId) {
        const subSnap = await db.collection('tenants').where('subscriptionId', '==', subscriptionId).limit(1).get();
        if (!subSnap.empty) {
          await subSnap.docs[0].ref.set({ status: 'canceled', updatedAt }, { merge: true });
          return subSnap.docs[0].id;
        }
      }
      if (customerId) {
        const custSnap = await db.collection('tenants').where('stripeCustomerId', '==', customerId).limit(1).get();
        if (!custSnap.empty) {
          await custSnap.docs[0].ref.set({ status: 'canceled', updatedAt }, { merge: true });
          return custSnap.docs[0].id;
        }
      }
    } catch {
      isFirestoreAvailable = false;
    }
  }

  // Fallback to local JSON store
  const local = readLocalDB();
  for (const [id, tenant] of Object.entries(local.tenants)) {
    if ((subscriptionId && tenant.subscriptionId === subscriptionId) || (customerId && tenant.stripeCustomerId === customerId)) {
      local.tenants[id] = { ...tenant, status: 'canceled', updatedAt };
      writeLocalDB(local);
      return id;
    }
  }

  return null;
}

export function getFirestoreDB() {
  return db;
}
