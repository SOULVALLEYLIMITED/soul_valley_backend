"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const serverless_1 = require("@neondatabase/serverless");
const adapter_neon_1 = require("@prisma/adapter-neon");
const client_1 = require("@prisma/client");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}
// DB_ADAPTER=pg → plain Postgres over TCP (used for local development,
// e.g. the local SOULVALLEY_WEB database on this machine).
// Default (unset, as on Render) → Neon serverless driver, reached over
// HTTPS instead of a raw TCP connection to 5432, which avoids IPv6-only
// routing issues in Render's environment.
const adapter = process.env.DB_ADAPTER === "pg"
    ? new adapter_pg_1.PrismaPg(new pg_1.Pool({ connectionString }))
    : new adapter_neon_1.PrismaNeon(new serverless_1.Pool({ connectionString }));
exports.prisma = new client_1.PrismaClient({ adapter });
