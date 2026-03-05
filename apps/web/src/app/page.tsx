import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="text-xl font-bold">DashForge</span>
          <nav className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/demo"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Demo
            </Link>
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Start Free
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            Real-Time Dashboards
            <br />
            <span className="text-primary">for Enterprise</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Connect your databases, visualize your data in real-time, and share
            dashboards with your team. Built for industrial and enterprise
            clients.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Get Started Free
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-border px-6 py-3 text-sm font-medium hover:bg-muted"
            >
              View Live Demo
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
