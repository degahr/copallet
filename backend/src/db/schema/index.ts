import { pgTable, text, timestamp, uuid, boolean, integer, decimal, jsonb, varchar, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).notNull(), // 'shipper', 'carrier', 'dispatcher', 'admin'
  verificationStatus: varchar('verification_status', { length: 20 }).default('pending'), // 'pending', 'approved', 'rejected'
  isActive: boolean('is_active').default(true),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  roleIdx: index('users_role_idx').on(table.role),
}));

// User profiles table
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  companyName: varchar('company_name', { length: 255 }),
  vatNumber: varchar('vat_number', { length: 50 }),
  billingAddress: jsonb('billing_address'), // Address object
  defaultPickupContact: jsonb('default_pickup_contact'), // Contact object
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Carrier verification documents
export const carrierDocuments = pgTable('carrier_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  carrierId: uuid('carrier_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  documentType: varchar('document_type', { length: 50 }).notNull(), // 'license', 'vat', 'insurance', 'adr'
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileUrl: text('file_url').notNull(),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 100 }),
  status: varchar('status', { length: 20 }).default('pending'), // 'pending', 'approved', 'rejected'
  rejectionReason: text('rejection_reason'),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
  reviewedAt: timestamp('reviewed_at'),
  reviewedBy: uuid('reviewed_by').references(() => users.id),
});

// Shipments table
export const shipments = pgTable('shipments', {
  id: uuid('id').primaryKey().defaultRandom(),
  shipperId: uuid('shipper_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 20 }).notNull().default('draft'), // 'draft', 'open', 'assigned', 'in-transit', 'delivered', 'cancelled'
  fromAddress: jsonb('from_address').notNull(), // Address object with geocoding
  toAddress: jsonb('to_address').notNull(), // Address object with geocoding
  pickupWindow: jsonb('pickup_window').notNull(), // TimeWindow object
  deliveryWindow: jsonb('delivery_window').notNull(), // TimeWindow object
  pallets: jsonb('pallets').notNull(), // PalletInfo object
  adrRequired: boolean('adr_required').default(false),
  constraints: jsonb('constraints'), // ServiceConstraints object
  notes: text('notes'),
  priceGuidance: jsonb('price_guidance'), // { min: number, max: number }
  assignedCarrierId: uuid('assigned_carrier_id').references(() => users.id),
  assignedAt: timestamp('assigned_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  shipperIdx: index('shipments_shipper_idx').on(table.shipperId),
  statusIdx: index('shipments_status_idx').on(table.status),
  assignedCarrierIdx: index('shipments_assigned_carrier_idx').on(table.assignedCarrierId),
}));

// Bids table
export const bids = pgTable('bids', {
  id: uuid('id').primaryKey().defaultRandom(),
  shipmentId: uuid('shipment_id').notNull().references(() => shipments.id, { onDelete: 'cascade' }),
  carrierId: uuid('carrier_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  etaPickup: timestamp('eta_pickup'),
  message: text('message'),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending', 'accepted', 'declined'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  shipmentIdx: index('bids_shipment_idx').on(table.shipmentId),
  carrierIdx: index('bids_carrier_idx').on(table.carrierId),
  statusIdx: index('bids_status_idx').on(table.status),
}));

// Tracking points table
export const trackingPoints = pgTable('tracking_points', {
  id: uuid('id').primaryKey().defaultRandom(),
  shipmentId: uuid('shipment_id').notNull().references(() => shipments.id, { onDelete: 'cascade' }),
  latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(),
  longitude: decimal('longitude', { precision: 11, scale: 8 }).notNull(),
  accuracy: decimal('accuracy', { precision: 8, scale: 2 }),
  speed: decimal('speed', { precision: 8, scale: 2 }),
  heading: decimal('heading', { precision: 8, scale: 2 }),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => ({
  shipmentIdx: index('tracking_points_shipment_idx').on(table.shipmentId),
  timestampIdx: index('tracking_points_timestamp_idx').on(table.timestamp),
}));

// Proof of Delivery table
export const proofOfDelivery = pgTable('proof_of_delivery', {
  id: uuid('id').primaryKey().defaultRandom(),
  shipmentId: uuid('shipment_id').notNull().references(() => shipments.id, { onDelete: 'cascade' }),
  photos: jsonb('photos'), // Array of photo URLs
  signature: text('signature'), // Base64 signature data
  recipientName: varchar('recipient_name', { length: 255 }),
  recipientSignature: text('recipient_signature'), // Base64 signature
  deliveryNotes: text('delivery_notes'),
  deliveredAt: timestamp('delivered_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  shipmentIdx: index('pod_shipment_idx').on(table.shipmentId),
}));

// Messages table
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  shipmentId: uuid('shipment_id').notNull().references(() => shipments.id, { onDelete: 'cascade' }),
  senderId: uuid('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  attachments: jsonb('attachments'), // Array of attachment objects
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  shipmentIdx: index('messages_shipment_idx').on(table.shipmentId),
  senderIdx: index('messages_sender_idx').on(table.senderId),
}));

