import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  numeric,
} from 'drizzle-orm/pg-core';

// ============================================================================
// CORE TABLES
// ============================================================================

/** Users — clients, designers, admins, staff */
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  mobileNumber: text('mobile_number'),
  roles: text('roles').array().notNull().default([]),          // ['Client'] | ['Designer'] | ['Admin'] | etc.
  avatarUrl: text('avatar_url'),
  avatarHint: text('avatar_hint'),
  joinDate: timestamp('join_date', { withTimezone: true }).defaultNow(),
  lastLogin: timestamp('last_login', { withTimezone: true }),
  status: text('status').notNull().default('Active'),           // 'Active' | 'Suspended'
  // Staff-specific fields (null for non-staff)
  phone: text('phone'),
  staffRole: text('staff_role'),                                // 'Admin' | 'Manager' | 'Support Staff' | 'Accounts'
  passwordHash: text('password_hash'),
});

/** Designer profiles — extended profile info for users with designer role */
export const designerProfiles = pgTable('designer_profiles', {
  id: text('id').primaryKey(),                                  // e.g. 'des001'
  userId: text('user_id').references(() => users.id),           // FK to users (nullable during migration)
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  email: text('email'),
  avatarUrl: text('avatar_url'),
  imageHint: text('image_hint'),
  bio: text('bio'),
  specialties: text('specialties').array().default([]),
  location: text('location'),
  memberSince: timestamp('member_since', { withTimezone: true }),
  website: text('website'),
  socialLinks: jsonb('social_links').$type<Array<{ platform: string; url: string }>>().default([]),
  profileCompletenessScore: integer('profile_completeness_score').default(0),
  adminRanking: integer('admin_ranking').default(3),
  clientRatingAverage: numeric('client_rating_average', { precision: 3, scale: 2 }),
  clientRatingCount: integer('client_rating_count').default(0),
  overallRanking: integer('overall_ranking').default(3),
  badges: text('badges').array().default([]),                   // 'Top Rated' | 'Rising Talent' | 'On-Time Delivery' | 'Verified'
  status: text('status').notNull().default('Active'),           // 'Active' | 'Pending Approval' | 'Suspended'
  servicesApproved: integer('services_approved').default(0),
  portfolioLink: text('portfolio_link'),
});

/** Site settings — single-row configuration */
export const siteSettings = pgTable('site_settings', {
  id: text('id').primaryKey().default('default'),
  platformName: text('platform_name').default('DesignFlow'),
  contactEmail: text('contact_email'),
  defaultCurrency: text('default_currency').default('INR'),
  allowClientRegistrations: boolean('allow_client_registrations').default(true),
  allowDesignerRegistrations: boolean('allow_designer_registrations').default(true),
  termsUrl: text('terms_url'),
  privacyUrl: text('privacy_url'),
  enableMemberships: boolean('enable_memberships').default(false),
  clientBasicPlanName: text('client_basic_plan_name'),
  clientBasicPlanPrice: text('client_basic_plan_price'),
  clientPremiumPlanName: text('client_premium_plan_name'),
  clientPremiumPlanPrice: text('client_premium_plan_price'),
  designerBasicPlanName: text('designer_basic_plan_name'),
  designerBasicPlanPrice: text('designer_basic_plan_price'),
  designerProPlanName: text('designer_pro_plan_name'),
  designerProPlanPrice: text('designer_pro_plan_price'),
  enableFreeTrial: boolean('enable_free_trial').default(false),
  trialDurationDays: integer('trial_duration_days').default(14),
  adminNotificationEmail: text('admin_notification_email'),
  stripeApiKey: text('stripe_api_key'),
  paypalClientId: text('paypal_client_id'),
});

// ============================================================================
// SERVICE TABLES
// ============================================================================

/** Service categories */
export const serviceCategories = pgTable('service_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  slug: text('slug').unique(),
});

/** Service subcategories */
export const serviceSubcategories = pgTable('service_subcategories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  parentCategoryId: text('parent_category_id').references(() => serviceCategories.id),
  slug: text('slug'),
});

/** Services */
export const services = pgTable('services', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  generalDescription: text('general_description'),
  longDescription: text('long_description'),
  category: text('category'),
  categorySlug: text('category_slug'),
  subcategoryId: text('subcategory_id').references(() => serviceSubcategories.id),
  tags: text('tags').array().default([]),
  imageUrl: text('image_url'),
  imageHint: text('image_hint'),
  status: text('status').notNull().default('Draft'),            // 'Active' | 'Draft' | 'Archived'
});

