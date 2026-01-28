import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICE_IDS } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { priceId, plan, billing } = await req.json();
    
    // Get current user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Determine the correct price ID
    let selectedPriceId = priceId;
    if (!selectedPriceId && plan && billing) {
      if (plan === 'basic') {
        selectedPriceId = billing === 'yearly' ? PRICE_IDS.BASIC_YEARLY : PRICE_IDS.BASIC_MONTHLY;
      } else if (plan === 'premium') {
        selectedPriceId = billing === 'yearly' ? PRICE_IDS.PREMIUM_YEARLY : PRICE_IDS.PREMIUM_MONTHLY;
      }
    }

    if (!selectedPriceId) {
      return NextResponse.json({ error: 'Invalid plan or price' }, { status: 400 });
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    let customerId = (profile as { stripe_customer_id?: string } | null)?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabaseUserId: user.id,
        },
      });
      customerId = customer.id;

      // Save customer ID - using any to bypass strict typing
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId } as Record<string, unknown>)
        .eq('id', user.id);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin}/pricing?canceled=true`,
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          userId: user.id,
        },
      },
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
