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
exports.Migration20250525203916 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250525203916 extends migrations_1.Migration {
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSql(`create table "raffle" ("id" varchar(255) not null, "title" varchar(255) not null, "image_url" varchar(255) not null, "ends_at" timestamptz not null, constraint "raffle_pkey" primary key ("id"));`);
            this.addSql(`create table "user" ("id" varchar(255) not null, "attempts_left" int not null default 5, constraint "user_pkey" primary key ("id"));`);
            this.addSql(`create table "ticket" ("id" serial primary key, "user_id" varchar(255) not null, "raffle_id" varchar(255) not null, "count" int not null default 1);`);
            this.addSql(`alter table "ticket" add constraint "ticket_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
            this.addSql(`alter table "ticket" add constraint "ticket_raffle_id_foreign" foreign key ("raffle_id") references "raffle" ("id") on update cascade;`);
        });
    }
    down() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSql(`alter table "ticket" drop constraint "ticket_raffle_id_foreign";`);
            this.addSql(`alter table "ticket" drop constraint "ticket_user_id_foreign";`);
            this.addSql(`drop table if exists "raffle" cascade;`);
            this.addSql(`drop table if exists "user" cascade;`);
            this.addSql(`drop table if exists "ticket" cascade;`);
        });
    }
}
exports.Migration20250525203916 = Migration20250525203916;
