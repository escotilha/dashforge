import { z } from "zod";
import { tenantProcedure } from "../server";
import { router } from "../server";
import { encrypt, type EncryptedData } from "../../encryption";
import { testConnection } from "../../data-sources/pool-manager";

export const dataSourcesRouter = router({
  list: tenantProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("data_sources")
      .select(
        "id, tenant_id, name, type, is_active, last_tested_at, last_test_status, created_at",
      )
      .eq("tenant_id", ctx.tenantId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  }),

  create: tenantProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        type: z.enum(["postgresql", "mysql", "clickhouse"]),
        connectionString: z.string().min(10),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Test the connection first
      const testResult = await testConnection(
        input.type,
        input.connectionString,
      );
      if (!testResult.success) {
        throw new Error(`Connection test failed: ${testResult.error}`);
      }

      // Encrypt the connection string
      const encryptedConnection = encrypt(input.connectionString);

      const { data, error } = await ctx.supabase
        .from("data_sources")
        .insert({
          tenant_id: ctx.tenantId,
          name: input.name,
          type: input.type,
          encrypted_connection: encryptedConnection,
          is_active: true,
          last_tested_at: new Date().toISOString(),
          last_test_status: "success",
        })
        .select("id")
        .single();

      if (error) throw new Error(error.message);
      return { id: data.id, testResult: "success" };
    }),

  test: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { data: ds, error } = await ctx.supabase
        .from("data_sources")
        .select("type, encrypted_connection")
        .eq("id", input.id)
        .eq("tenant_id", ctx.tenantId)
        .single();

      if (error || !ds) throw new Error("Data source not found");

      const { decrypt } = await import("../../encryption");
      const connectionString = decrypt(
        ds.encrypted_connection as EncryptedData,
      );

      const result = await testConnection(ds.type, connectionString);

      await ctx.supabase
        .from("data_sources")
        .update({
          last_tested_at: new Date().toISOString(),
          last_test_status: result.success ? "success" : "failed",
        })
        .eq("id", input.id);

      return result;
    }),

  delete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.role !== "owner" && ctx.role !== "admin") {
        throw new Error("Only owners and admins can delete data sources");
      }

      const { removeConnection } =
        await import("../../data-sources/pool-manager");
      await removeConnection(input.id);

      const { error } = await ctx.supabase
        .from("data_sources")
        .delete()
        .eq("id", input.id)
        .eq("tenant_id", ctx.tenantId);

      if (error) throw new Error(error.message);
      return { success: true };
    }),
});
