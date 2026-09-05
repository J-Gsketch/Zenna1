import { PlanDefinition } from './schema';

export const PLANS: Record<string, PlanDefinition> = {
  starter: {
    id: 'starter',
    name: 'Starter (Solo Tradie)',
    tagline: 'Zenna by Hammer & Code for Solo Operators & Vans',
    description: 'Perfect for sole traders and small service operators who need automated call answering and lead qualification.',
    pricing: {
      AUD: { monthly: 99, yearly: 990, currency: 'AUD' },
      NZD: { monthly: 109, yearly: 1090, currency: 'NZD' },
      USD: { monthly: 79, yearly: 790, currency: 'USD' }
    },
    features: [
      '1 Dedicated Regional Twilio Phone Line',
      'AI Receptionist Call Answering (24/7)',
      'Automated Missed-Call SMS Text-Back',
      'Standard Aussie & NZ Trade Voice Models',
      'Up to 150 Qualified Calls / Month',
      'Daily 6 PM SMS Executive Briefing',
      'Basic CRM & Lead Management Dashboard',
      'Standard Email & Chat Support'
    ],
    limits: {
      phoneLines: 1,
      monthlyCalls: 150,
      teamMembers: 1,
      crmIntegrations: false,
      customPrompts: false,
      prioritySupport: false,
      dedicatedAccountManager: false
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro (Multi-Van & Team)',
    tagline: 'Zenna by Hammer & Code for Growing Trade Teams',
    description: 'Ideal for busy trade operations requiring customized business prompts, Stripe deposits, and Google integrations.',
    popular: true,
    badge: 'MOST POPULAR',
    pricing: {
      AUD: { monthly: 199, yearly: 1990, currency: 'AUD' },
      NZD: { monthly: 219, yearly: 2190, currency: 'NZD' },
      USD: { monthly: 149, yearly: 1490, currency: 'USD' }
    },
    features: [
      'Up to 3 Dedicated Regional Phone Lines',
      'Fully Dynamic Customer-Configurable System Prompt',
      'Stripe Invoicing & Auto-Deposit Collection',
      'Google Calendar & Google Drive Auto-Sync',
      'Instant Software & Trade MVP Quote Scoping',
      'Unlimited Qualified Inbound Calls',
      'Multi-User Team Access & Dispatch Control',
      'Hammer & Code Automated Ad & Marketing Studio',
      'Priority Support (24-Hour SLA)'
    ],
    limits: {
      phoneLines: 3,
      monthlyCalls: 'Unlimited',
      teamMembers: 5,
      crmIntegrations: true,
      customPrompts: true,
      prioritySupport: true,
      dedicatedAccountManager: false
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise (Fleet & Franchise)',
    tagline: 'Zenna by Hammer & Code Full Scale Automation',
    description: 'Designed for commercial trade franchises, fleets, and multi-location companies needing custom voice models and dedicated infrastructure.',
    badge: 'SCALE & FRANCHISE',
    pricing: {
      AUD: { monthly: 399, yearly: 3990, currency: 'AUD' },
      NZD: { monthly: 439, yearly: 4390, currency: 'NZD' },
      USD: { monthly: 299, yearly: 2990, currency: 'USD' }
    },
    features: [
      'Unlimited Dedicated Phone Lines & Numbers',
      'Multi-Tenant Sub-Accounts & Location Management',
      'Custom ElevenLabs & Gemini Fine-Tuned Voice Clone',
      'Custom ERP/CRM Webhook & API Integrations',
      'Slack VIP Alert Webhooks & Live Real-Time Logs',
      'Dedicated Account Manager & Onboarding Specialist',
      '99.9% Uptime SLA & Enterprise Security Audit',
      'Custom Contract Terms & Direct Invoicing'
    ],
    limits: {
      phoneLines: 'Unlimited',
      monthlyCalls: 'Unlimited',
      teamMembers: 'Unlimited',
      crmIntegrations: true,
      customPrompts: true,
      prioritySupport: true,
      dedicatedAccountManager: true
    }
  }
};
