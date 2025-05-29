import { Migration } from '@mikro-orm/migrations';

export class Migration20250528120206 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "language_code" varchar(255) null, add column "is_premium" boolean null, add column "is_bot" boolean null, add column "added_to_attachment_menu" boolean null, add column "allows_write_to_pm" boolean null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop column "language_code", drop column "is_premium", drop column "is_bot", drop column "added_to_attachment_menu", drop column "allows_write_to_pm";`);
  }

}
