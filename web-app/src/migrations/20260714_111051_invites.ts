import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`invites\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`child_name\` text NOT NULL,
  	\`age\` numeric NOT NULL,
  	\`event_date\` text NOT NULL,
  	\`date_text\` text NOT NULL,
  	\`date_text_en\` text,
  	\`time_text\` text NOT NULL,
  	\`pack_text\` text NOT NULL,
  	\`pack_text_en\` text,
  	\`host_phone\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`invites_slug_idx\` ON \`invites\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`invites_updated_at_idx\` ON \`invites\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`invites_created_at_idx\` ON \`invites\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`invites_id\` integer REFERENCES invites(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_invites_id_idx\` ON \`payload_locked_documents_rels\` (\`invites_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`invites\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`activities_id\` integer,
  	\`karts_id\` integer,
  	\`pricing_tiers_id\` integer,
  	\`packages_id\` integer,
  	\`extras_id\` integer,
  	\`game_modes_id\` integer,
  	\`bookings_id\` integer,
  	\`media_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`activities_id\`) REFERENCES \`activities\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`karts_id\`) REFERENCES \`karts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pricing_tiers_id\`) REFERENCES \`pricing_tiers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`packages_id\`) REFERENCES \`packages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`extras_id\`) REFERENCES \`extras\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`game_modes_id\`) REFERENCES \`game_modes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`bookings_id\`) REFERENCES \`bookings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "activities_id", "karts_id", "pricing_tiers_id", "packages_id", "extras_id", "game_modes_id", "bookings_id", "media_id", "users_id") SELECT "id", "order", "parent_id", "path", "activities_id", "karts_id", "pricing_tiers_id", "packages_id", "extras_id", "game_modes_id", "bookings_id", "media_id", "users_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_activities_id_idx\` ON \`payload_locked_documents_rels\` (\`activities_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_karts_id_idx\` ON \`payload_locked_documents_rels\` (\`karts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pricing_tiers_id_idx\` ON \`payload_locked_documents_rels\` (\`pricing_tiers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_packages_id_idx\` ON \`payload_locked_documents_rels\` (\`packages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_extras_id_idx\` ON \`payload_locked_documents_rels\` (\`extras_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_game_modes_id_idx\` ON \`payload_locked_documents_rels\` (\`game_modes_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_bookings_id_idx\` ON \`payload_locked_documents_rels\` (\`bookings_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
}
