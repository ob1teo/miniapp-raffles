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
exports.Migration20250528133937 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250528133937 extends migrations_1.Migration {
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSql(`create table "raffle_entry" ("id" serial primary key, "user_id" int not null, "raffle_id" int not null, "tickets_count" int not null);`);
            this.addSql(`alter table "raffle_entry" add constraint "raffle_entry_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
            this.addSql(`alter table "raffle_entry" add constraint "raffle_entry_raffle_id_foreign" foreign key ("raffle_id") references "raffle" ("id") on update cascade;`);
            this.addSql(`drop table if exists "ticket" cascade;`);
            this.addSql(`alter table "raffle" drop column "title", drop column "image_url", drop column "prize";`);
            this.addSql(`alter table "raffle" add column "prize_description" varchar(255) not null;`);
            this.addSql(`alter table "user" drop column "first_name", drop column "last_name", drop column "photo_url", drop column "language_code", drop column "is_premium", drop column "is_bot", drop column "added_to_attachment_menu", drop column "allows_write_to_pm";`);
            this.addSql(`alter table "user" alter column "telegram_id" type varchar(255) using ("telegram_id"::varchar(255));`);
        });
    }
    down() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSql(`create table "ticket" ("id" serial primary key, "user_id" int not null, "raffle_id" int not null, "created_at" timestamptz not null);`);
            this.addSql(`alter table "ticket" add constraint "ticket_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
            this.addSql(`alter table "ticket" add constraint "ticket_raffle_id_foreign" foreign key ("raffle_id") references "raffle" ("id") on update cascade;`);
            this.addSql(`drop table if exists "raffle_entry" cascade;`);
            this.addSql(`alter table "raffle" add column "image_url" varchar(255) not null, add column "prize" varchar(255) not null;`);
            this.addSql(`alter table "raffle" rename column "prize_description" to "title";`);
            this.addSql(`alter table "user" add column "first_name" varchar(255) null, add column "last_name" varchar(255) null, add column "photo_url" varchar(255) null, add column "language_code" varchar(255) null, add column "is_premium" boolean null, add column "is_bot" boolean null, add column "added_to_attachment_menu" boolean null, add column "allows_write_to_pm" boolean null;`);
            this.addSql(`alter table "user" alter column "telegram_id" type int using ("telegram_id"::int);`);
        });
    }
}
exports.Migration20250528133937 = Migration20250528133937;
