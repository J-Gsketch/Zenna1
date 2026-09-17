import { getIdToken } from '../lib/googleAuth';

export type SubscriptionPlan = 'starter' | 'pro' | 'enterprise';

export async function startSubscription(plan: SubscriptionPlan, email?: string) {
  const token = await getIdToken();
  if (!token) throw new Error('Please sign in before starting a subscription.');
  const response = await fetch('/api/create-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ plan, email })
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Unable to start subscription.');
  if (payload.checkoutUrl) window.location.assign(payload.checkoutUrl);
  return payload;
}
