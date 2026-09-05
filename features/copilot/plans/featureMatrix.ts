import { PlanFeature } from './schema';

export const FEATURE_MATRIX: PlanFeature[] = [
  {
    id: 'ai_answering',
    name: '24/7 AI Receptionist Call Answering',
    description: 'Autonomous Gemini AI receptionist answers inbound trade calls in real-time.',
    includedIn: ['starter', 'pro', 'enterprise']
  },
  {
    id: 'missed_call_sms',
    name: 'Instant Missed-Call SMS Text-Back',
    description: 'Auto-dispatches tailored SMS booking links when calls are missed on-site.',
    includedIn: ['starter', 'pro', 'enterprise']
  },
  {
    id: 'evening_brief',
    name: '6 PM Daily SMS Briefing',
    description: 'Daily executive summary sent directly to the business owner mobile.',
    includedIn: ['starter', 'pro', 'enterprise']
  },
  {
    id: 'dynamic_prompt',
    name: 'Dynamic Customer System Prompt',
    description: 'Customize business details, call-out fees, operating hours, and qualification rules.',
    includedIn: ['pro', 'enterprise']
  },
  {
    id: 'stripe_deposits',
    name: 'Stripe Deposit & Subscription Fulfillment',
    description: 'Collect automated call-out fee deposits and recurring subscriptions via Stripe.',
    includedIn: ['pro', 'enterprise']
  },
  {
    id: 'google_integrations',
    name: 'Google Calendar & Drive Integration',
    description: 'Direct calendar booking and automated job brief file generation in Google Drive.',
    includedIn: ['pro', 'enterprise']
  },
  {
    id: 'marketing_studio',
    name: 'Hammer & Code Ad & Marketing Generator',
    description: 'Generate trade ad scripts, social media blueprints, and partnership MOUs.',
    includedIn: ['pro', 'enterprise']
  },
  {
    id: 'multi_tenant_franchise',
    name: 'Multi-Tenant & Fleet Hierarchy',
    description: 'Manage multiple franchise locations, sub-tenants, and central reporting.',
    includedIn: ['enterprise']
  },
  {
    id: 'slack_webhook_alerts',
    name: 'Slack Real-Time VIP Alerts',
    description: 'Receive instant notifications in Slack for high-value leads and security events.',
    includedIn: ['enterprise']
  },
  {
    id: 'dedicated_manager',
    name: 'Dedicated Account Manager & SLA',
    description: '1-on-1 setup support, custom voice model tuning, and 99.9% uptime SLA.',
    includedIn: ['enterprise']
  }
];
