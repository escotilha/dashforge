import { HISTORICAL_DAYS } from "./config";
import { getAllGenerators } from "./generators";
import { generateTimeSeries } from "./generators/base";
import {
  insertSensorReadings,
  insertAlerts,
  insertSalesEvents,
  insertTeamMetrics,
  ping,
  close,
} from "./clickhouse";

async function seed() {
  console.log("Checking ClickHouse connection...");
  const ok = await ping();
  if (!ok) {
    console.error("Cannot connect to ClickHouse. Is it running?");
    process.exit(1);
  }
  console.log("Connected to ClickHouse.");

  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - HISTORICAL_DAYS);

  const generators = getAllGenerators();

  for (const [clientName, gen] of generators) {
    console.log(`\nSeeding ${clientName}...`);

    let sensorBatch: Awaited<ReturnType<typeof gen.generateSensorReadings>> =
      [];
    let alertBatch: Awaited<ReturnType<typeof gen.maybeGenerateAlert>> = [];
    let salesBatch: Awaited<ReturnType<typeof gen.generateSalesEvent>>[] = [];
    let teamBatch: Awaited<ReturnType<typeof gen.generateTeamMetrics>> = [];
    let count = 0;

    // Sensor readings every 15 minutes
    generateTimeSeries(start, now, 15, (ts) => {
      const readings = gen.generateSensorReadings(ts);
      sensorBatch.push(...readings);
      const alerts = gen.maybeGenerateAlert(readings, ts);
      alertBatch.push(...alerts);
      count++;

      // Flush in batches of 100 time points
      // We'll collect everything then batch insert below
    });

    // Sales events every 4 hours
    generateTimeSeries(start, now, 240, (ts) => {
      salesBatch.push(gen.generateSalesEvent(ts));
    });

    // Team metrics weekly
    generateTimeSeries(start, now, 10080, (ts) => {
      teamBatch.push(...gen.generateTeamMetrics(ts));
    });

    // Insert in chunks to avoid memory issues
    const CHUNK_SIZE = 10000;

    console.log(`  Inserting ${sensorBatch.length} sensor readings...`);
    for (let i = 0; i < sensorBatch.length; i += CHUNK_SIZE) {
      await insertSensorReadings(sensorBatch.slice(i, i + CHUNK_SIZE));
    }

    console.log(`  Inserting ${alertBatch.length} alerts...`);
    for (let i = 0; i < alertBatch.length; i += CHUNK_SIZE) {
      await insertAlerts(alertBatch.slice(i, i + CHUNK_SIZE));
    }

    console.log(`  Inserting ${salesBatch.length} sales events...`);
    await insertSalesEvents(salesBatch);

    console.log(`  Inserting ${teamBatch.length} team metrics...`);
    await insertTeamMetrics(teamBatch);

    console.log(`  Done. ${count} time points processed.`);
  }

  await close();
  console.log("\nSeeding complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
