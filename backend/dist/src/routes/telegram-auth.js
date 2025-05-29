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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = telegramAuthRoutes;
const User_1 = require("../entities/User");
function telegramAuthRoutes(app, orm) {
    return __awaiter(this, void 0, void 0, function* () {
        app.post("/telegram/auth", (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const { telegramId, username } = req.body;
            const em = orm.em.fork();
            if (!telegramId) {
                return reply.status(400).send({ error: "telegramId is required" });
            }
            let user = yield em.findOne(User_1.User, { telegramId });
            if (user) {
                return { success: true, user };
            }
            user = em.create(User_1.User, {
                telegramId,
                username,
                createdAt: new Date(),
                ticketBalance: 0,
            });
            yield em.persistAndFlush(user);
            return { success: true, user };
        }));
    });
}