/** Service tiers — child of services */
export const serviceTiers = pgTable('service_tiers', {
  id: text('id').primaryKey(),
  serviceId: text('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),                                 // 'Basic' | 'Standard' | 'Premium'
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
  deliveryTimeMin: integer('delivery_time_min'),
  deliveryTimeMax: integer('delivery_time_max'),
  deliveryTimeUnit: text('delivery_time_unit').default('days'), // 'days' | 'business_days' | 'weeks'
  scope: text('scope').array().default([]),
  iconName: text('icon_name'),
});

/** Service ↔ Designer many-to-many join */
export const serviceApprovedDesigners = pgTable('service_approved_designers', {
  id: text('id').primaryKey(),
  serviceId: text('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  designerId: text('designer_id').notNull().references(() => designerProfiles.id, { onDelete: 'cascade' }),
});

// ============================================================================
// ORDER TABLES
// ============================================================================

/** Orders */
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  clientName: text('client_name').notNull(),
  clientId: text('client_id').references(() => users.id),
  designerName: text('designer_name'),
  designerId: text('designer_id').references(() => designerProfiles.id),
  serviceName: text('service_name').notNull(),
  serviceId: text('service_id').references(() => services.id),
  serviceTier: text('service_tier'),
  serviceScope: text('service_scope').array(),
  orderDate: timestamp('order_date', { withTimezone: true }).defaultNow(),
  dueDate: timestamp('due_date', { withTimezone: true }),
  status: text('status').notNull().default('Pending Assignment'),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('INR'),
  paymentMethod: text('payment_method'),
  transactionId: text('transaction_id'),
  clientBrief: text('client_brief'),
  briefAttachments: jsonb('brief_attachments').$type<Array<{ name: string; url: string; type: string }>>(),
  deliverables: jsonb('deliverables').$type<Array<{ name: string; url: string; submittedAt: string }>>(),
  revisionNotes: text('revision_notes'),
  revisionRequestDate: timestamp('revision_request_date', { withTimezone: true }),
  revisionsAllowed: integer('revisions_allowed').notNull().default(2),
  revisionsUsed: integer('revisions_used').notNull().default(0),
  privateNotes: text('private_notes'),
  privateNotesLastEdited: timestamp('private_notes_last_edited', { withTimezone: true }),
});

/** Order events — timeline of status changes */
export const orderEvents = pgTable('order_events', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
  event: text('event').notNull(),
  actor: text('actor'),
  notes: text('notes'),
});

/** Order milestones */
export const orderMilestones = pgTable('order_milestones', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  dueDate: timestamp('due_date', { withTimezone: true }),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  status: text('status').notNull().default('Pending'),          // 'Pending' | 'Delivered' | 'Paid'
});

/** Order attachments — brief files + deliverable files */
export const orderAttachments = pgTable('order_attachments', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  url: text('url').notNull(),
  type: text('type'),                                           // 'image' | 'pdf' | 'file' | 'deliverable'
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow(),
});

// ============================================================================
// FINANCIAL TABLES
// ============================================================================

/** Transactions — unified for admin + designer views */
export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(),
  orderId: text('order_id').references(() => orders.id),
  userId: text('user_id').references(() => users.id),           // the user this transaction belongs to
  date: timestamp('date', { withTimezone: true }).defaultNow(),
  type: text('type').notNull(),                                 // 'Sale' | 'Payout' | 'Refund' | 'Fee' | 'Earning' | 'Advance'
  status: text('status').notNull().default('Pending'),          // 'Completed' | 'Pending' | 'Failed' | 'Refunded' | 'On Hold' | 'Processing' | 'Cancelled'
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
  paymentMethod: text('payment_method'),                        // 'Razorpay' | 'PhonePe' | 'Bank Transfer'
  clientName: text('client_name'),
  designerName: text('designer_name'),
});

/** Payout requests from designers */
export const payoutRequests = pgTable('payout_requests', {
  id: text('id').primaryKey(),
  designerId: text('designer_id').references(() => designerProfiles.id),
  orderId: text('order_id').references(() => orders.id),
  orderName: text('order_name'),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  reason: text('reason'),
  status: text('status').notNull().default('Pending'),          // 'Pending' | 'Approved' | 'Rejected'
  requestDate: timestamp('request_date', { withTimezone: true }).defaultNow(),
  repaidAmount: numeric('repaid_amount', { precision: 10, scale: 2 }).default('0'),
});

/** Payment methods — cards, UPI, PayPal, bank accounts */
export const paymentMethods = pgTable('payment_methods', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  userName: text('user_name'),
  userRole: text('user_role'),                                  // 'Client' | 'Designer'
  methodType: text('method_type').notNull(),                    // 'Card' | 'UPI' | 'PayPal' | 'Bank Transfer'
  identifier: text('identifier').notNull(),                     // masked card, UPI ID, etc.
  isPrimary: boolean('is_primary').default(false),
  status: text('status').notNull().default('Pending'),          // 'Verified' | 'Pending' | 'Rejected'
  lastUpdated: timestamp('last_updated', { withTimezone: true }).defaultNow(),
});

