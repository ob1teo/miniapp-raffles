"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
require("dotenv/config");
const postgresql_1 = require("@mikro-orm/postgresql");
const reflection_1 = require("@mikro-orm/reflection");
const core_1 = require("@mikro-orm/core");
(0, node_assert_1.default)(process.env.DATABASE_URL !== undefined);
const isProd = process.env.NODE_ENV === "production";
const config = {
    driver: postgresql_1.PostgreSqlDriver,
    clientUrl: process.env.DATABASE_URL,
    forceUtcTimezone: true,
    entities: [isProd ? "dist/src/entities" : "src/entities"],
    entitiesTs: isProd ? undefined : ["src/entities"],
    metadataProvider: isProd ? core_1.ReflectMetadataProvider : reflection_1.TsMorphMetadataProvider,
    debug: !isProd,
};
exports.default = config;
