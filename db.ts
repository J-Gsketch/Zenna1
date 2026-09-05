import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let db: Firestore;

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

export async function initDB() {
  if (!getApps().length) {
    initializeApp();
  }
  if (!db) {
    db = getFirestore('zenna-db');
    console.log(`⚡ Firestore Database initialized (Multi-Tenant Mode)`);
  }
}

export async function getLeads(tenant_id: string): Promise<Lead[]> {
  await initDB();
  const snap = await db.collection('leads')
    .where('tenant_id', '==', tenant_id)
    .orderBy('created_at', 'desc')
    .get();
  return snap.docs.map((d: any) => d.data() as Lead);
}

export async function saveLead(tenant_id: string, lead: { phone: string; name: string; status?: string; job_value?: string; notes?: string }) {
  await initDB();
  const snap = await db.collection('leads')
    .where('tenant_id', '==', tenant_id)
    .where('phone', '==', lead.phone)
    .limit(1)
    .get();

  const now = new Date().toISOString();
  
  if (!snap.empty) {
    const docRef = snap.docs[0].ref;
    const existing = snap.docs[0].data() as Lead;
    await docRef.update({
      name: lead.name || existing.name,
      status: lead.status || existing.status,
      job_value: lead.job_value || existing.job_value,
      notes: lead.notes || existing.notes,
      last_reply: now
    });
  } else {
    const docRef = db.collection('leads').doc();
    await docRef.set({
      tenant_id,
      phone: lead.phone,
      name: lead.name,
      status: lead.status || 'New',
      job_value: lead.job_value || '$0',
      notes: lead.notes || '',
      created_at: now
    });
  }
}

export async function getCalls(tenant_id: string): Promise<CallLog[]> {
  await initDB();
  const snap = await db.collection('calls')
    .where('tenant_id', '==', tenant_id)
    .orderBy('timestamp', 'desc')
    .get();
  return snap.docs.map((d: any) => d.data() as CallLog);
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
  
  await db.collection('calls').doc(finalCall.id).set(finalCall);
}

export async function getSetting(tenant_id: string, key: string, defaultValue: string = ''): Promise<string> {
  await initDB();
  const doc = await db.collection('tenants').doc(tenant_id).collection('settings').doc(key).get();
  if (doc.exists) {
    return doc.data()?.value || defaultValue;
  }
  return defaultValue;
}

export async function setSetting(tenant_id: string, key: string, value: string) {
  await initDB();
  await db.collection('tenants').doc(tenant_id).collection('settings').doc(key).set({ value }, { merge: true });
}

export async function getTenantByTwilioNumber(twilioNumber: string): Promise<string | null> {
  await initDB();
  const snap = await db.collection('tenants')
    .where('twilio_number', '==', twilioNumber)
    .limit(1)
    .get();
  
  if (snap.empty) return null;
  return snap.docs[0].id;
}
