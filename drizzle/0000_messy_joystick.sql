CREATE TYPE "public"."audit_action" AS ENUM('created', 'updated', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'partial', 'paid');--> statement-breakpoint
CREATE TYPE "public"."commission_status" AS ENUM('pending', 'approved', 'paid');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('pending', 'done', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('followup', 'visit', 'task');--> statement-breakpoint
CREATE TYPE "public"."channel" AS ENUM('sms', 'email', 'whatsapp');--> statement-breakpoint
CREATE TYPE "public"."campaign_contact_status" AS ENUM('pending', 'sent', 'failed', 'delivered', 'read');--> statement-breakpoint
CREATE TYPE "public"."campaign_log_channel" AS ENUM('sms', 'email', 'whatsapp');--> statement-breakpoint
CREATE TYPE "public"."campaign_log_status" AS ENUM('sent', 'failed', 'delivered', 'read');--> statement-breakpoint
CREATE TYPE "public"."campaign_status" AS ENUM('draft', 'scheduled', 'running', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."campaign_type" AS ENUM('sms', 'email', 'whatsapp', 'mixed');--> statement-breakpoint
CREATE TYPE "public"."followup_done" AS ENUM('Yes', 'No');--> statement-breakpoint
CREATE TYPE "public"."family_visit" AS ENUM('Yes', 'No');--> statement-breakpoint
CREATE TYPE "public"."visit_done" AS ENUM('Yes', 'No');--> statement-breakpoint
CREATE TYPE "public"."visit_postponed" AS ENUM('Yes', 'No');--> statement-breakpoint
CREATE TYPE "public"."bulk_import" AS ENUM('Yes', 'No');--> statement-breakpoint
CREATE TYPE "public"."is_lead" AS ENUM('Yes', 'No');--> statement-breakpoint
CREATE TYPE "public"."rera" AS ENUM('Yes', 'No');--> statement-breakpoint
CREATE TYPE "public"."quotation_status" AS ENUM('draft', 'sent', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."priority" AS ENUM('Low', 'Medium', 'High');--> statement-breakpoint
CREATE TYPE "public"."private_note" AS ENUM('Yes', 'No');--> statement-breakpoint
CREATE TYPE "public"."plan_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."user_plan_status" AS ENUM('active', 'inactive', 'cancelled', 'expired');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('completed', 'pending', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('plan', 'addon', 'refund', 'adjustment');--> statement-breakpoint
CREATE TYPE "public"."leave_approved" AS ENUM('Yes', 'No');--> statement-breakpoint
CREATE TYPE "public"."leave_status" AS ENUM('Applied', 'Rejected');--> statement-breakpoint
CREATE TYPE "public"."ticket_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."ticket_status" AS ENUM('open', 'in_progress', 'resolved', 'closed');--> statement-breakpoint
CREATE TABLE "attendance_settings" (
	"attendance_setting_id" serial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"office_start_time" time NOT NULL,
	"office_end_time" time NOT NULL,
	"halfday_mark_time" time NOT NULL,
	"late_mark_duration" time,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "attendance" (
	"attendance_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"business_id" bigint NOT NULL,
	"partner_id" bigint,
	"in_time" timestamp NOT NULL,
	"in_lat" numeric(10, 6),
	"in_long" numeric(10, 6),
	"in_photo" varchar(100),
	"in_ipaddress" varchar(100),
	"out_time" timestamp,
	"out_lat" numeric(10, 6),
	"out_long" numeric(10, 6),
	"out_photo" varchar(100),
	"out_ipaddress" varchar(100),
	"halfday" boolean,
	"late" boolean,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" bigint NOT NULL,
	"action" "audit_action" NOT NULL,
	"before_data" text,
	"after_data" text,
	"ip_address" varchar(50),
	"user_agent" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"booking_id" bigserial PRIMARY KEY NOT NULL,
	"brodker_id" bigint,
	"business_id" bigint NOT NULL,
	"quotation_id" integer NOT NULL,
	"booking_date" date NOT NULL,
	"booking_amount" numeric(12, 2) NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending',
	"payment_method" varchar(50),
	"remarks" text,
	"booked_by" integer,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "broker_commissions" (
	"broker_commission_id" serial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"booking_id" bigint NOT NULL,
	"broker_id" bigint NOT NULL,
	"commission_amount" numeric(12, 2) NOT NULL,
	"commission_percentage" numeric(5, 2),
	"status" "commission_status" DEFAULT 'pending',
	"remarks" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "broker_payouts" (
	"broker_payout_id" bigserial PRIMARY KEY NOT NULL,
	"broker_id" bigint NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"payout_date" date NOT NULL,
	"payment_method" varchar(50),
	"remarks" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brokers_users" (
	"broker_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brokers_visits" (
	"broker_visit_id" bigserial PRIMARY KEY NOT NULL,
	"broker_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brokers" (
	"broker_id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"broker_type" integer NOT NULL,
	"business_name" varchar(50) NOT NULL,
	"address" text NOT NULL,
	"locality" varchar(30),
	"city" varchar(50) NOT NULL,
	"state" varchar(50) NOT NULL,
	"pincode" varchar(10),
	"rera" varchar(20),
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "builders" (
	"builder_id" serial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"user_id" bigint DEFAULT 0,
	"builder_name" varchar(100) NOT NULL,
	"description" text,
	"logo_image" varchar(50),
	"logo_path" varchar(150) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_users" (
	"business_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business" (
	"business_id" bigserial PRIMARY KEY NOT NULL,
	"business_name" varchar(255) NOT NULL,
	"business_type" varchar(100),
	"business_gst" varchar(20),
	"address_line_1" varchar(255),
	"address_line_2" varchar(255),
	"city" varchar(100),
	"state" integer,
	"zip" varchar(10),
	"owner_name" varchar(100),
	"contact_number" varchar(20),
	"email_address" varchar(100),
	"website_url" varchar(255),
	"timezone" varchar(50) DEFAULT 'UTC',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "cache_locks" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"owner" varchar(255) NOT NULL,
	"expiration" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "cache" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"expiration" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "calendar_events" (
	"calendar_event_id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"event_type" "event_type" NOT NULL,
	"reference_id" integer NOT NULL,
	"title" varchar(150) NOT NULL,
	"description" text,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"all_day" boolean DEFAULT false,
	"assigned_to" integer,
	"status" "event_status" DEFAULT 'pending',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "campaign_channels" (
	"campaign_channel_id" bigserial PRIMARY KEY NOT NULL,
	"campaign_id" bigint NOT NULL,
	"channel" "channel" NOT NULL,
	"subject" varchar(150),
	"message" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "campaign_contacts" (
	"campaign_contact_id" bigserial PRIMARY KEY NOT NULL,
	"campaign_id" bigint NOT NULL,
	"contact_id" bigint NOT NULL,
	"status" "campaign_contact_status" DEFAULT 'pending',
	"attempt_count" integer DEFAULT 0,
	"last_attempt_at" timestamp,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "campaign_logs" (
	"campaign_log_id" bigserial PRIMARY KEY NOT NULL,
	"campaign_id" bigint NOT NULL,
	"contact_id" bigint NOT NULL,
	"channel" "campaign_log_channel" NOT NULL,
	"status" "campaign_log_status" DEFAULT 'sent',
	"response" text,
	"sent_at" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"campaign_id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"project_id" bigint,
	"campaign_name" varchar(100) NOT NULL,
	"campaign_type" "campaign_type" DEFAULT 'mixed',
	"scheduled_at" timestamp,
	"status" "campaign_status" DEFAULT 'draft',
	"total_contacts" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cdrs_lists_assigned" (
	"cdr_list_assigned_id" bigserial PRIMARY KEY NOT NULL,
	"cdrs_list_id" bigint NOT NULL,
	"user_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cdrs_lists_contacts" (
	"cdr_list_contact_id" bigserial PRIMARY KEY NOT NULL,
	"cdrs_list_id" bigint NOT NULL,
	"contact_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cdrs_lists" (
	"cdr_list_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"list_name" varchar(200),
	"status" boolean NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cdrs" (
	"cdr_id" bigserial PRIMARY KEY NOT NULL,
	"contact_id" bigint NOT NULL,
	"list_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"connected" boolean,
	"duration" time,
	"date" timestamp,
	"recording" text,
	"status" varchar(10) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_assigned" (
	"contact_assigned_id" bigserial PRIMARY KEY NOT NULL,
	"contact_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_comments" (
	"contact_comment_id" bigserial PRIMARY KEY NOT NULL,
	"contact_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"comments" text,
	"recording" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_followups" (
	"contact_followup_id" bigserial PRIMARY KEY NOT NULL,
	"contact_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"followup_date" timestamp NOT NULL,
	"followup_done" "followup_done" DEFAULT 'No' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_status" (
	"contact_status_id" bigserial PRIMARY KEY NOT NULL,
	"contact_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_uploads" (
	"contacts_uploads_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"contact_id" bigint NOT NULL,
	"file_name" varchar(100) NOT NULL,
	"file_path" text,
	"type" varchar(30) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_visits" (
	"contacts_visits_id" serial PRIMARY KEY NOT NULL,
	"contact_id" bigint NOT NULL,
	"user_id" bigint,
	"caller_id" bigint,
	"attendee_id" bigint,
	"project_id" bigint,
	"broker_id" bigint,
	"property_id" bigint,
	"driver_id" bigint,
	"visit_date" timestamp,
	"pickup_time" time,
	"pickup_location" varchar(50),
	"family_vist" "family_visit" DEFAULT 'No',
	"group_booking" boolean,
	"budget" varchar(20),
	"decision_time" varchar(20),
	"remark" text,
	"rating" integer,
	"interested" boolean,
	"loan_required" boolean,
	"visit_done" "visit_done",
	"visit_postponed" "visit_postponed",
	"updated" timestamp,
	"update_by" bigint,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"contact_id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"project_id" bigint,
	"broker_id" bigint,
	"name" varchar(50),
	"phone_wa" integer NOT NULL,
	"phone_alternate" integer DEFAULT 0,
	"email" varchar(50),
	"budget" integer DEFAULT 0,
	"source" integer,
	"is_lead" "is_lead" DEFAULT 'No' NOT NULL,
	"bulk_import" "bulk_import",
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "contacts_phone_wa_unique" UNIQUE("phone_wa")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint,
	"user_role" bigint,
	"broker_id" bigint,
	"user_name" varchar(50),
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"mobile_1" varchar(10) NOT NULL,
	"mobile_2" varchar(10),
	"email" varchar(50),
	"password" text NOT NULL,
	"gender" integer,
	"joining" date,
	"pancard" varchar(20),
	"aadhar" varchar(20),
	"driving_license" varchar(20),
	"last_login" timestamp,
	"status" boolean DEFAULT false,
	"profile_pic" text,
	"timezone" varchar(50) DEFAULT 'UTC',
	"otp" varchar(4),
	"add_by" bigint NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"project_id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint,
	"user_id" bigint NOT NULL,
	"builder_id" bigint NOT NULL,
	"project_name" varchar(100) NOT NULL,
	"project_description" text,
	"project_highlight" text,
	"project_address" text,
	"pincode" integer,
	"state" integer,
	"city" integer,
	"rera" "rera",
	"rera_1" varchar(20),
	"rera_2" varchar(20),
	"rera_3" varchar(20),
	"rera_4" varchar(20),
	"plot_area" varchar(11),
	"project_authority" integer,
	"number_buildings" integer,
	"possession_date" date,
	"fb" varchar(100),
	"instagram" varchar(100),
	"map" text,
	"website" varchar(100),
	"project_type" varchar(15),
	"project_logo" text,
	"project_image" text,
	"featured_image" text,
	"no_of_building" integer DEFAULT 0,
	"no_of_plots" integer DEFAULT 0,
	"og_title" varchar(255),
	"og_description" text,
	"og_image" varchar(245),
	"og_locale" varchar(50),
	"og_location" varchar(255),
	"og_url" varchar(255),
	"status" boolean DEFAULT false,
	"updated_by" bigint,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_inventories" (
	"project_inventory_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"project_id" bigint NOT NULL,
	"config_id" integer,
	"building" varchar(10),
	"floor" varchar(10),
	"unit_number" varchar(10),
	"carpet_area" varchar(10),
	"sellable_area" varchar(10),
	"price_expected" numeric(12, 2),
	"price_psf" numeric(12, 2),
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_medias" (
	"project_media_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"project_id" bigint NOT NULL,
	"media_type" integer NOT NULL,
	"name" varchar(50),
	"description" text,
	"file_name" varchar(250) NOT NULL,
	"file_path" varchar(250) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_documents" (
	"project_document_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"project_id" bigint NOT NULL,
	"document_type" integer NOT NULL,
	"document_name" varchar(50),
	"document_description" text,
	"file_name" varchar(50),
	"file_path" varchar(250),
	"status" boolean DEFAULT true,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_amenities" (
	"project_id" bigint NOT NULL,
	"ameneties_id" bigint NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_localities" (
	"project_locality_id" bigserial PRIMARY KEY NOT NULL,
	"project_id" bigint,
	"x_add_localities_id" bigint,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_nearbys" (
	"project_nearby_id" bigserial PRIMARY KEY NOT NULL,
	"project_id" bigint,
	"nearby_project_id" bigint,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_tags" (
	"project_tag_id" bigserial PRIMARY KEY NOT NULL,
	"project_id" bigint NOT NULL,
	"property_id" bigint,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_users" (
	"project_users_id" bigserial PRIMARY KEY NOT NULL,
	"project_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"role_id" bigint NOT NULL,
	"add_by_user" bigint NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"property_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"property_type_id" integer NOT NULL,
	"property_config_id" integer,
	"property_building_type_id" integer,
	"property_transaction_id" integer,
	"name" varchar(100) NOT NULL,
	"description" text,
	"project_name" varchar(50),
	"project_builder" varchar(50),
	"address" text,
	"pincode" varchar(10),
	"locality" integer,
	"city" integer,
	"state" integer,
	"property_furnish_id" integer,
	"availability" integer,
	"area_carpet" integer,
	"area_built_up" integer,
	"area_super" integer,
	"floors" integer,
	"floors_number" integer,
	"parking" boolean,
	"bathrooms" integer,
	"balcony" integer,
	"terrace" integer,
	"poojaroom" boolean,
	"servant" boolean,
	"garden" boolean,
	"pantry" boolean,
	"pet_friendly" boolean,
	"power_backup" boolean,
	"front_open" boolean,
	"roadfacing" boolean,
	"corner_property" boolean,
	"boundary_wall" boolean,
	"wire_fencing" boolean,
	"open_sides" boolean,
	"direction" varchar(10),
	"price" numeric(12, 2),
	"deposit" numeric(12, 2),
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_highlights" (
	"property_highlight_id" bigserial PRIMARY KEY NOT NULL,
	"property_id" bigint NOT NULL,
	"highlight_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "property_localities" (
	"property_locality_id" bigserial PRIMARY KEY NOT NULL,
	"property_id" bigint,
	"locality_id" bigint,
	"createdAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "property_medias" (
	"property_media_id" bigserial PRIMARY KEY NOT NULL,
	"property_id" bigint NOT NULL,
	"media_type_id" integer NOT NULL,
	"media_name" varchar(50),
	"description" varchar(100),
	"file_name" varchar(50) NOT NULL,
	"file_path" varchar(100) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_nearbys" (
	"pnid" serial PRIMARY KEY NOT NULL,
	"pid" integer,
	"anid" integer,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "quotations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"broker_id" bigint,
	"business_id" bigint NOT NULL,
	"contact_id" bigint NOT NULL,
	"property_id" bigint,
	"project_id" bigint,
	"property_area" integer NOT NULL,
	"basic_rate" numeric(12, 2),
	"development_rate" numeric(12, 2),
	"floorrise_rate" numeric(12, 2),
	"gst_rate" integer,
	"basic_amount" numeric(12, 2),
	"development_amount" numeric(12, 2),
	"parking_amount" numeric(12, 2),
	"floorrise_amount" numeric(12, 2),
	"beforetax_amount" numeric(12, 2) NOT NULL,
	"stamp_amount" numeric(12, 2) DEFAULT '0.00',
	"registration_amount" numeric(12, 2),
	"gst_amount" numeric(12, 2),
	"other_amount" numeric(12, 2),
	"discount_amount" numeric(12, 2) DEFAULT '0.00',
	"total_amount" numeric(12, 2) NOT NULL,
	"fld_description" text,
	"valid_until" date,
	"status" "quotation_status" DEFAULT 'draft',
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"task_id" bigserial PRIMARY KEY NOT NULL,
	"contact_id" bigint,
	"user_id" bigint NOT NULL,
	"task_type" integer NOT NULL,
	"task_title" varchar(50) NOT NULL,
	"task_details" text NOT NULL,
	"piority" "priority" DEFAULT 'Low' NOT NULL,
	"start_date" date,
	"due_date" date,
	"complete_Date" date,
	"status" boolean DEFAULT true NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_comments" (
	"task_comment_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"task_id" bigint NOT NULL,
	"comment" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_comments_attachments" (
	"task_comment_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"task_id" bigint NOT NULL,
	"file_name" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"notes_id" bigserial PRIMARY KEY NOT NULL,
	"note_type_id" integer NOT NULL,
	"user_id" bigint NOT NULL,
	"contact_id" bigint,
	"note_title" varchar(100) NOT NULL,
	"note_details" text,
	"private_note" "private_note" DEFAULT 'No' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes_attachments" (
	"note_attachment_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"note_id" bigint NOT NULL,
	"file_name" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"pid" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"duration" integer NOT NULL,
	"status" "plan_status" DEFAULT 'active',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans_addons" (
	"plans_addon_id" serial PRIMARY KEY NOT NULL,
	"paid" integer NOT NULL,
	"value" integer NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"duration" integer NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_features" (
	"pfid" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"feature_id" integer NOT NULL,
	"feature_value" integer NOT NULL,
	"description" varchar(100) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_plans" (
	"upid" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"plan_id" integer NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"status" "user_plan_status" NOT NULL,
	"auto_renew" boolean DEFAULT true,
	"last_payment_date" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_transactions" (
	"user_transaction_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"transaction_type" "transaction_type",
	"amount" numeric(10, 2),
	"payment_method" varchar(255),
	"status" "transaction_status" DEFAULT 'completed',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_emergency" (
	"user_emergency_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"name" varchar(50) NOT NULL,
	"number" integer NOT NULL,
	"relation" varchar(20) NOT NULL,
	"added_by" bigint NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_leaves" (
	"user_leave_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"leave_type_id" integer NOT NULL,
	"leave_reason" varchar(100),
	"no_days" integer NOT NULL,
	"date_start" date NOT NULL,
	"date_end" date NOT NULL,
	"leave_approved" "leave_approved",
	"approved_by" bigint NOT NULL,
	"status" "leave_status" DEFAULT 'Applied' NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"support_ticket_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"subject" varchar(150) NOT NULL,
	"message" text NOT NULL,
	"status" "ticket_status" DEFAULT 'open',
	"priority" "ticket_priority" DEFAULT 'medium',
	"assigned_to" bigint,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "support_ticket_attachments" (
	"support_ticket_attachment_id" bigserial PRIMARY KEY NOT NULL,
	"ticket_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"file_path" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "support_ticket_comments" (
	"support_ticket_comment_id" bigserial PRIMARY KEY NOT NULL,
	"ticket_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"comment" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" bigint,
	"ip_address" varchar(45),
	"user_agent" text,
	"payload" text NOT NULL,
	"last_activity" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" varchar(255),
	"token" varchar(255) NOT NULL,
	"type" varchar(80) NOT NULL,
	"is_revoked" boolean DEFAULT false,
	"expires_at" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"email" varchar(255) PRIMARY KEY NOT NULL,
	"token" varchar(255) NOT NULL,
	"createdAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "message_credit_balance" (
	"balance_id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"credit_type_id" integer NOT NULL,
	"available_units" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "message_credit_purchase" (
	"purchase_id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"credit_type_id" integer NOT NULL,
	"units" integer NOT NULL,
	"amount_paid" numeric(10, 2) NOT NULL,
	"purchased_at" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "message_credit_usage_log" (
	"usage_id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"user_id" bigint,
	"credit_type_id" integer NOT NULL,
	"units_used" integer DEFAULT 1,
	"usage_type" varchar(100),
	"recipient" varchar(100),
	"message_content" text,
	"used_at" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "storage_credit_balance" (
	"balance_id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"storage_remaining_mb" integer DEFAULT 0,
	"last_updated" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "storage_credit_purchase" (
	"purchase_id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"plan_id" integer NOT NULL,
	"storage_allocated_mb" integer NOT NULL,
	"amount_paid" numeric(10, 2) NOT NULL,
	"purchased_at" timestamp DEFAULT now(),
	"valid_until" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "x_add_cities" (
	"city_id" bigserial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"user_id" bigint,
	"business_id" bigint NOT NULL,
	"city_name" varchar(50) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_add_localities" (
	"locality_id" bigserial PRIMARY KEY NOT NULL,
	"city_id" bigint NOT NULL,
	"state_id" integer NOT NULL,
	"user_id" bigint NOT NULL,
	"business_id" integer NOT NULL,
	"locality_name" varchar(50) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_add_nearbys" (
	"nearby_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint DEFAULT 0 NOT NULL,
	"business_id" bigint NOT NULL,
	"nearby_name" varchar(50) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_add_states" (
	"state_id" serial PRIMARY KEY NOT NULL,
	"state_name" varchar(50) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_amenities" (
	"amenity_id" bigserial PRIMARY KEY NOT NULL,
	"amenity_type_id" integer NOT NULL,
	"user_id" bigint DEFAULT 0,
	"business_id" bigint NOT NULL,
	"amenity_name" varchar(100) NOT NULL,
	"order" integer NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_cdrs_status" (
	"cdr_status_id" serial PRIMARY KEY NOT NULL,
	"cdr_status_name" varchar(30) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_db_backups" (
	"dbid" serial PRIMARY KEY NOT NULL,
	"file_name" varchar(100) NOT NULL,
	"file_path" text NOT NULL,
	"add_by" integer NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "x_holidays" (
	"holiday_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint,
	"business_id" bigint NOT NULL,
	"holiday_name" varchar(50) NOT NULL,
	"holiday_date" date NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_leads_source" (
	"lead_source_id" serial PRIMARY KEY NOT NULL,
	"lead_source_name" varchar(50) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_leads_status" (
	"lead_status_id" serial PRIMARY KEY NOT NULL,
	"lead_status_name" varchar(30) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_leads_tags" (
	"lead_tag_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint DEFAULT 0,
	"business_id" bigint NOT NULL,
	"lead_tag_name" varchar(100) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_medias_types" (
	"media_type_id" serial PRIMARY KEY NOT NULL,
	"media_type_parent_id" integer DEFAULT 0,
	"media_type_name" varchar(50) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_notes_types" (
	"note_type_id" serial PRIMARY KEY NOT NULL,
	"note_type_name" varchar(30) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_offers_tags" (
	"property_tag_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint DEFAULT 0,
	"business_id" bigint NOT NULL,
	"property_tag_name" varchar(100) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_message_credit_pricing" (
	"pricing_id" serial PRIMARY KEY NOT NULL,
	"credit_type_id" integer NOT NULL,
	"price_per_unit" numeric(10, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'INR',
	"min_units" integer DEFAULT 1,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "x_message_credit_type" (
	"credit_type_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"channel" varchar(30),
	"unit" varchar(20) DEFAULT 'message',
	"is_active" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "x_plan_addons" (
	"plan_addon_id" serial PRIMARY KEY NOT NULL,
	"plan_addon_name" varchar(50) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_plan_features" (
	"plan_feature_id" serial PRIMARY KEY NOT NULL,
	"plan_feature_name" varchar(100) NOT NULL,
	"description" text,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_priorities" (
	"priority_id" serial PRIMARY KEY NOT NULL,
	"priority_name" varchar(20) NOT NULL,
	"weight" integer DEFAULT 0,
	"color" varchar(20),
	"status" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	CONSTRAINT "x_priorities_priority_name_unique" UNIQUE("priority_name")
);
--> statement-breakpoint
CREATE TABLE "x_settings" (
	"sid" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"value" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_storage_credit_plan" (
	"plan_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"storage_quota_mb" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'INR',
	"duration_days" integer DEFAULT 30,
	"is_active" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "x_task_types" (
	"task_type_id" serial PRIMARY KEY NOT NULL,
	"user_id" bigint,
	"business_id" bigint NOT NULL,
	"task_type_name" varchar(30) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_properties_configs" (
	"property_config_id" serial PRIMARY KEY NOT NULL,
	"property_config_name" varchar(50) NOT NULL,
	"status" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_building_type" (
	"project_building_type_id" serial PRIMARY KEY NOT NULL,
	"project_building_type_name" varchar(100) NOT NULL,
	"description" text,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "storage_credit_usage_log" (
	"usage_id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"user_id" bigint,
	"file_name" varchar(255),
	"file_size_mb" numeric(10, 2) NOT NULL,
	"action_type" varchar(20) DEFAULT 'upload',
	"description" text,
	"used_at" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "x_amenities_types" (
	"amenity_type_id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint,
	"business_id" bigint NOT NULL,
	"amenity_type_name" varchar(100) NOT NULL,
	"order" integer NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_measurement_units" (
	"measurement_unit_id" serial PRIMARY KEY NOT NULL,
	"measurement_unit_name" varchar(50) NOT NULL,
	"description" text,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_projects_authorities" (
	"project_authority_id" serial PRIMARY KEY NOT NULL,
	"project_authority_name" varchar(100) NOT NULL,
	"description" text,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_projects_highlights" (
	"project_highlight_id" serial PRIMARY KEY NOT NULL,
	"user_id" bigint DEFAULT 0 NOT NULL,
	"business_id" bigint NOT NULL,
	"project_highlight_name" varchar(100) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_projects_types" (
	"project_type_id" serial PRIMARY KEY NOT NULL,
	"project_type_parent_id" integer DEFAULT 0,
	"project_type_name" varchar(50) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_projects_building_type" (
	"project_building_type_id" serial PRIMARY KEY NOT NULL,
	"project_building_type_name" varchar(100) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_properties_deposits" (
	"property_deposit_id" serial PRIMARY KEY NOT NULL,
	"user_id" bigint,
	"business_id" bigint NOT NULL,
	"property_deposit_name" varchar(50) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_properties_furnishs" (
	"property_furnish_id" serial PRIMARY KEY NOT NULL,
	"property_furnish_type" varchar(50) NOT NULL,
	"status" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_properties_transactions" (
	"property_transaction_id" serial PRIMARY KEY NOT NULL,
	"property_transaction_type" varchar(50) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_property_measurement" (
	"property_measurement_id" serial PRIMARY KEY NOT NULL,
	"property_measurement_name" varchar(100) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_property_area_type" (
	"property_area_type_id" serial PRIMARY KEY NOT NULL,
	"property_area_type_name" varchar(100) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_users_roles" (
	"user_role_id" serial PRIMARY KEY NOT NULL,
	"user_role_name" varchar(30) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_business_id_business_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("business_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "x_projects_building_type_name_idx" ON "x_building_type" USING btree ("project_building_type_name");--> statement-breakpoint
CREATE INDEX "x_projects_building_type_status_idx" ON "x_building_type" USING btree ("status");