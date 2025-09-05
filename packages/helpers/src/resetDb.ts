import { resetDb } from "@repo/helpers/db";
import { db } from "@repo/shared/drizzle";

async function main() {
  try {
    console.log("resetting database...");
    await resetDb();
    console.log("done");
  } catch (err) {
    console.error(err);
  } finally {
    await db.$client.end();
  }
}

main();
