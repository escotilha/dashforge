export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: Plan;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  settings: TenantSettings;
  logoUrl: string | null;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export type Plan = "free" | "paid" | "enterprise";

export type TenantRole = "owner" | "admin" | "editor" | "viewer";

export interface TenantMember {
  id: string;
  tenantId: string;
  userId: string;
  role: TenantRole;
  createdAt: string;
}

export interface TenantSettings {
  primaryColor?: string;
  logoUrl?: string;
  customDomain?: string;
}
