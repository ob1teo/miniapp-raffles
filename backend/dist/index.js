"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const pino_1 = __importDefault(require("pino"));
const cors_1 = __importDefault(require("@fastify/cors"));
require("dotenv/config");
const routes_1 = __importDefault(require("./routes"));
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("../mikro-orm.config"));
const telegraf_1 = require("telegraf");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, fastify_1.default)();
        const log = (0, pino_1.default)();
        const orm = yield core_1.MikroORM.init(mikro_orm_config_1.default);
        const bot = new telegraf_1.Telegraf(process.env.BOT_API_TOKEN);
        const PORT = process.env.PORT || 3000;
        bot.start((ctx) => {
            ctx.reply("Добро пожаловать! 🚀", {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Открыть приложение",
                                web_app: {
                                    url: process.env.WEB_APP_URL,
                                },
                            },
                        ],
                    ],
                },
            });
        });
        yield (0, routes_1.default)(app, orm);
        app.register(cors_1.default, {
            origin: "*",
        });
        yield app.listen({ port: Number(PORT), host: "0.0.0.0" });
        bot.launch();
        process.once("SIGINT", () => __awaiter(this, void 0, void 0, function* () {
            bot.stop("SIGINT");
            yield orm.close();
        }));
        process.once("SIGTERM", () => __awaiter(this, void 0, void 0, function* () {
            bot.stop("SIGTERM");
            yield orm.close();
        }));
        log.info(`Server is running on port ${PORT}`);
    });
}
main();
