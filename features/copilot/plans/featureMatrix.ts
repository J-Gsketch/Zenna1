/**
 * Feature matrix helpers for rendering pricing/comparison tables and for
 * server-side feature gating (e.g. deciding whether a tenant can use
 * calendar booking or Slack alerts based on their active plan).
 */
import { PRICING_TIERS } from "./plans.js";
import type { PlanFeatures, PlanId } from "./schema.js";

export interface FeatureMatrixRow {
  key: keyof PlanFeatures;
  label: string;
  values: Record<PlanId, boolean>;
}

const FEATURE_LABELS: Record<keyof PlanFeatures, string> = {
  missedCallTextBack: "Missed-call auto text-back",
  aiVoiceReceptionist: "AI voice receptionist (Zenna)",
  crmLeadCapture: "CRM lead capture & dashboard",
  calendarBooking: "Google Calendar booking automation",
  dailyOwnerBriefing: "Daily owner SMS briefing",
  slackAlerts: "Real-time Slack VIP lead alerts",
  customBrandedPrompts: "Custom-branded AI system prompt",
  multiRegionSupport: "Multi-region (AU/NZ/etc.) support",
  prioritySupport: "Priority support",
  dedicatedOnboarding: "Dedicated onboarding specialist",
};

/**
 * Builds a feature-by-plan matrix, e.g. for rendering a pricing comparison
 * table: [{ key: 'slackAlerts', label: '...', values: { starter: false, pro: true, enterprise: true } }, ...]
 */
export function buildFeatureMatrix(): FeatureMatrixRow[] {
  const featureKeys = Object.keys(FEATURE_LABELS) as (keyof PlanFeatures)[];

  return featureKeys.map((key) => {
    const values = {} as Record<PlanId, boolean>;
    for (const tier of PRICING_TIERS) {
      values[tier.id] = tier.features[key];
    }
    return { key, label: FEATURE_LABELS[key], values };
  });
}

/**
 * Simple feature-gating helper for server-side checks, e.g.
 * `hasFeature(tenantPlanId, 'slackAlerts')` before sending a Slack alert.
 */
export function hasFeature(planId: string | undefined, feature: keyof PlanFeatures): boolean {
  const tier = PRICING_TIERS.find((t) => t.id === planId);
  if (!tier) return false;
  return Boolean(tier.features[feature]);
}
