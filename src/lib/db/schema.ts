
import { pgTable, text, timestamp, boolean, uuid, jsonb, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // Matches Supabase Auth ID
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('user'), // 'admin' | 'user'
  isActive: boolean('is_active').default(true),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  address: text('address'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(), // Client Name / Subject
  slug: text('slug').notNull().unique(),

  // The Schematic Content Structure
  problem: text('problem').notNull(), // The Glitch
  solution: text('solution').notNull(), // The Fix
  result: text('result').notNull(), // The Upgrade

  imageUrl: text('image_url'), // Optional schematic diagram or screenshot
  tags: jsonb('tags').$type<string[]>(), // e.g. ["Automation", "AI", "Zapier"]

  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),         // Identity_Name
  email: text('email').notNull(),       // Comms_Email
  content: text('content').notNull(),   // Transmission_Content
  status: text('status').default('new'), // 'new', 'read', 'replied'
  createdAt: timestamp('created_at').defaultNow(),
});


export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: jsonb('content'),
  excerpt: text('excerpt'),
  coverImage: text('cover_image'),
  status: text('status').default('draft'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// --- Agency Operating System Tables ---

export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  company: text('company'),
  status: text('status').default('new'), // 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
  source: text('source'), // 'website', 'referral', 'ads', etc.
  notes: text('notes'),
  assignedTo: uuid('assigned_to').references(() => users.id), // Staff assigned
  value: text('value'), // Estimated deal value
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const interactions = pgTable('interactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'call', 'email', 'meeting', 'note'
  notes: text('notes').notNull(),
  date: timestamp('date').defaultNow(),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const internalProjects = pgTable('internal_projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  clientId: uuid('client_id').references(() => users.id),
  managerId: uuid('manager_id').references(() => users.id),
  type: text('type').default('internal'), // 'internal' | 'client'
  status: text('status').default('active'), // 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
  startDate: timestamp('start_date'),
  dueDate: timestamp('due_date'),
  budget: text('budget'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').default('todo'), // 'todo' | 'in_progress' | 'review' | 'done'
  priority: text('priority').default('medium'), // 'low' | 'medium' | 'high' | 'urgent'
  projectId: uuid('project_id').references(() => internalProjects.id),
  assigneeId: uuid('assignee_id').references(() => users.id),
  dueDate: timestamp('due_date'),
  attachmentUrl: text('attachment_url'),
  estimatedMinutes: integer('estimated_minutes').default(0),
  subtasks: jsonb('subtasks').default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const projectMembers = pgTable('project_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => internalProjects.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: text('role').default('member'), // member, leader, etc.
  joinedAt: timestamp('joined_at').defaultNow(),
});

export const campaigns = pgTable('campaigns', {
  id: uuid('id').defaultRandom().primaryKey(),
  subject: text('subject').notNull(),
  content: text('content').notNull(), // HTML content
  status: text('status').default('draft'), // 'draft' | 'scheduled' | 'sent' | 'archived'
  audience: text('audience'), // 'all' | 'leads' | 'clients' | 'staff'
  recipientCount: text('recipient_count').default('0'), // Keeping as text to avoid type conflict during push
  openCount: integer('open_count').default(0),
  clickCount: integer('click_count').default(0),
  scheduledAt: timestamp('scheduled_at'),
  sentAt: timestamp('sent_at'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const sequences = pgTable('sequences', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').default('active'), // 'active' | 'archived'
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const sequenceSteps = pgTable('sequence_steps', {
  id: uuid('id').defaultRandom().primaryKey(),
  sequenceId: uuid('sequence_id').references(() => sequences.id, { onDelete: 'cascade' }).notNull(),
  subject: text('subject').notNull(),
  content: text('content').notNull(),
  delayDays: integer('delay_days').default(0), // Days to wait after enrollment or previous step
  order: integer('step_order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const sequenceEnrollments = pgTable('sequence_enrollments', {
  id: uuid('id').defaultRandom().primaryKey(),
  sequenceId: uuid('sequence_id').references(() => sequences.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'cascade' }),
  status: text('status').default('active'), // 'active' | 'completed' | 'paused' | 'cancelled'
  currentStep: integer('current_step').default(1),
  nextRunAt: timestamp('next_run_at'),
  enrolledAt: timestamp('enrolled_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

export const automations = pgTable('automations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  triggerType: text('trigger_type').notNull(), // 'lead_created' | 'lead_status_changed' | 'project_created'
  triggerValue: text('trigger_value'), // e.g., 'qualified' for status_changed
  actionType: text('action_type').notNull(), // 'enroll_in_sequence' | 'send_email'
  actionValue: text('action_value').notNull(), // e.g., sequenceId
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// --- Phase 2: Finance & Advanced PM ---

export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  clientId: uuid('client_id').references(() => users.id),
  invoiceNumber: text('invoice_number'),
  status: text('status').default('draft'), // 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'partial'
  issueDate: timestamp('issue_date').defaultNow(),
  dueDate: timestamp('due_date'),
  paidAt: timestamp('paid_at'),
  totalAmount: text('total_amount'),
  amountPaid: text('amount_paid').default('0'), // For partial payment tracking
  discountAmount: text('discount_amount').default('0'),
  discountType: text('discount_type').default('fixed'), // 'fixed' | 'percentage'
  currency: text('currency').default('USD'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const invoiceItems = pgTable('invoice_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  invoiceId: uuid('invoice_id').references(() => invoices.id, { onDelete: 'cascade' }),
  title: text('title'),
  description: text('description'),
  quantity: text('quantity').default('1'),
  unitPrice: text('unit_price').notNull(),
  amount: text('amount').notNull(),
});

// Receipts - Generated when invoice is paid
export const receipts = pgTable('receipts', {
  id: uuid('id').defaultRandom().primaryKey(),
  invoiceId: uuid('invoice_id').references(() => invoices.id, { onDelete: 'cascade' }),
  receiptNumber: text('receipt_number').notNull(),
  amountPaid: text('amount_paid').notNull(),
  paymentMethod: text('payment_method'), // 'bank_transfer', 'card', 'cash', 'crypto', 'other'
  paymentReference: text('payment_reference'),
  issuedAt: timestamp('issued_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Payments - Track partial and full payments
export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  invoiceId: uuid('invoice_id').references(() => invoices.id, { onDelete: 'cascade' }),
  receiptId: uuid('receipt_id').references(() => receipts.id, { onDelete: 'set null' }),
  amount: text('amount').notNull(),
  currency: text('currency').default('USD'),
  paymentMethod: text('payment_method'),
  paymentDate: timestamp('payment_date').defaultNow(),
  notes: text('notes'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Bank Accounts
export const bankAccounts = pgTable('bank_accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  accountName: text('account_name').notNull(),
  bankName: text('bank_name').notNull(),
  accountNumber: text('account_number'),
  currency: text('currency').default('USD'),
  isPrimary: boolean('is_primary').default(false),
  balance: text('balance').default('0'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Expenses
export const expenses = pgTable('expenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  category: text('category').notNull(), // 'software', 'office', 'marketing', 'travel', 'utilities', 'salary', 'other'
  description: text('description'),
  amount: text('amount').notNull(),
  currency: text('currency').default('USD'),
  expenseDate: timestamp('expense_date').defaultNow(),
  receiptUrl: text('receipt_url'),
  vendor: text('vendor'),
  isRecurring: boolean('is_recurring').default(false),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Company Global Settings
export const companySettings = pgTable('company_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyName: text('company_name').notNull().default('Bold Ideas Innovations Ltd.'),
  companyAddress: text('company_address'),
  companyEmail: text('company_email'),
  companyPhone: text('company_phone'),
  companyWebsite: text('company_website'),
  logoUrl: text('logo_url'),
  signatureUrl: text('signature_url'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const milestones = pgTable('milestones', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => internalProjects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').default('pending'), // 'pending' | 'in_progress' | 'completed' | 'blocked'
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => internalProjects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  url: text('url').notNull(),
  type: text('type').default('file'),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  attachmentUrl: text('attachment_url'),
  userId: uuid('user_id').references(() => users.id),
  projectId: uuid('project_id').references(() => internalProjects.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

// --- Internal Communication System ---

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(), // 'task_assigned' | 'project_update' | 'message' | 'announcement'
  title: text('title').notNull(),
  message: text('message'),
  link: text('link'), // Navigation target e.g. '/admin/projects/abc123'
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const directMessages = pgTable('direct_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  recipientId: uuid('recipient_id').references(() => users.id).notNull(),
  projectId: uuid('project_id').references(() => internalProjects.id), // Optional context
  subject: text('subject'),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// --- Phase 2: Collaboration & Real-time Extensions ---

export const timeLogs = pgTable('time_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  duration: text('duration'), // Total seconds as string to avoid largeint issues
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const activityLog = pgTable('activity_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  projectId: uuid('project_id').references(() => internalProjects.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'cascade' }),
  action: text('action').notNull(), // 'task_completed', 'comment_posted', etc.
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow(),
});

// --- Client Portal Tables ---

export const projectFiles = pgTable('project_files', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => internalProjects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  url: text('url').notNull(),
  type: text('type').default('document'), // 'deliverable', 'document', 'asset', 'image'
  sizeBytes: integer('size_bytes'),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// --- Client Ticket System ---

export const tickets = pgTable('tickets', {
  id: uuid('id').defaultRandom().primaryKey(),
  ticketNumber: text('ticket_number').unique(), // Auto-generated: TKT-YYYYMMDD-0001
  clientId: uuid('client_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  projectId: uuid('project_id').references(() => internalProjects.id, { onDelete: 'set null' }),
  assignedTo: uuid('assigned_to').references(() => users.id, { onDelete: 'set null' }),
  department: text('department').default('general'), // 'general' | 'billing' | 'technical' | 'sales'
  subject: text('subject').notNull(),
  description: text('description').notNull(),
  priority: text('priority').default('medium'), // 'low' | 'medium' | 'high' | 'urgent'
  status: text('status').default('open'), // 'open' | 'awaiting_reply' | 'in_progress' | 'on_hold' | 'resolved' | 'closed'
  rating: integer('rating'), // 1-5 customer satisfaction rating
  ratingComment: text('rating_comment'),
  firstResponseAt: timestamp('first_response_at'), // For SLA tracking
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const ticketAttachments = pgTable('ticket_attachments', {
  id: uuid('id').defaultRandom().primaryKey(),
  ticketId: uuid('ticket_id').references(() => tickets.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  sizeBytes: integer('size_bytes'),
  uploadedBy: uuid('uploaded_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const ticketComments = pgTable('ticket_comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  ticketId: uuid('ticket_id').references(() => tickets.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }).notNull(),
  content: text('content').notNull(),
  isInternal: boolean('is_internal').default(false), // Internal notes visible only to staff
  attachmentUrl: text('attachment_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const cannedResponses = pgTable('canned_responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  department: text('department'), // Optional: filter by department
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const ticketActivity = pgTable('ticket_activity', {
  id: uuid('id').defaultRandom().primaryKey(),
  ticketId: uuid('ticket_id').references(() => tickets.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: text('action').notNull(), // 'created' | 'status_changed' | 'assigned' | 'priority_changed' | 'commented'
  oldValue: text('old_value'),
  newValue: text('new_value'),
  createdAt: timestamp('created_at').defaultNow(),
});
