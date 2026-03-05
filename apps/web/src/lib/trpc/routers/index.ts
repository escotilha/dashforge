import { router } from "../server";
import { tenantRouter } from "./tenant";
import { dataSourcesRouter } from "./data-sources";

export const appRouter = router({
  tenant: tenantRouter,
  dataSources: dataSourcesRouter,
});

export type AppRouter = typeof appRouter;
