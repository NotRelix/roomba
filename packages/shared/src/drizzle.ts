import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@repo/shared/schema";

const databaseUrl =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: databaseUrl,
});

export const db = drizzle({ client: pool, schema });
