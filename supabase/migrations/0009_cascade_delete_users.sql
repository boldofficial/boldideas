-- Migration: Add ON DELETE CASCADE to all foreign keys referencing users table
-- This allows permanent deletion of users and all their related records

-- activity_log
ALTER TABLE public.activity_log DROP CONSTRAINT IF EXISTS activity_log_user_id_users_id_fk;
ALTER TABLE public.activity_log ADD CONSTRAINT activity_log_user_id_users_id_fk 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- campaigns
ALTER TABLE public.campaigns DROP CONSTRAINT IF EXISTS campaigns_created_by_users_id_fk;
ALTER TABLE public.campaigns ADD CONSTRAINT campaigns_created_by_users_id_fk 
  FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;

-- comments
ALTER TABLE public.comments DROP CONSTRAINT IF EXISTS comments_user_id_users_id_fk;
ALTER TABLE public.comments ADD CONSTRAINT comments_user_id_users_id_fk 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- direct_messages (sender)
ALTER TABLE public.direct_messages DROP CONSTRAINT IF EXISTS direct_messages_sender_id_users_id_fk;
ALTER TABLE public.direct_messages ADD CONSTRAINT direct_messages_sender_id_users_id_fk 
  FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- direct_messages (recipient)
ALTER TABLE public.direct_messages DROP CONSTRAINT IF EXISTS direct_messages_recipient_id_users_id_fk;
ALTER TABLE public.direct_messages ADD CONSTRAINT direct_messages_recipient_id_users_id_fk 
  FOREIGN KEY (recipient_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- documents
ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS documents_uploaded_by_users_id_fk;
ALTER TABLE public.documents ADD CONSTRAINT documents_uploaded_by_users_id_fk 
  FOREIGN KEY (uploaded_by) REFERENCES public.users(id) ON DELETE SET NULL;

-- expenses
ALTER TABLE public.expenses DROP CONSTRAINT IF EXISTS expenses_created_by_users_id_fk;
ALTER TABLE public.expenses ADD CONSTRAINT expenses_created_by_users_id_fk 
  FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;

-- interactions
ALTER TABLE public.interactions DROP CONSTRAINT IF EXISTS interactions_created_by_users_id_fk;
ALTER TABLE public.interactions ADD CONSTRAINT interactions_created_by_users_id_fk 
  FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;

-- internal_projects (client_id)
ALTER TABLE public.internal_projects DROP CONSTRAINT IF EXISTS internal_projects_client_id_users_id_fk;
ALTER TABLE public.internal_projects ADD CONSTRAINT internal_projects_client_id_users_id_fk 
  FOREIGN KEY (client_id) REFERENCES public.users(id) ON DELETE SET NULL;

-- internal_projects (manager_id)
ALTER TABLE public.internal_projects DROP CONSTRAINT IF EXISTS internal_projects_manager_id_users_id_fk;
ALTER TABLE public.internal_projects ADD CONSTRAINT internal_projects_manager_id_users_id_fk 
  FOREIGN KEY (manager_id) REFERENCES public.users(id) ON DELETE SET NULL;

-- invoices
ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_client_id_users_id_fk;
ALTER TABLE public.invoices ADD CONSTRAINT invoices_client_id_users_id_fk 
  FOREIGN KEY (client_id) REFERENCES public.users(id) ON DELETE SET NULL;

-- leads
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_assigned_to_users_id_fk;
ALTER TABLE public.leads ADD CONSTRAINT leads_assigned_to_users_id_fk 
  FOREIGN KEY (assigned_to) REFERENCES public.users(id) ON DELETE SET NULL;

-- notifications
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_users_id_fk;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_user_id_users_id_fk 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- payments
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_created_by_users_id_fk;
ALTER TABLE public.payments ADD CONSTRAINT payments_created_by_users_id_fk 
  FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;

-- project_members
ALTER TABLE public.project_members DROP CONSTRAINT IF EXISTS project_members_user_id_users_id_fk;
ALTER TABLE public.project_members ADD CONSTRAINT project_members_user_id_users_id_fk 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- sequence_enrollments
ALTER TABLE public.sequence_enrollments DROP CONSTRAINT IF EXISTS sequence_enrollments_user_id_users_id_fk;
ALTER TABLE public.sequence_enrollments ADD CONSTRAINT sequence_enrollments_user_id_users_id_fk 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- sequences
ALTER TABLE public.sequences DROP CONSTRAINT IF EXISTS sequences_created_by_users_id_fk;
ALTER TABLE public.sequences ADD CONSTRAINT sequences_created_by_users_id_fk 
  FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;

-- tasks
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_assignee_id_users_id_fk;
ALTER TABLE public.tasks ADD CONSTRAINT tasks_assignee_id_users_id_fk 
  FOREIGN KEY (assignee_id) REFERENCES public.users(id) ON DELETE SET NULL;

-- time_logs
ALTER TABLE public.time_logs DROP CONSTRAINT IF EXISTS time_logs_user_id_users_id_fk;
ALTER TABLE public.time_logs ADD CONSTRAINT time_logs_user_id_users_id_fk 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
