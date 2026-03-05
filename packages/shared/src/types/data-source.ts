export type DataSourceType = "postgresql" | "mysql" | "clickhouse" | "demo";

export interface DataSource {
  id: string;
  tenantId: string;
  name: string;
  type: DataSourceType;
  isActive: boolean;
  lastTestedAt: string | null;
  lastTestStatus: "success" | "failed" | null;
  createdAt: string;
  updatedAt: string;
}
