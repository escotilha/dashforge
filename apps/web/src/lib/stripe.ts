import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const STRIPE_PRICES = {
  paid_monthly: process.env.STRIPE_PRICE_MONTHLY ?? "price_monthly_placeholder",
  paid_annual: process.env.STRIPE_PRICE_ANNUAL ?? "price_annual_placeholder",
} as const;
