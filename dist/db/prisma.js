"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const adapter_neon_1 = require("@prisma/adapter-neon");
const client_1 = require("../generated/prisma/client");
// Neon serverless driver adapter.
// Neon is reached over HTTPS (port 443) instead of a raw TCP connection to 5432,
// which avoids IPv6-only routing issues in some environments.
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}
const adapter = new adapter_neon_1.PrismaNeon({ connectionString });
exports.prisma = new client_1.PrismaClient({ adapter });
