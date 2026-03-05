import Link from "next/link";
import { PLAN_FEATURES } from "@dashforge/shared";

export default function PricingPage() {
  const freePlan = PLAN_FEATURES.free;
  const paidPlan = PLAN_FEATURES.paid;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            DashForge
          </Link>
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Log in
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Start free. Upgrade when you need real-time IoT and predictive
          analytics.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <div className="flex flex-col rounded-lg border border-border p-8 text-left">
            <h2 className="text-xl font-bold">Free</h2>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Perfect for getting started with basic dashboards
            </p>
            <ul className="mt-8 flex-1 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-500">+</span>
                {freePlan.dashboardTypes.length} dashboard types
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">+</span>
                {freePlan.maxDataSources} data source
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">+</span>
                Up to {freePlan.maxUsers} users
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span>-</span>
                No real-time streaming
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span>-</span>
                No white-label
              </li>
            </ul>
            <Link
              href="/signup"
              className="mt-8 rounded-md border border-border px-4 py-2 text-center text-sm font-medium hover:bg-muted"
            >
              Get Started Free
            </Link>
          </div>

          {/* Paid Plan */}
          <div className="flex flex-col rounded-lg border-2 border-primary p-8 text-left">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Pro</h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Popular
              </span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-bold">$99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              or $79/month billed annually
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Full power: real-time IoT, predictive analytics, and unlimited
              data sources
            </p>
            <ul className="mt-8 flex-1 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-500">+</span>
                {paidPlan.dashboardTypes.length} dashboard types (all)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">+</span>
                {paidPlan.maxDataSources} data sources
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">+</span>
                Up to {paidPlan.maxUsers} users
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">+</span>
                Real-time WebSocket streaming
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">+</span>
                White-label branding
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">+</span>
                API access
              </li>
            </ul>
            <Link
              href="/signup"
              className="mt-8 rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Start 14-Day Trial
            </Link>
          </div>
        </div>

        <p className="mt-12 text-sm text-muted-foreground">
          Need enterprise features? Contact us for custom pricing with SLA,
          SSO/SAML, and dedicated support.
        </p>
      </div>
    </div>
  );
}
