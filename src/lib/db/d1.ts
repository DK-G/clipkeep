import type { D1Database } from "@cloudflare/workers-types";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Access the Cloudflare D1 database binding.
 */
export async function getDb(): Promise<D1Database> {
  const context = await getCloudflareContext();
  if (!context) {
    throw new Error("Cloudflare Request Context not found. This code must run in a supported environment (Workers/Pages).");
  }
  
  const env = context.env as { clipkeep_db: D1Database };
  const db = env.clipkeep_db;
  if (!db) {
    throw new Error("D1 database binding 'clipkeep_db' not found in environment.");
  }

  return db;
}
