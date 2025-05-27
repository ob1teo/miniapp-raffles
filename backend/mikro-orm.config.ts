import assert from "node:assert";
import "dotenv/config";

import { Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

assert(process.env.DATABASE_URL !== undefined);

const config: Options = {
  // for simplicity, we use the SQLite database, as it's available pretty much everywhere
  driver: PostgreSqlDriver,

  clientUrl: process.env.DATABASE_URL,

  forceUtcTimezone: true,

  // folder-based discovery setup, using common filename suffix
  entities: ["dist/src/entities/*.js"],
  entitiesTs: ["src/entities/*.ts"],

  // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
  // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
  metadataProvider: TsMorphMetadataProvider,

  // enable debug mode to log SQL queries and discovery information
  debug: true,
};

export default config;
