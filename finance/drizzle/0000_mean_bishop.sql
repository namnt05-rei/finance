CREATE TABLE "test_table" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"created_at" timestamp DEFAULT now()
);
