"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
require("dotenv/config");
const postgresql_1 = require("@mikro-orm/postgresql");
const reflection_1 = require("@mikro-orm/reflection");
(0, node_assert_1.default)(process.env.DATABASE_URL !== undefined);
const config = {
    // for simplicity, we use the SQLite database, as it's available pretty much everywhere
    driver: postgresql_1.PostgreSqlDriver,
    clientUrl: process.env.DATABASE_URL,
    forceUtcTimezone: true,
    // folder-based discovery setup, using common filename suffix
    entities: ["dist/src/entities/*.js"],
    entitiesTs: ["src/entities/*.ts"],
    // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
    // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
    metadataProvider: reflection_1.TsMorphMetadataProvider,
    // enable debug mode to log SQL queries and discovery information
    debug: true,
};
exports.default = config;