// Notifications table
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(), // 'bid_received', 'bid_accepted', 'shipment_assigned', etc.
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  data: jsonb('data'), // Additional data for the notification
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('notifications_user_idx').on(table.userId),
  typeIdx: index('notifications_type_idx').on(table.type),
}));

// Carrier cost models table
export const carrierCostModels = pgTable('carrier_cost_models', {
  id: uuid('id').primaryKey().defaultRandom(),
  carrierId: uuid('carrier_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  costPerKm: decimal('cost_per_km', { precision: 8, scale: 4 }).notNull(),
  driverCostPerHour: decimal('driver_cost_per_hour', { precision: 8, scale: 2 }).notNull(),
  loadTimeMinutes: integer('load_time_minutes').notNull(),
  unloadTimeMinutes: integer('unload_time_minutes').notNull(),
  averageSpeedKmh: decimal('average_speed_kmh', { precision: 5, scale: 2 }).notNull(),
  platformFeePercentage: decimal('platform_fee_percentage', { precision: 5, scale: 2 }).notNull(),
  fuelCostPerKm: decimal('fuel_cost_per_km', { precision: 8, scale: 4 }),
  maintenanceCostPerKm: decimal('maintenance_cost_per_km', { precision: 8, scale: 4 }),
  insuranceCostPerKm: decimal('insurance_cost_per_km', { precision: 8, scale: 4 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  carrierIdx: index('cost_models_carrier_idx').on(table.carrierId),
}));

// Shipment templates table
export const shipmentTemplates = pgTable('shipment_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  shipperId: uuid('shipper_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  fromAddress: jsonb('from_address').notNull(),
  toAddress: jsonb('to_address').notNull(),
  pallets: jsonb('pallets').notNull(),
  adrRequired: boolean('adr_required').default(false),
  constraints: jsonb('constraints'),
  notes: text('notes'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  shipperIdx: index('templates_shipper_idx').on(table.shipperId),
}));

// Auto-bid rules table
export const autoBidRules = pgTable('auto_bid_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  carrierId: uuid('carrier_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  fromCity: varchar('from_city', { length: 100 }),
  toCity: varchar('to_city', { length: 100 }),
  maxRadiusKm: integer('max_radius_km'),
  minMarginPercentage: decimal('min_margin_percentage', { precision: 5, scale: 2 }),
  maxBidAmount: decimal('max_bid_amount', { precision: 10, scale: 2 }),
  adrAllowed: boolean('adr_allowed').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  carrierIdx: index('auto_bid_rules_carrier_idx').on(table.carrierId),
}));

// Ratings table
export const ratings = pgTable('ratings', {
  id: uuid('id').primaryKey().defaultRandom(),
  shipmentId: uuid('shipment_id').notNull().references(() => shipments.id, { onDelete: 'cascade' }),
  raterId: uuid('rater_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  ratedUserId: uuid('rated_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(), // 1-5 stars
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  shipmentIdx: index('ratings_shipment_idx').on(table.shipmentId),
  ratedUserIdx: index('ratings_rated_user_idx').on(table.ratedUserId),
}));

// Audit log table
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  resourceType: varchar('resource_type', { length: 50 }).notNull(),
  resourceId: uuid('resource_id').notNull(),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('audit_logs_user_idx').on(table.userId),
  resourceIdx: index('audit_logs_resource_idx').on(table.resourceType, table.resourceId),
  actionIdx: index('audit_logs_action_idx').on(table.action),
}));

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  documents: many(carrierDocuments),
  shipments: many(shipments),
  bids: many(bids),
  messages: many(messages),
  notifications: many(notifications),
  costModel: one(carrierCostModels, {
    fields: [users.id],
    references: [carrierCostModels.carrierId],
  }),
  templates: many(shipmentTemplates),
  autoBidRules: many(autoBidRules),
  ratingsGiven: many(ratings, { relationName: 'rater' }),
  ratingsReceived: many(ratings, { relationName: 'rated' }),
}));

export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  shipper: one(users, {
    fields: [shipments.shipperId],
    references: [users.id],
  }),
  assignedCarrier: one(users, {
    fields: [shipments.assignedCarrierId],
    references: [users.id],
  }),
  bids: many(bids),
  trackingPoints: many(trackingPoints),
  proofOfDelivery: one(proofOfDelivery, {
    fields: [shipments.id],
    references: [proofOfDelivery.shipmentId],
  }),
  messages: many(messages),
  ratings: many(ratings),
}));

export const bidsRelations = relations(bids, ({ one }) => ({
  shipment: one(shipments, {
    fields: [bids.shipmentId],
    references: [shipments.id],
  }),
  carrier: one(users, {
    fields: [bids.carrierId],
    references: [users.id],
  }),
}));
