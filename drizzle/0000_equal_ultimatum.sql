CREATE TABLE "accounts" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"account_type" text,
	"credit_limit" integer DEFAULT 0,
	"shared_limit" boolean DEFAULT false,
	"parent_account_id" varchar(36),
	"is_cashback_eligible" boolean DEFAULT false,
	"cashback_percentage_bps" integer DEFAULT 0,
	"max_cashback_amount" integer,
	"min_spend_for_cashback" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cashback_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"txn_id" varchar(36),
	"account_id" varchar(36) NOT NULL,
	"program" text,
	"cycle_tag" varchar(10),
	"type" varchar(20),
	"percent_bps" integer DEFAULT 0,
	"amount" integer NOT NULL,
	"amount_back" integer,
	"note" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"transaction_nature" varchar(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "debt_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"people_id" varchar(36) NOT NULL,
	"txn_id" varchar(36),
	"type" text NOT NULL,
	"amount" integer NOT NULL,
	"note" text,
	"occurred_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "debt_settlements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"movement_id" uuid NOT NULL,
	"amount_paid" integer NOT NULL,
	"paid_at" timestamp DEFAULT now(),
	"note" text
);
--> statement-breakpoint
CREATE TABLE "linked_txn" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_txn_id" varchar(36),
	"link_type_id" varchar(36),
	"amount" integer,
	"is_confirmed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"is_group" boolean DEFAULT false,
	"credit_topup" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subcategories" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"category_id" varchar(36),
	"pl_type" varchar(40),
	"is_link_type" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"account_id" varchar(36) NOT NULL,
	"people_id" varchar(36),
	"category_id" varchar(36),
	"subcategory_id" varchar(36),
	"type" varchar(10) NOT NULL,
	"amount" integer NOT NULL,
	"note" text,
	"tag" varchar(12),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_people_map" (
	"user_id" uuid NOT NULL,
	"person_id" varchar(36) NOT NULL,
	"is_owner" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "cashback_movements" ADD CONSTRAINT "cashback_movements_txn_id_transactions_id_fk" FOREIGN KEY ("txn_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cashback_movements" ADD CONSTRAINT "cashback_movements_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "debt_movements" ADD CONSTRAINT "debt_movements_people_id_people_id_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "debt_movements" ADD CONSTRAINT "debt_movements_txn_id_transactions_id_fk" FOREIGN KEY ("txn_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "debt_settlements" ADD CONSTRAINT "debt_settlements_movement_id_debt_movements_id_fk" FOREIGN KEY ("movement_id") REFERENCES "public"."debt_movements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "linked_txn" ADD CONSTRAINT "linked_txn_parent_txn_id_transactions_id_fk" FOREIGN KEY ("parent_txn_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "linked_txn" ADD CONSTRAINT "linked_txn_link_type_id_subcategories_id_fk" FOREIGN KEY ("link_type_id") REFERENCES "public"."subcategories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_people_id_people_id_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_subcategory_id_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."subcategories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_people_map" ADD CONSTRAINT "user_people_map_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_people_map" ADD CONSTRAINT "user_people_map_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;