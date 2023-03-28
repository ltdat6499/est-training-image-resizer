CREATE TABLE "images" (
  "id" SERIAL PRIMARY KEY,
  "name" text UNIQUE NOT NULL,
  "data_info" jsonb,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now()),
  "deleted_at" timestamptz
);