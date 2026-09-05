/**
 * Plan configuration schema for the Zenna AI Receptionist SaaS.
 *
 * These types define the shape of a billing/feature plan so that pricing,
 * feature gating, and Stripe billing integration all reference a single
 * source of truth instead of hardcoded strings scattered through the app.
 */

export type PlanId = "starter" | "pro" | "enterprise";

export type BillingInterval = "month" | "year";

export interface PlanLimits {
  /** Max inbound calls handled by Zenna per billing period. -1 = unlimited */
  maxCallsPerMonth: number;
  /** Max SMS auto-replies sent per billing period. -1 = unlimited */
  maxSmsPerMonth: number;
  /** Number of Twilio phone numbers provisioned for this tenant */
  maxPhoneNumbers: number;
  /** Number of team/staff seats that can access the dashboard */
  maxSeats: number;
}

export interface PlanFeatures {
  missedCallTextBack: boolean;
  aiVoiceReceptionist: boolean;
  crmLeadCapture: boolean;
  calendarBooking: boolean;
  dailyOwnerBriefing: boolean;
  slackAlerts: boolean;
  customBrandedPrompts: boolean;
  multiRegionSupport: boolean;
  prioritySupport: boolean;
  dedicatedOnboarding: boolean;
}

export interface PricingTier {
  id: PlanId;
  name: string;
  tagline: string;
  /** Price in the smallest currency unit (cents), per billing interval */
  priceCents: {
    month: number;
    year: number;
  };
  currency: "usd" | "aud" | "nzd";
  /** Stripe Price IDs, populated from environment configuration */
  stripePriceIds: {
    month: string;
    year: string;
  };
  limits: PlanLimits;
  features: PlanFeatures;
  /** Marketing bullet points shown on the pricing/landing page */
  highlights: string[];
  mostPopular?: boolean;
}
