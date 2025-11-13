ALTER TABLE "x_plan_addons" ALTER COLUMN "updatedAt" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "x_plan_addons" ALTER COLUMN "updatedAt" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "x_plan_addons" ADD COLUMN "plan_addons_id" bigserial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "x_plan_addons" ADD COLUMN "name" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "x_plan_addons" ADD COLUMN "value" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "x_plan_addons" ADD COLUMN "price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "x_plan_addons" ADD COLUMN "channel" varchar(30);--> statement-breakpoint
ALTER TABLE "x_plan_addons" ADD COLUMN "unit" varchar(20) DEFAULT 'message';--> statement-breakpoint
ALTER TABLE "x_plan_addons" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "x_message_credit_type" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "x_message_credit_type" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "x_plan_addons" DROP COLUMN "plan_addon_id";--> statement-breakpoint
ALTER TABLE "x_plan_addons" DROP COLUMN "plan_addon_name";--> statement-breakpoint
ALTER TABLE "x_plan_addons" DROP COLUMN "status";