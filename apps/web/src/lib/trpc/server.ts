import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { createClient } from "@/lib/supabase/server";
import { getTenantAuth, type TenantAuth } from "@/lib/auth/tenant-auth";

export interface Context {
  userId: string | null;
  tenantAuth: TenantAuth | null;
}

export async function createContext(): Promise<Context> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { userId: null, tenantAuth: null };
  }

  // Get tenant_id from cookie (set by tenant switcher)
  // For now, we'll get the first tenant the user belongs to
  const { data: membership } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  let tenantAuth: TenantAuth | null = null;
  if (membership) {
    tenantAuth = await getTenantAuth(supabase, user.id, membership.tenant_id);
  }

  return { userId: user.id, tenantAuth };
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: { ...ctx, userId: ctx.userId },
  });
});

export const tenantProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId || !ctx.tenantAuth) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const supabase = await createClient();
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
      tenantAuth: ctx.tenantAuth,
      tenantId: ctx.tenantAuth.tenantId,
      role: ctx.tenantAuth.role,
      supabase,
    },
  });
});
