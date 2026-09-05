/**
 * Pricing tier definitions for the Zenna AI Receptionist platform.
 *
 * Stripe Price IDs are read from environment variables so each deployment
 * (test/live, per-region) can point at its own Stripe Products/Prices
 * without code changes. See `.env.example` for the expected variable names.
 */
import type { PricingTier } from "./schema.js";

const env = (key: string, fallback = ""): string => {
  // Works in both the Node server (process.env) and Vite (import.meta.env)
  // build contexts without throwing if the other is unavailable.
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return fallback;
};

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For solo tradies getting off the tools and onto the phone less.",
    priceCents: { month: 19900, year: 199000 },
    currency: "aud",
    stripePriceIds: {
      month: env("STRIPE_PRICE_STARTER_MONTHLY", "price_starter_monthly"),
      year: env("STRIPE_PRICE_STARTER_YEARLY", "price_starter_yearly"),
    },
    limits: {
      maxCallsPerMonth: 150,
      maxSmsPerMonth: 300,
      maxPhoneNumbers: 1,
      maxSeats: 1,
    },
    features: {
      missedCallTextBack: true,
      aiVoiceReceptionist: true,
      crmLeadCapture: true,
      calendarBooking: false,
      dailyOwnerBriefing: true,
      slackAlerts: false,
      customBrandedPrompts: true,
      multiRegionSupport: false,
      prioritySupport: false,
      dedicatedOnboarding: false,
    },
    highlights: [
      "Never miss a call again — instant AI text-back",
      "1 dedicated business phone number",
      "Daily owner SMS briefing",
      "Basic CRM lead capture",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For growing crews who need Slack alerts and calendar booking.",
    priceCents: { month: 39900, year: 399000 },
    currency: "aud",
    stripePriceIds: {
      month: env("STRIPE_PRICE_PRO_MONTHLY", "price_pro_monthly"),
      year: env("STRIPE_PRICE_PRO_YEARLY", "price_pro_yearly"),
    },
    limits: {
      maxCallsPerMonth: 750,
      maxSmsPerMonth: 1500,
      maxPhoneNumbers: 3,
      maxSeats: 5,
    },
    features: {
      missedCallTextBack: true,
      aiVoiceReceptionist: true,
      crmLeadCapture: true,
      calendarBooking: true,
      dailyOwnerBriefing: true,
      slackAlerts: true,
      customBrandedPrompts: true,
      multiRegionSupport: true,
      prioritySupport: true,
      dedicatedOnboarding: false,
    },
    highlights: [
      "Everything in Starter, plus:",
      "Google Calendar booking automation",
      "Real-time Slack alerts for VIP leads",
      "Up to 3 phone numbers & 5 team seats",
      "Multi-region (AU/NZ) support",
    ],
    mostPopular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For multi-branch trade businesses and franchises.",
    priceCents: { month: 99900, year: 999000 },
    currency: "aud",
    stripePriceIds: {
      month: env("STRIPE_PRICE_ENTERPRISE_MONTHLY", "price_enterprise_monthly"),
      year: env("STRIPE_PRICE_ENTERPRISE_YEARLY", "price_enterprise_yearly"),
    },
    limits: {
      maxCallsPerMonth: -1,
      maxSmsPerMonth: -1,
      maxPhoneNumbers: 10,
      maxSeats: 25,
    },
    features: {
      missedCallTextBack: true,
      aiVoiceReceptionist: true,
      crmLeadCapture: true,
      calendarBooking: true,
      dailyOwnerBriefing: true,
      slackAlerts: true,
      customBrandedPrompts: true,
      multiRegionSupport: true,
      prioritySupport: true,
      dedicatedOnboarding: true,
    },
    highlights: [
      "Everything in Pro, plus:",
      "Unlimited calls & SMS",
      "Up to 10 phone numbers & 25 team seats",
      "Dedicated onboarding specialist",
      "Priority support with SLA",
    ],
  },
];

export function getPlanById(id: string): PricingTier | undefined {
  return PRICING_TIERS.find((tier) => tier.id === id);
}

export function getStripePriceId(id: string, interval: "month" | "year" = "month"): string | undefined {
  const plan = getPlanById(id);
  return plan?.stripePriceIds[interval];
}
