-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.activity_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  project_id uuid,
  task_id uuid,
  action text NOT NULL,
  details jsonb,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT activity_log_pkey PRIMARY KEY (id),
  CONSTRAINT activity_log_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT activity_log_project_id_internal_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.internal_projects(id),
  CONSTRAINT activity_log_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);
CREATE TABLE public.automations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  trigger_type text NOT NULL,
  trigger_value text,
  action_type text NOT NULL,
  action_value text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT automations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.bank_accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  account_name text NOT NULL,
  bank_name text NOT NULL,
  account_number text,
  currency text DEFAULT 'USD'::text,
  is_primary boolean DEFAULT false,
  balance text DEFAULT '0'::text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT bank_accounts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.campaigns (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'draft'::text,
  sent_at timestamp without time zone,
  recipient_count text DEFAULT '0'::text,
  created_by uuid,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  audience text,
  open_count integer DEFAULT 0,
  click_count integer DEFAULT 0,
  scheduled_at timestamp without time zone,
  CONSTRAINT campaigns_pkey PRIMARY KEY (id),
  CONSTRAINT campaigns_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id)
);
CREATE TABLE public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  content text NOT NULL,
  user_id uuid,
  project_id uuid,
  task_id uuid,
  created_at timestamp without time zone DEFAULT now(),
  attachment_url text,
  CONSTRAINT comments_pkey PRIMARY KEY (id),
  CONSTRAINT comments_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT comments_project_id_internal_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.internal_projects(id),
  CONSTRAINT comments_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);
CREATE TABLE public.company_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_name text NOT NULL DEFAULT 'Bold Ideas Innovations Ltd.'::text,
  company_address text,
  company_email text,
  company_phone text,
  company_website text,
  logo_url text,
  signature_url text,
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT company_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.direct_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  project_id uuid,
  subject text,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT direct_messages_pkey PRIMARY KEY (id),
  CONSTRAINT direct_messages_sender_id_users_id_fk FOREIGN KEY (sender_id) REFERENCES public.users(id),
  CONSTRAINT direct_messages_recipient_id_users_id_fk FOREIGN KEY (recipient_id) REFERENCES public.users(id),
  CONSTRAINT direct_messages_project_id_internal_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.internal_projects(id)
);
CREATE TABLE public.documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid,
  name text NOT NULL,
  url text NOT NULL,
  type text DEFAULT 'file'::text,
  uploaded_by uuid,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT documents_pkey PRIMARY KEY (id),
  CONSTRAINT documents_project_id_internal_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.internal_projects(id),
  CONSTRAINT documents_uploaded_by_users_id_fk FOREIGN KEY (uploaded_by) REFERENCES public.users(id)
);
CREATE TABLE public.expenses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category text NOT NULL,
  description text,
  amount text NOT NULL,
  currency text DEFAULT 'USD'::text,
  expense_date timestamp without time zone DEFAULT now(),
  receipt_url text,
  vendor text,
  is_recurring boolean DEFAULT false,
  created_by uuid,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT expenses_pkey PRIMARY KEY (id),
  CONSTRAINT expenses_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id)
);
CREATE TABLE public.interactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  lead_id uuid,
  type text NOT NULL,
  notes text NOT NULL,
  date timestamp without time zone DEFAULT now(),
  created_by uuid,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT interactions_pkey PRIMARY KEY (id),
  CONSTRAINT interactions_lead_id_leads_id_fk FOREIGN KEY (lead_id) REFERENCES public.leads(id),
  CONSTRAINT interactions_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id)
);
CREATE TABLE public.internal_projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  client_id uuid,
  status text DEFAULT 'active'::text,
  start_date timestamp without time zone,
  due_date timestamp without time zone,
  budget text,
  description text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  type text DEFAULT 'internal'::text,
  manager_id uuid,
  CONSTRAINT internal_projects_pkey PRIMARY KEY (id),
  CONSTRAINT internal_projects_client_id_users_id_fk FOREIGN KEY (client_id) REFERENCES public.users(id),
  CONSTRAINT internal_projects_manager_id_users_id_fk FOREIGN KEY (manager_id) REFERENCES public.users(id)
);
CREATE TABLE public.invoice_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  invoice_id uuid,
  description text,
  quantity text DEFAULT '1'::text,
  unit_price text NOT NULL,
  amount text NOT NULL,
  title text,
  CONSTRAINT invoice_items_pkey PRIMARY KEY (id),
  CONSTRAINT invoice_items_invoice_id_invoices_id_fk FOREIGN KEY (invoice_id) REFERENCES public.invoices(id)
);
CREATE TABLE public.invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_id uuid,
  status text DEFAULT 'draft'::text,
  issue_date timestamp without time zone DEFAULT now(),
  due_date timestamp without time zone,
  total_amount text,
  currency text DEFAULT 'USD'::text,
  notes text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  invoice_number text,
  paid_at timestamp without time zone,
  amount_paid text DEFAULT '0'::text,
  discount_amount text DEFAULT '0'::text,
  discount_type text DEFAULT 'fixed'::text,
  CONSTRAINT invoices_pkey PRIMARY KEY (id),
  CONSTRAINT invoices_client_id_users_id_fk FOREIGN KEY (client_id) REFERENCES public.users(id)
);
CREATE TABLE public.leads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  status text DEFAULT 'new'::text,
  source text,
  notes text,
  assigned_to uuid,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  value text,
  CONSTRAINT leads_pkey PRIMARY KEY (id),
  CONSTRAINT leads_assigned_to_users_id_fk FOREIGN KEY (assigned_to) REFERENCES public.users(id)
);
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'new'::text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT messages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.milestones (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid,
  title text NOT NULL,
  description text,
  status text DEFAULT 'pending'::text,
  due_date timestamp without time zone,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT milestones_pkey PRIMARY KEY (id),
  CONSTRAINT milestones_project_id_internal_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.internal_projects(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  link text,
  is_read boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  invoice_id uuid,
  receipt_id uuid,
  amount text NOT NULL,
  currency text DEFAULT 'USD'::text,
  payment_method text,
  payment_date timestamp without time zone DEFAULT now(),
  notes text,
  created_by uuid,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_invoice_id_invoices_id_fk FOREIGN KEY (invoice_id) REFERENCES public.invoices(id),
  CONSTRAINT payments_receipt_id_receipts_id_fk FOREIGN KEY (receipt_id) REFERENCES public.receipts(id),
  CONSTRAINT payments_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id)
);
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content jsonb,
  excerpt text,
  cover_image text,
  status text DEFAULT 'draft'::text,
  published_at timestamp without time zone,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT posts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.project_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text DEFAULT 'member'::text,
  joined_at timestamp without time zone DEFAULT now(),
  CONSTRAINT project_members_pkey PRIMARY KEY (id),
  CONSTRAINT project_members_project_id_internal_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.internal_projects(id),
  CONSTRAINT project_members_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  problem text NOT NULL,
  solution text NOT NULL,
  result text NOT NULL,
  image_url text,
  tags jsonb,
  is_published boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);
