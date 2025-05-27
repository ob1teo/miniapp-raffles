import { Migration } from '@mikro-orm/migrations';

export class Migration20250527014649 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "ticket" drop constraint "ticket_user_id_foreign";`);

    this.addSql(`alter table "user" add column "telegram_id" int not null, add column "first_name" varchar(255) null, add column "last_name" varchar(255) null, add column "photo_url" varchar(255) null, add column "created_at" timestamptz not null;`);
    this.addSql(`alter table "user" alter column "id" type int using ("id"::int);`);
    this.addSql(`alter table "user" alter column "username" type varchar(255) using ("username"::varchar(255));`);
    this.addSql(`alter table "user" alter column "username" drop not null;`);
    this.addSql(`create sequence if not exists "user_id_seq";`);
    this.addSql(`select setval('user_id_seq', (select max("id") from "user"));`);
    this.addSql(`alter table "user" alter column "id" set default nextval('user_id_seq');`);
    this.addSql(`alter table "user" add constraint "user_telegram_id_unique" unique ("telegram_id");`);

    this.addSql(`alter table "ticket" alter column "user_id" type int using ("user_id"::int);`);
    this.addSql(`alter table "ticket" add constraint "ticket_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "ticket" drop constraint "ticket_user_id_foreign";`);

    this.addSql(`alter table "user" drop constraint "user_telegram_id_unique";`);
    this.addSql(`alter table "user" drop column "telegram_id", drop column "first_name", drop column "last_name", drop column "photo_url", drop column "created_at";`);

    this.addSql(`alter table "user" alter column "id" type varchar(255) using ("id"::varchar(255));`);
    this.addSql(`alter table "user" alter column "username" type varchar(255) using ("username"::varchar(255));`);
    this.addSql(`alter table "user" alter column "username" set not null;`);
    this.addSql(`alter table "user" alter column "id" drop default;`);

    this.addSql(`alter table "ticket" alter column "user_id" type varchar(255) using ("user_id"::varchar(255));`);
    this.addSql(`alter table "ticket" add constraint "ticket_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

}
