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
exports.Ticket = void 0;
const core_1 = require("@mikro-orm/core");
const User_1 = require("./User");
const Raffle_1 = require("./Raffle");
let Ticket = class Ticket {
    constructor(user, raffle) {
        this.createdAt = new Date();
        this.user = user;
        this.raffle = raffle;
    }
};
exports.Ticket = Ticket;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Ticket.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)(),
    __metadata("design:type", User_1.User)
], Ticket.prototype, "user", void 0);
__decorate([
    (0, core_1.ManyToOne)(),
    __metadata("design:type", Raffle_1.Raffle)
], Ticket.prototype, "raffle", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Date)
], Ticket.prototype, "createdAt", void 0);
exports.Ticket = Ticket = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [User_1.User, Raffle_1.Raffle])
], Ticket);
