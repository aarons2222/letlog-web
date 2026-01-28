import Stripe from 'stripe';

// Create Stripe instance - will be null if key is missing (build time)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, { typescript: true })
  : null as unknown as Stripe;

export const PRICE_IDS = {
  BASIC_MONTHLY: process.env.STRIPE_BASIC_PRICE_ID || '',
  BASIC_YEARLY: process.env.STRIPE_BASIC_YEARLY_PRICE_ID || '',
  PREMIUM_MONTHLY: process.env.STRIPE_PREMIUM_PRICE_ID || '',
  PREMIUM_YEARLY: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || '',
};
