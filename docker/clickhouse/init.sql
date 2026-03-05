CREATE DATABASE IF NOT EXISTS dashforge;

-- Time-series sensor data (for IoT demo dashboards)
CREATE TABLE IF NOT EXISTS dashforge.sensor_readings (
    tenant_id UUID,
    device_id String,
    device_name String,
    metric_name String,
    value Float64,
    unit String,
    status Enum8('normal' = 0, 'warning' = 1, 'critical' = 2),
    latitude Nullable(Float64),
    longitude Nullable(Float64),
    timestamp DateTime64(3),
    ingested_at DateTime64(3) DEFAULT now64(3)
)
ENGINE = MergeTree()
PARTITION BY (tenant_id, toYYYYMM(timestamp))
ORDER BY (tenant_id, device_id, metric_name, timestamp)
TTL timestamp + INTERVAL 2 YEAR;

-- Aggregated metrics (pre-computed for dashboard KPIs)
CREATE TABLE IF NOT EXISTS dashforge.metrics_hourly (
    tenant_id UUID,
    metric_name String,
    dimension String,
    hour DateTime,
    count UInt64,
    sum Float64,
    min Float64,
    max Float64,
    avg Float64
)
ENGINE = SummingMergeTree()
PARTITION BY (tenant_id, toYYYYMM(hour))
ORDER BY (tenant_id, metric_name, dimension, hour);

-- Materialized view for auto-aggregation
CREATE MATERIALIZED VIEW IF NOT EXISTS dashforge.sensor_readings_hourly_mv
TO dashforge.metrics_hourly AS
SELECT
    tenant_id,
    metric_name,
    device_id AS dimension,
    toStartOfHour(timestamp) AS hour,
    count() AS count,
    sum(value) AS sum,
    min(value) AS min,
    max(value) AS max,
    avg(value) AS avg
FROM dashforge.sensor_readings
GROUP BY tenant_id, metric_name, device_id, toStartOfHour(timestamp);

-- Alerts/events
CREATE TABLE IF NOT EXISTS dashforge.alerts (
    tenant_id UUID,
    alert_id UUID,
    device_id String,
    severity Enum8('info' = 0, 'warning' = 1, 'critical' = 2, 'emergency' = 3),
    title String,
    message String,
    metric_name String,
    metric_value Float64,
    threshold Float64,
    acknowledged Bool DEFAULT false,
    timestamp DateTime64(3),
    resolved_at Nullable(DateTime64(3))
)
ENGINE = MergeTree()
PARTITION BY (tenant_id, toYYYYMM(timestamp))
ORDER BY (tenant_id, timestamp DESC);

-- Sales/revenue data
CREATE TABLE IF NOT EXISTS dashforge.sales_events (
    tenant_id UUID,
    event_type Enum8('lead' = 0, 'opportunity' = 1, 'proposal' = 2, 'negotiation' = 3, 'closed_won' = 4, 'closed_lost' = 5),
    deal_id String,
    deal_name String,
    amount Float64,
    currency String DEFAULT 'USD',
    salesperson String,
    region String,
    product_line String,
    stage_entered_at DateTime64(3),
    closed_at Nullable(DateTime64(3)),
    timestamp DateTime64(3)
)
ENGINE = MergeTree()
PARTITION BY (tenant_id, toYYYYMM(timestamp))
ORDER BY (tenant_id, timestamp);

-- Team performance data
CREATE TABLE IF NOT EXISTS dashforge.team_metrics (
    tenant_id UUID,
    employee_id String,
    employee_name String,
    department String,
    metric_name String,
    value Float64,
    target Float64,
    period_start Date,
    period_end Date,
    timestamp DateTime64(3)
)
ENGINE = MergeTree()
PARTITION BY (tenant_id, toYYYYMM(timestamp))
ORDER BY (tenant_id, department, employee_id, metric_name, timestamp);
