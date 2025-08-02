import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2023-10-16",
});

interface CreateSubscriptionRequest {
  priceId: string;
  userId: string;
}

interface CancelSubscriptionRequest {
  subscriptionId: string;
  userId: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action } = new URL(req.url).searchParams;

    switch (action) {
      case "create-subscription":
        return await createSubscription(req);
      case "cancel-subscription":
        return await cancelSubscription(req);
      case "get-subscription":
        return await getSubscription(req);
      case "create-portal-session":
        return await createPortalSession(req);
      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Subscription management error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function createSubscription(req: Request) {
  const { priceId, userId }: CreateSubscriptionRequest = await req.json();

  // Get or create Stripe customer
  const { data: userData } = await supabase
    .from("users")
    .select("email, stripe_customer_id")
    .eq("id", userId)
    .single();

  let customerId = userData?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: userData?.email,
      metadata: { supabase_user_id: userId },
    });
    customerId = customer.id;

    await supabase
      .from("users")
      .update({ stripe_customer_id: customerId })
      .eq("id", userId);
  }

  // Create subscription
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"],
  });

  // Store subscription in database
  await supabase.from("subscriptions").insert({
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: customerId,
    status: subscription.status,
    plan_type: getPlanTypeFromPriceId(priceId),
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
  });

  return new Response(
    JSON.stringify({
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function cancelSubscription(req: Request) {
  const { subscriptionId, userId }: CancelSubscriptionRequest = await req.json();

  // Verify subscription belongs to user
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("stripe_subscription_id", subscriptionId)
    .eq("user_id", userId)
    .single();

  if (!subscription) {
    return new Response(
      JSON.stringify({ error: "Subscription not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Cancel subscription in Stripe
  const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  // Update database
  await supabase
    .from("subscriptions")
    .update({
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscriptionId);

  return new Response(
    JSON.stringify({ success: true, subscription: canceledSubscription }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function getSubscription(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return new Response(
      JSON.stringify({ error: "User ID required" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return new Response(
    JSON.stringify({ subscription }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function createPortalSession(req: Request) {
  const { customerId, returnUrl } = await req.json();

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return new Response(
    JSON.stringify({ url: portalSession.url }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

function getPlanTypeFromPriceId(priceId: string): string {
  // Map Stripe price IDs to plan types
  // These would be your actual Stripe price IDs
  const priceMap: Record<string, string> = {
    "price_premium_monthly": "premium",
    "price_premium_yearly": "premium",
    "price_pro_monthly": "pro",
    "price_pro_yearly": "pro",
  };
  
  return priceMap[priceId] || "free";
}