CREATE TABLE public.receipts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  invoice_id uuid,
  receipt_number text NOT NULL,
  amount_paid text NOT NULL,
  payment_method text,
  payment_reference text,
  issued_at timestamp without time zone DEFAULT now(),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT receipts_pkey PRIMARY KEY (id),
  CONSTRAINT receipts_invoice_id_invoices_id_fk FOREIGN KEY (invoice_id) REFERENCES public.invoices(id)
);
CREATE TABLE public.sequence_enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sequence_id uuid NOT NULL,
  user_id uuid,
  lead_id uuid,
  status text DEFAULT 'active'::text,
  current_step integer DEFAULT 1,
  next_run_at timestamp without time zone,
  enrolled_at timestamp without time zone DEFAULT now(),
  completed_at timestamp without time zone,
  CONSTRAINT sequence_enrollments_pkey PRIMARY KEY (id),
  CONSTRAINT sequence_enrollments_sequence_id_sequences_id_fk FOREIGN KEY (sequence_id) REFERENCES public.sequences(id),
  CONSTRAINT sequence_enrollments_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT sequence_enrollments_lead_id_leads_id_fk FOREIGN KEY (lead_id) REFERENCES public.leads(id)
);
CREATE TABLE public.sequence_steps (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sequence_id uuid NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  delay_days integer DEFAULT 0,
  step_order integer NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT sequence_steps_pkey PRIMARY KEY (id),
  CONSTRAINT sequence_steps_sequence_id_sequences_id_fk FOREIGN KEY (sequence_id) REFERENCES public.sequences(id)
);
CREATE TABLE public.sequences (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text DEFAULT 'active'::text,
  created_by uuid,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT sequences_pkey PRIMARY KEY (id),
  CONSTRAINT sequences_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id)
);
CREATE TABLE public.tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text DEFAULT 'todo'::text,
  priority text DEFAULT 'medium'::text,
  project_id uuid,
  assignee_id uuid,
  due_date timestamp without time zone,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  attachment_url text,
  estimated_minutes integer DEFAULT 0,
  subtasks jsonb DEFAULT '[]'::jsonb,
  CONSTRAINT tasks_pkey PRIMARY KEY (id),
  CONSTRAINT tasks_project_id_internal_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.internal_projects(id),
  CONSTRAINT tasks_assignee_id_users_id_fk FOREIGN KEY (assignee_id) REFERENCES public.users(id)
);
CREATE TABLE public.time_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  task_id uuid,
  user_id uuid,
  start_time timestamp without time zone NOT NULL,
  end_time timestamp without time zone,
  duration text,
  description text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT time_logs_pkey PRIMARY KEY (id),
  CONSTRAINT time_logs_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id),
  CONSTRAINT time_logs_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  email text NOT NULL,
  role text DEFAULT 'user'::text,
  name text,
  created_at timestamp without time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  avatar_url text,
  bio text,
  address text,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);