/** Cart items */
export const cartItems = pgTable('cart_items', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  serviceId: text('service_id').references(() => services.id),
  tierId: text('tier_id').references(() => serviceTiers.id),
  name: text('name').notNull(),
  tierName: text('tier_name'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  imageHint: text('image_hint'),
  quantity: integer('quantity').notNull().default(1),
});

// ============================================================================
// REVIEW / REPORT TABLES
// ============================================================================

/** Reviews — unified for admin + designer views */
export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  orderId: text('order_id').references(() => orders.id),
  authorId: text('author_id').references(() => users.id),
  authorName: text('author_name').notNull(),
  authorRole: text('author_role'),                              // 'Client' | 'Designer'
  recipientId: text('recipient_id').references(() => users.id),
  recipientName: text('recipient_name'),
  serviceName: text('service_name'),
  category: text('category'),
  rating: integer('rating').notNull(),                          // 1-5
  reviewText: text('review_text'),
  reviewDate: timestamp('review_date', { withTimezone: true }).defaultNow(),
  status: text('status').notNull().default('Pending'),          // 'Pending' | 'Approved' | 'Hidden'
  isFeatured: boolean('is_featured').default(false),
  isReported: boolean('is_reported').default(false),
  revisions: integer('revisions').default(0),
  clientAvatarUrl: text('client_avatar_url'),
  clientAvatarHint: text('client_avatar_hint'),
});

/** Reports — user-submitted reports */
export const reports = pgTable('reports', {
  id: text('id').primaryKey(),
  orderId: text('order_id').references(() => orders.id),
  reporterId: text('reporter_id').references(() => users.id),
  reporterName: text('reporter_name').notNull(),
  reportedUserId: text('reported_user_id').references(() => users.id),
  reportedUserName: text('reported_user_name'),
  subject: text('subject').notNull(),
  details: text('details'),
  reportDate: timestamp('report_date', { withTimezone: true }).defaultNow(),
  status: text('status').notNull().default('Open'),             // 'Open' | 'In Progress' | 'Resolved'
});

/** Disputes */
export const disputes = pgTable('disputes', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  designerId: text('designer_id').references(() => designerProfiles.id),
  serviceName: text('service_name'),
  servicePrice: numeric('service_price', { precision: 10, scale: 2 }),
  orderDeadline: timestamp('order_deadline', { withTimezone: true }),
  clientName: text('client_name'),
  disputeType: text('dispute_type').notNull(),                  // 'Deliverable Quality' | 'Non-Delivery' | etc.
  status: text('status').notNull().default('Open'),             // 'Open' | 'Under Review' | 'Resolved (Client Favor)' | etc.
  lastUpdated: timestamp('last_updated', { withTimezone: true }).defaultNow(),
  clientClaim: text('client_claim'),
  designerResponse: text('designer_response'),
  adminNotes: text('admin_notes'),
});

/** Dispute timeline events */
export const disputeTimelineEvents = pgTable('dispute_timeline_events', {
  id: text('id').primaryKey(),
  disputeId: text('dispute_id').notNull().references(() => disputes.id, { onDelete: 'cascade' }),
  actor: text('actor').notNull(),                               // 'Client' | 'Designer' | 'Admin'
  action: text('action').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
});

// ============================================================================
// MESSAGING TABLES
// ============================================================================

/** Conversations */
export const conversations = pgTable('conversations', {
  id: text('id').primaryKey(),
  orderId: text('order_id').references(() => orders.id),
  participantOneId: text('participant_one_id').references(() => users.id),
  participantTwoId: text('participant_two_id').references(() => users.id),
  participantOneName: text('participant_one_name'),
  participantTwoName: text('participant_two_name'),
  participantOneAvatarUrl: text('participant_one_avatar_url'),
  participantTwoAvatarUrl: text('participant_two_avatar_url'),
  participantOneAvatarHint: text('participant_one_avatar_hint'),
  participantTwoAvatarHint: text('participant_two_avatar_hint'),
  lastMessage: text('last_message'),
  lastMessageTimestamp: timestamp('last_message_timestamp', { withTimezone: true }),
  lastReadTimestampOne: timestamp('last_read_timestamp_one', { withTimezone: true }),
  lastReadTimestampTwo: timestamp('last_read_timestamp_two', { withTimezone: true }),
  unreadCountOne: integer('unread_count_one').default(0),
  unreadCountTwo: integer('unread_count_two').default(0),
  isPinnedOne: boolean('is_pinned_one').default(false),
  isPinnedTwo: boolean('is_pinned_two').default(false),
  isArchived: boolean('is_archived').default(false),
  isMuted: boolean('is_muted').default(false),
});

