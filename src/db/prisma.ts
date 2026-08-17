import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";

// Neon serverless driver adapter.
// Neon is reached over HTTPS (port 443) instead of a raw TCP connection to 5432,
// which avoids IPv6-only routing issues in some environments.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaNeon({ connectionString });

export const prisma = new PrismaClient({ adapter });
