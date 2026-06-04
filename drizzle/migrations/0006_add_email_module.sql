CREATE TABLE IF NOT EXISTS "email_accounts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "label" text DEFAULT 'Shared Inbox' NOT NULL,
  "email" text NOT NULL,
  "provider" text DEFAULT 'zoho' NOT NULL,
  "from_name" text,
  "signature" text,
  "is_default" boolean DEFAULT true,
  "last_synced_at" timestamp,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "email_messages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "account_id" uuid,
  "message_id" text,
  "thread_key" text,
  "mailbox" text DEFAULT 'INBOX' NOT NULL,
  "direction" text DEFAULT 'inbound' NOT NULL,
  "status" text DEFAULT 'received' NOT NULL,
  "from_email" text,
  "from_name" text,
  "to_emails" text,
  "cc_emails" text,
  "bcc_emails" text,
  "subject" text,
  "text_body" text,
  "html_body" text,
  "sent_at" timestamp,
  "received_at" timestamp,
  "read_at" timestamp,
  "lead_id" uuid,
  "client_id" uuid,
  "created_by" uuid,
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

DO $$ BEGIN
 ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_account_id_email_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "email_accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "email_messages_message_id_mailbox_idx" ON "email_messages" ("message_id", "mailbox");
CREATE INDEX IF NOT EXISTS "email_messages_thread_key_idx" ON "email_messages" ("thread_key");
CREATE INDEX IF NOT EXISTS "email_messages_lead_id_idx" ON "email_messages" ("lead_id");
CREATE INDEX IF NOT EXISTS "email_messages_client_id_idx" ON "email_messages" ("client_id");
