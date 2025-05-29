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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = telegramAuthRoutes;
const crypto_1 = __importDefault(require("crypto"));
const User_1 = require("../entities/User");
function checkTelegramAuth(data, botToken) {
    const { hash, auth_date } = data, authData = __rest(data, ["hash", "auth_date"]);
    if (Date.now() / 1000 - Number(auth_date) > 86400) {
        return false;
    }
    const sortedKeys = Object.keys(authData).sort();
    const checkString = sortedKeys.map((k) => `${k}=${authData[k]}`).join("\n");
    const secret = crypto_1.default.createHash("sha256").update(botToken).digest();
    const hmac = crypto_1.default.createHmac("sha256", secret).update(checkString).digest();
    const hashBuffer = Buffer.from(hash, "hex");
    if (hashBuffer.length !== hmac.length)
        return false;
    return crypto_1.default.timingSafeEqual(hmac, hashBuffer);
}
function telegramAuthRoutes(app, orm) {
    return __awaiter(this, void 0, void 0, function* () {
        app.post("/telegram/auth", (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const em = orm.em.fork();
            if (!checkTelegramAuth(data, process.env.BOT_API_TOKEN)) {
                return reply.status(403).send({ error: "Invalid authorization data" });
            }
            let user = yield em.findOne(User_1.User, { telegramId: data.id });
            if (!user) {
                user = em.create(User_1.User, {
                    telegramId: data.id,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    username: data.username,
                    photoUrl: data.photo_url,
                    ticketBalance: 0,
                    createdAt: new Date(),
                });
                yield em.persistAndFlush(user);
            }
            else {
                user.firstName = data.first_name;
                user.lastName = data.last_name;
                user.username = data.username;
                user.photoUrl = data.photo_url;
                yield em.flush();
            }
            return {
                id: user.id,
                telegramId: user.telegramId,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                photoUrl: user.photoUrl,
            };
        }));
    });
}
