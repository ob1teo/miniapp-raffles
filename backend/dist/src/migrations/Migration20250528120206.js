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
exports.Migration20250528120206 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250528120206 extends migrations_1.Migration {
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSql(`alter table "user" add column "language_code" varchar(255) null, add column "is_premium" boolean null, add column "is_bot" boolean null, add column "added_to_attachment_menu" boolean null, add column "allows_write_to_pm" boolean null;`);
        });
    }
    down() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSql(`alter table "user" drop column "language_code", drop column "is_premium", drop column "is_bot", drop column "added_to_attachment_menu", drop column "allows_write_to_pm";`);
        });
    }
}
exports.Migration20250528120206 = Migration20250528120206;