/** Messages */
export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  conversationId: text('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  senderId: text('sender_id').references(() => users.id),
  senderRole: text('sender_role'),                              // 'client' | 'designer' | 'admin' | 'user'
  text: text('text'),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
  status: text('status').default('sent'),                       // 'sent' | 'delivered' | 'seen'
  isPinned: boolean('is_pinned').default(false),
  fileUrl: text('file_url'),
  fileName: text('file_name'),
  fileSize: integer('file_size'),
  fileType: text('file_type'),                                  // 'image' | 'pdf' | 'other'
});

/** Chat files — shared files in a conversation */
export const chatFiles = pgTable('chat_files', {
  id: text('id').primaryKey(),
  conversationId: text('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  size: integer('size'),
  type: text('type'),                                           // 'image' | 'pdf' | 'other'
  url: text('url').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
});

// ============================================================================
// CONTENT TABLES
// ============================================================================

/** Blog posts — matches existing blog_posts table exactly */
export const blogPosts = pgTable('blog_posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  content: text('content'),
  authorName: text('author_name'),
  authorId: text('author_id'),
  authorAvatarUrl: text('author_avatar_url'),
  authorAvatarHint: text('author_avatar_hint'),
  publishDate: timestamp('publish_date', { withTimezone: true }).defaultNow(),
  status: text('status').default('Draft'),                      // 'Published' | 'Draft' | 'Scheduled'
  featuredImageUrl: text('featured_image_url'),
  featuredImageHint: text('featured_image_hint'),
  category: text('category'),
  categorySlug: text('category_slug'),
  tags: text('tags').array(),
  views: integer('views').default(0),
  likes: integer('likes').default(0),
  comments: integer('comments').default(0),
});

/** Portfolio items — matches existing portfolio_items table exactly */
export const portfolioItems = pgTable('portfolio_items', {
  id: text('id').primaryKey(),
  designerId: text('designer_id'),
  title: text('title').notNull(),
  category: text('category'),
  categorySlug: text('category_slug'),
  clientName: text('client_name'),
  projectDate: text('project_date'),
  coverImageUrl: text('cover_image_url'),
  coverImageHint: text('cover_image_hint'),
  projectDescription: text('project_description'),
  galleryImages: jsonb('gallery_images').$type<Array<{ url: string; hint: string; caption?: string }>>().default([]),
  tags: text('tags').array(),
  views: integer('views').default(0),
  likes: integer('likes').default(0),
  designer: jsonb('designer').$type<{ id: string; slug: string; name: string; avatarUrl?: string; imageHint?: string } | null>(),
});

/** Brand profiles — client brand kits */
export const brandProfiles = pgTable('brand_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  companyName: text('company_name').notNull(),
  companyWebsite: text('company_website'),
  industry: text('industry'),
  companySize: text('company_size'),
  targetAudience: text('target_audience'),
  brandValues: text('brand_values'),
  tags: text('tags').array().default([]),
  preferredDesignStyle: text('preferred_design_style'),
  colorsToUse: text('colors_to_use'),
  colorsToAvoid: text('colors_to_avoid'),
  notesForDesigners: text('notes_for_designers'),
  communicationPreference: text('communication_preference').default('Platform Chat'),
  feedbackStyle: text('feedback_style'),
  brandGuidelinesLink: text('brand_guidelines_link'),
  existingAssetsLink: text('existing_assets_link'),
  logoUrl: text('logo_url'),
  projectTypes: text('project_types').array().default([]),
  isFavorite: boolean('is_favorite').default(false),
});

// ============================================================================
// SYSTEM TABLES
// ============================================================================

/** Notifications */
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type').notNull(),                                 // 'New Order' | 'Revision Request' | etc.
  title: text('title').notNull(),
  message: text('message'),
  relatedOrderId: text('related_order_id').references(() => orders.id),
  relatedPortfolioId: text('related_portfolio_id'),
  priority: text('priority').default('Medium'),                 // 'High' | 'Medium' | 'Low'
  isRead: boolean('is_read').default(false),
  isArchived: boolean('is_archived').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

/** Audit logs */
export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  action: text('action').notNull(),                             // 'User Update' | 'Service Edit' | etc.
  actorId: text('actor_id').references(() => users.id),
  actorName: text('actor_name'),
  targetType: text('target_type'),                              // 'User' | 'Service' | 'Order' | 'Platform'
  targetId: text('target_id'),
  targetName: text('target_name'),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
  notes: text('notes'),
});
