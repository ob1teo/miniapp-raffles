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
exports.default = raffleRoutes;
const User_1 = require("../entities/User");
const Raffle_1 = require("../entities/Raffle");
const RaffleEntry_1 = require("../entities/RaffleEntry");
function raffleRoutes(app, orm) {
    return __awaiter(this, void 0, void 0, function* () {
        app.get("/raffles/:telegramId", (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const em = orm.em.fork();
            const { telegramId } = req.params;
            const user = yield em.findOne(User_1.User, { telegramId });
            if (!user) {
                return reply.status(404).send({ error: "User not found" });
            }
            const raffles = yield em.find(Raffle_1.Raffle, {});
            const result = yield Promise.all(raffles.map((raffle) => __awaiter(this, void 0, void 0, function* () {
                const entries = yield em.find(RaffleEntry_1.RaffleEntry, { raffle: raffle.id }, { populate: ["user"] });
                const totalTickets = entries.reduce((sum, e) => sum + e.ticketsCount, 0);
                const participants = new Set(entries.map((e) => e.user.id)).size;
                const userTickets = entries
                    .filter((e) => e.user.id === user.id)
                    .reduce((sum, e) => sum + e.ticketsCount, 0);
                return {
                    id: raffle.id,
                    title: raffle.prizeDescription,
                    prizeDescription: raffle.prizeDescription,
                    imageUrl: raffle.prizeDescription,
                    endsAt: raffle.endsAt,
                    participants: participants,
                    isFinished: raffle.isFinished,
                    totalTickets,
                    userTickets,
                };
            })));
            return result;
        }));
        app.post("/raffles/join", (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const { raffleId, telegramId, tickets } = req.body;
            const em = orm.em.fork();
            if (tickets <= 0) {
                return reply.status(400).send({ error: "tickets must be > 0" });
            }
            const user = yield em.findOne(User_1.User, { telegramId });
            if (!user) {
                return reply.status(404).send({ error: "User not found" });
            }
            if (user.ticketBalance < tickets) {
                return reply.status(400).send({ error: "Not enough ticket balance" });
            }
            const raffle = yield em.findOne(Raffle_1.Raffle, {
                id: raffleId,
                isFinished: false,
            });
            if (!raffle) {
                return reply
                    .status(404)
                    .send({ error: "Raffle not found or already finished" });
            }
            let entry = yield em.findOne(RaffleEntry_1.RaffleEntry, { user, raffle });
            if (!entry) {
                entry = em.create(RaffleEntry_1.RaffleEntry, { user, raffle, ticketsCount: 0 });
            }
            user.ticketBalance -= tickets;
            entry.ticketsCount += tickets;
            yield em.persistAndFlush([user, entry]);
            return {
                success: true,
                newTicketBalance: user.ticketBalance,
            };
        }));
    });
}
