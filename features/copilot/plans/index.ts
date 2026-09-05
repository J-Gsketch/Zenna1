export * from './schema';
export * from './plans';
export * from './featureMatrix';
export * from './stripeIntegration';

import { PLANS } from './plans';
import { PlanId, Currency, BillingInterval } from './schema';

export function getPlanDetails(planId: PlanId) {
  return PLANS[planId] || PLANS.pro;
}

export function formatPlanPrice(planId: PlanId, currency: Currency = 'AUD', interval: BillingInterval = 'monthly'): string {
  const plan = getPlanDetails(planId);
  const pricing = plan.pricing[currency] || plan.pricing.AUD;
  const amount = interval === 'yearly' ? pricing.yearly : pricing.monthly;
  const currSymbol = currency === 'NZD' ? 'NZD $' : currency === 'USD' ? 'USD $' : 'AUD $';
  return `${currSymbol}${amount}/${interval === 'yearly' ? 'yr' : 'mo'}`;
}
