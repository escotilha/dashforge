import Link from "next/link";

export default function BillingPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Billing</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your subscription and billing
      </p>

      <div className="mt-8 rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Current Plan: Free</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              3 dashboard types, 1 data source, 5 users
            </p>
          </div>
          <Link
            href="/pricing"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </div>
  );
}
