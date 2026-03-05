"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/overview", label: "Overview", icon: "Home" },
  { href: "/dashboards", label: "Dashboards", icon: "LayoutDashboard" },
  { href: "/settings", label: "Settings", icon: "Settings" },
  { href: "/settings/team", label: "Team", icon: "Users" },
  { href: "/settings/billing", label: "Billing", icon: "CreditCard" },
  { href: "/settings/data-sources", label: "Data Sources", icon: "Database" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href="/overview" className="text-lg font-bold">
          DashForge
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              pathname === item.href
                ? "bg-primary/10 font-medium text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
          Free Plan
        </div>
      </div>
    </aside>
  );
}
