CREATE TYPE "public"."taxation_types" AS ENUM('GST', 'SALES', 'VAT');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "companies" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "companies_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(64) NOT NULL,
	"db_url" varchar(64) NOT NULL,
	"financial_year_start" timestamp NOT NULL,
	"address" varchar(1024),
	"city" varchar(64),
	"district" varchar(64),
	"state" varchar(64),
	"postal_code" varchar(32),
	"email" varchar(128),
	"phone" varchar(64),
	"taxation_type" "taxation_types",
	"taxation_id" varchar(64),
	"is_active" boolean DEFAULT false NOT NULL,
	CONSTRAINT "companies_name_unique" UNIQUE("name"),
	CONSTRAINT "companies_dbUrl_unique" UNIQUE("db_url"),
	CONSTRAINT "companies_taxationId_unique" UNIQUE("taxation_id")
);
