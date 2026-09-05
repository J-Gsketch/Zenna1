export type Currency = 'AUD' | 'NZD' | 'USD';
export type BillingInterval = 'monthly' | 'yearly';

export type PlanId = 'starter' | 'pro' | 'enterprise';

export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  includedIn: PlanId[];
  limit?: string | number;
}

export interface PlanPricing {
  monthly: number;
  yearly: number;
  currency: Currency;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
}

export interface PlanDefinition {
  id: PlanId;
  name: string;
  tagline: string;
  description: string;
  badge?: string;
  popular?: boolean;
  pricing: Record<Currency, PlanPricing>;
  features: string[];
  limits: {
    phoneLines: number | 'Unlimited';
    monthlyCalls: number | 'Unlimited';
    teamMembers: number | 'Unlimited';
    crmIntegrations: boolean;
    customPrompts: boolean;
    prioritySupport: boolean;
    dedicatedAccountManager: boolean;
  };
}

export interface TenantSubscription {
  tenantId: string;
  planId: PlanId;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';
  billingInterval: BillingInterval;
  currency: Currency;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StripeCheckoutSessionOptions {
  tenantId: string;
  planId: PlanId;
  billingInterval: BillingInterval;
  currency: Currency;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  businessName?: string;
}
