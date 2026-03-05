export default function DataSourcesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Data Sources</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Connect your databases to power your dashboards
      </p>

      <div className="mt-8 rounded-lg border border-dashed border-border py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No data sources connected yet.
        </p>
        <button className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Add Data Source
        </button>
        <p className="mt-2 text-xs text-muted-foreground">
          Supports PostgreSQL, MySQL, and ClickHouse
        </p>
      </div>
    </div>
  );
}
