import { Pool as PgPool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool as NeonPool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// DB_ADAPTER=pg → plain Postgres over TCP (used for local development,
// e.g. the local SOULVALLEY_WEB database on this machine).
// Default (unset, as on Render) → Neon serverless driver, reached over
// HTTPS instead of a raw TCP connection to 5432, which avoids IPv6-only
// routing issues in Render's environment.
const adapter =
  process.env.DB_ADAPTER === "pg"
    ? new PrismaPg(new PgPool({ connectionString }))
    : new PrismaNeon(new NeonPool({ connectionString }));

export const prisma = new PrismaClient({ adapter });
