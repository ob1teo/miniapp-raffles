"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaffleEntry = void 0;
const core_1 = require("@mikro-orm/core");
const Raffle_1 = require("./Raffle");
const User_1 = require("./User");
let RaffleEntry = class RaffleEntry {
};
exports.RaffleEntry = RaffleEntry;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], RaffleEntry.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => User_1.User),
    __metadata("design:type", User_1.User)
], RaffleEntry.prototype, "user", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => Raffle_1.Raffle),
    __metadata("design:type", Raffle_1.Raffle)
], RaffleEntry.prototype, "raffle", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], RaffleEntry.prototype, "ticketsCount", void 0);
exports.RaffleEntry = RaffleEntry = __decorate([
    (0, core_1.Entity)()
], RaffleEntry);
