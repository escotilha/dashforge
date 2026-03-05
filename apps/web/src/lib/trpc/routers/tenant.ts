import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, tenantProcedure } from "../server";
import { createClient } from "@/lib/supabase/server";

export const tenantRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tenant_members")
      .select(
        "tenant_id, role, tenants(id, name, slug, plan, logo_url, is_demo)",
      )
      .eq("user_id", ctx.userId);

    if (error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    return data ?? [];
  }),

  getCurrent: tenantProcedure.query(async ({ ctx }) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .eq("id", ctx.tenantAuth.tenantId)
      .single();

    if (error) throw new TRPCError({ code: "NOT_FOUND" });
    return data;
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        slug: z
          .string()
          .min(1)
          .max(50)
          .regex(/^[a-z0-9-]+$/),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const supabase = await createClient();

      // Create tenant
      const { data: tenant, error: tenantError } = await supabase
        .from("tenants")
        .insert({ name: input.name, slug: input.slug })
        .select()
        .single();

      if (tenantError) {
        if (tenantError.code === "23505") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Slug already taken",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: tenantError.message,
        });
      }

      // Add creator as owner
      const { error: memberError } = await supabase
        .from("tenant_members")
        .insert({
          tenant_id: tenant.id,
          user_id: ctx.userId,
          role: "owner",
        });

      if (memberError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: memberError.message,
        });
      }

      return tenant;
    }),

  update: tenantProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
        settings: z.record(z.unknown()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.tenantAuth.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const supabase = await createClient();
      const { data, error } = await supabase
        .from("tenants")
        .update({ ...input, updated_at: new Date().toISOString() })
        .eq("id", ctx.tenantAuth.tenantId)
        .select()
        .single();

      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      return data;
    }),
});
