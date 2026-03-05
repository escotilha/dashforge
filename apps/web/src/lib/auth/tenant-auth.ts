import type { Plan, TenantRole } from "@dashforge/shared";

export interface TenantAuth {
  tenantId: string;
  role: TenantRole;
  plan: Plan;
}

// In-memory cache with TTL (replaced by Redis in production)
const cache = new Map<string, { data: TenantAuth | null; expiresAt: number }>();
const CACHE_TTL_MS = 30_000; // 30 seconds

function getCacheKey(userId: string, tenantId: string): string {
  return `tenant_auth:${userId}:${tenantId}`;
}

export function invalidateCache(userId: string, tenantId: string): void {
  cache.delete(getCacheKey(userId, tenantId));
}

export function invalidateUserCache(userId: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(`tenant_auth:${userId}:`)) {
      cache.delete(key);
    }
  }
}

/**
 * Get tenant authorization for a user by querying the database.
 * Uses a short-lived cache to avoid hitting the DB on every request.
 *
 * IMPORTANT: This function is the ONLY source of truth for authorization.
 * JWT claims are NEVER trusted for access control decisions.
 */
export async function getTenantAuth(
  // Supabase client generic is too complex to express inline — using any is intentional
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabaseClient: any,
  userId: string,
  tenantId: string,
): Promise<TenantAuth | null> {
  const cacheKey = getCacheKey(userId, tenantId);
  const cached = cache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const { data, error } = await supabaseClient
    .from("tenant_members")
    .select("role, tenants!inner(plan)")
    .eq("user_id", userId)
    .eq("tenant_id", tenantId)
    .single();

  if (error || !data) {
    cache.set(cacheKey, { data: null, expiresAt: Date.now() + CACHE_TTL_MS });
    return null;
  }

  const record = data as Record<string, unknown>;
  const tenantData = record.tenants as { plan: Plan };
  const auth: TenantAuth = {
    tenantId,
    role: record.role as TenantRole,
    plan: tenantData.plan,
  };

  cache.set(cacheKey, { data: auth, expiresAt: Date.now() + CACHE_TTL_MS });
  return auth;
}
