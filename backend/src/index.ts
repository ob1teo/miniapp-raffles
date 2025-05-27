import fastify from "fastify";
import pino from "pino";
import fastifyCors from "@fastify/cors";
import "dotenv/config";
import routes from "./routes";
import { MikroORM } from "@mikro-orm/core";
import config from "../mikro-orm.config";
import { Telegraf } from "telegraf";

async function main() {
  const app = fastify();
  const log = pino();
  const orm = await MikroORM.init(config);
  const bot = new Telegraf(process.env.BOT_API_TOKEN!);

  const PORT = process.env.PORT || 3000;

  bot.start((ctx) => {
    ctx.reply("Добро пожаловать! 🚀", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Открыть приложение",
              web_app: {
                url: process.env.WEB_APP_URL!,
              },
            },
          ],
        ],
      },
    });
  });

  await routes(app, orm);
  app.register(fastifyCors, {
    origin: "*",
  });

  await app.listen({ port: Number(PORT), host: "0.0.0.0" });
  bot.launch();

  process.once("SIGINT", async () => {
    bot.stop("SIGINT");
    await orm.close();
  });

  process.once("SIGTERM", async () => {
    bot.stop("SIGTERM");
    await orm.close();
  });

  log.info(`Server is running on port ${PORT}`);
}

main();
