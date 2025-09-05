import { execSync } from "child_process";
import { Client } from "pg";
import path from "path";
import { fileURLToPath } from "url";

const databaseUrl =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;
const dbName = process.env.NODE_ENV === "test" ? "roomba_test" : "roomba";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    console.log("resetting database");

    const sysClient = new Client({
      connectionString: databaseUrl,
    });

    await sysClient.connect();

    console.log(`🗑️ Dropping database ${dbName}...`);
    await sysClient.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = '${dbName}' AND pid <> pg_backend_pid();
    `);
    await sysClient.query(`DROP DATABASE IF EXISTS "${dbName}";`);

    console.log(`✨ Creating database ${dbName}...`);
    await sysClient.query(`CREATE DATABASE "${dbName}";`);

    await sysClient.end();
    execSync("pnpm drizzle-kit migrate", {
      stdio: "inherit",
      cwd: path.resolve(__dirname, "../../shared"),
    });

    console.log("done");
  } catch (err) {
    console.error("Failed to reset ", err);
  }
}

main();
