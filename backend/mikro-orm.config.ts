import assert from "node:assert";
import "dotenv/config";

import { Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { ReflectMetadataProvider } from "@mikro-orm/core";

assert(process.env.DATABASE_URL !== undefined);

const isProd = process.env.NODE_ENV === "production";

const config: Options = {
  driver: PostgreSqlDriver,
  clientUrl: process.env.DATABASE_URL,
  forceUtcTimezone: true,

  entities: [isProd ? "dist/src/entities" : "src/entities"],
  entitiesTs: isProd ? undefined : ["src/entities"],

  metadataProvider: isProd ? ReflectMetadataProvider : TsMorphMetadataProvider,

  debug: !isProd,
};

export default config;
