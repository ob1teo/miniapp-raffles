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
exports.Raffle = void 0;
const core_1 = require("@mikro-orm/core");
const RaffleEntry_1 = require("./RaffleEntry");
let Raffle = class Raffle {
    constructor() {
        this.isFinished = false;
        this.entries = new core_1.Collection(this);
    }
};
exports.Raffle = Raffle;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Raffle.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Raffle.prototype, "prizeDescription", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Date)
], Raffle.prototype, "endsAt", void 0);
__decorate([
    (0, core_1.Property)({ default: false }),
    __metadata("design:type", Boolean)
], Raffle.prototype, "isFinished", void 0);
__decorate([
    (0, core_1.OneToMany)(() => RaffleEntry_1.RaffleEntry, (entry) => entry.raffle),
    __metadata("design:type", Object)
], Raffle.prototype, "entries", void 0);
exports.Raffle = Raffle = __decorate([
    (0, core_1.Entity)()
], Raffle);
