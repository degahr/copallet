import { z } from 'zod';

// Base types
export const AddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const TimeWindowSchema = z.object({
  start: z.date(),
  end: z.date(),
});

export const PalletInfoSchema = z.object({
  quantity: z.number().min(1),
  dimensions: z.object({
    length: z.number().min(1),
    width: z.number().min(1),
    height: z.number().min(1),
  }),
  weight: z.number().min(1),
});

export const ServiceConstraintsSchema = z.object({
  tailLiftRequired: z.boolean().default(false),
  forkliftRequired: z.boolean().default(false),
  indoorDelivery: z.boolean().default(false),
  appointmentRequired: z.boolean().default(false),
});

// User types
export const UserRoleSchema = z.enum(['shipper', 'carrier', 'dispatcher', 'admin']);
export const VerificationStatusSchema = z.enum(['pending', 'approved', 'rejected']);

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: UserRoleSchema,
  verificationStatus: VerificationStatusSchema.default('pending'),
  isActive: z.boolean().default(true),
  lastLoginAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  vatNumber: z.string().optional(),
  billingAddress: AddressSchema.optional(),
  defaultPickupContact: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string().email(),
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Shipment types
export const ShipmentStatusSchema = z.enum(['draft', 'open', 'assigned', 'in-transit', 'delivered', 'cancelled']);

export const ShipmentSchema = z.object({
  id: z.string().uuid(),
  shipperId: z.string().uuid(),
  status: ShipmentStatusSchema,
  fromAddress: AddressSchema,
  toAddress: AddressSchema,
  pickupWindow: TimeWindowSchema,
  deliveryWindow: TimeWindowSchema,
  pallets: PalletInfoSchema,
  adrRequired: z.boolean().default(false),
  constraints: ServiceConstraintsSchema.optional(),
  notes: z.string().optional(),
  priceGuidance: z.object({
    min: z.number(),
    max: z.number(),
  }).optional(),
  assignedCarrierId: z.string().uuid().optional(),
  assignedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Bid types
export const BidStatusSchema = z.enum(['pending', 'accepted', 'declined']);

export const BidSchema = z.object({
  id: z.string().uuid(),
  shipmentId: z.string().uuid(),
  carrierId: z.string().uuid(),
  price: z.number().min(0),
  etaPickup: z.date().optional(),
  message: z.string().optional(),
  status: BidStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Tracking types
export const TrackingPointSchema = z.object({
  id: z.string().uuid(),
  shipmentId: z.string().uuid(),
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number().optional(),
  speed: z.number().optional(),
  heading: z.number().optional(),
  timestamp: z.date(),
});

// POD types
export const PODSchema = z.object({
  id: z.string().uuid(),
  shipmentId: z.string().uuid(),
  photos: z.array(z.string()).optional(),
  signature: z.string().optional(),
  recipientName: z.string().optional(),
  recipientSignature: z.string().optional(),
  deliveryNotes: z.string().optional(),
  deliveredAt: z.date(),
  createdAt: z.date(),
});

// Message types
export const MessageSchema = z.object({
  id: z.string().uuid(),
  shipmentId: z.string().uuid(),
  senderId: z.string().uuid(),
  content: z.string(),
  attachments: z.array(z.object({
    fileName: z.string(),
    fileUrl: z.string(),
    fileSize: z.number(),
    mimeType: z.string(),
  })).optional(),
  isRead: z.boolean().default(false),
  createdAt: z.date(),
});

// Notification types
export const NotificationTypeSchema = z.enum([
  'bid_received',
  'bid_accepted',
  'bid_declined',
  'shipment_assigned',
  'shipment_picked_up',
  'shipment_delivered',
  'eta_updated',
  'message_received',
  'verification_approved',
  'verification_rejected',
]);

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: NotificationTypeSchema,
  title: z.string(),
  message: z.string(),
  data: z.record(z.any()).optional(),
  isRead: z.boolean().default(false),
  createdAt: z.date(),
});

// Cost model types
export const CarrierCostModelSchema = z.object({
  id: z.string().uuid(),
  carrierId: z.string().uuid(),
  costPerKm: z.number().min(0),
  driverCostPerHour: z.number().min(0),
  loadTimeMinutes: z.number().min(0),
  unloadTimeMinutes: z.number().min(0),
  averageSpeedKmh: z.number().min(0),
  platformFeePercentage: z.number().min(0).max(100),
  fuelCostPerKm: z.number().min(0).optional(),
  maintenanceCostPerKm: z.number().min(0).optional(),
  insuranceCostPerKm: z.number().min(0).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ROI metrics
export const ROIMetricsSchema = z.object({
  routeKm: z.number(),
  deadheadKm: z.number(),
  timeEstimate: z.number(),
  variableCost: z.number(),
  platformFee: z.number(),
  profit: z.number(),
  roiPercentage: z.number(),
});

// Template types
export const ShipmentTemplateSchema = z.object({
  id: z.string().uuid(),
  shipperId: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  fromAddress: AddressSchema,
  toAddress: AddressSchema,
  pallets: PalletInfoSchema,
  adrRequired: z.boolean().default(false),
  constraints: ServiceConstraintsSchema.optional(),
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Auto-bid rule types
export const AutoBidRuleSchema = z.object({
  id: z.string().uuid(),
  carrierId: z.string().uuid(),
  name: z.string(),
  fromCity: z.string().optional(),
  toCity: z.string().optional(),
  maxRadiusKm: z.number().optional(),
  minMarginPercentage: z.number().optional(),
  maxBidAmount: z.number().optional(),
  adrAllowed: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Blog post types
export const BlogPostSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string().optional(),
  author: z.string(),
  authorBio: z.string().optional(),
  authorImage: z.string().optional(),
  date: z.date(),
  category: z.string(),
  readTime: z.string().optional(),
  image: z.string().optional(),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published', 'scheduled']).default('draft'),
  scheduledAt: z.date().optional(),
  publishedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateBlogPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  author: z.string().min(1),
  authorBio: z.string().optional(),
  authorImage: z.string().optional(),
  category: z.string().min(1),
  readTime: z.string().optional(),
  image: z.string().optional(),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published', 'scheduled']).default('draft'),
  scheduledAt: z.date().optional(),
});

export const UpdateBlogPostSchema = CreateBlogPostSchema.partial();

// Rating types
export const RatingSchema = z.object({
  id: z.string().uuid(),
  shipmentId: z.string().uuid(),
  raterId: z.string().uuid(),
  ratedUserId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  createdAt: z.date(),
});

// Document types
export const CarrierDocumentSchema = z.object({
  id: z.string().uuid(),
  carrierId: z.string().uuid(),
  documentType: z.enum(['license', 'vat', 'insurance', 'adr']),
  fileName: z.string(),
  fileUrl: z.string(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
  status: VerificationStatusSchema.default('pending'),
  rejectionReason: z.string().optional(),
  uploadedAt: z.date(),
  reviewedAt: z.date().optional(),
  reviewedBy: z.string().uuid().optional(),
});

// Request/Response schemas
export const CreateShipmentRequestSchema = z.object({
  fromAddress: AddressSchema,
  toAddress: AddressSchema,
  pickupWindow: TimeWindowSchema,
  deliveryWindow: TimeWindowSchema,
  pallets: PalletInfoSchema,
  adrRequired: z.boolean().default(false),
  constraints: ServiceConstraintsSchema.optional(),
  notes: z.string().optional(),
});

export const CreateBidRequestSchema = z.object({
  shipmentId: z.string().uuid(),
  price: z.number().min(0),
  etaPickup: z.date().optional(),
  message: z.string().optional(),
});

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const SignupRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: UserRoleSchema,
});

export const UpdateProfileRequestSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  vatNumber: z.string().optional(),
  billingAddress: AddressSchema.optional(),
  defaultPickupContact: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string().email(),
  }).optional(),
});

// Type exports
export type Address = z.infer<typeof AddressSchema>;
export type TimeWindow = z.infer<typeof TimeWindowSchema>;
export type PalletInfo = z.infer<typeof PalletInfoSchema>;
export type ServiceConstraints = z.infer<typeof ServiceConstraintsSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;
export type User = z.infer<typeof UserSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type ShipmentStatus = z.infer<typeof ShipmentStatusSchema>;
export type Shipment = z.infer<typeof ShipmentSchema>;
export type BidStatus = z.infer<typeof BidStatusSchema>;
export type Bid = z.infer<typeof BidSchema>;
export type TrackingPoint = z.infer<typeof TrackingPointSchema>;
export type POD = z.infer<typeof PODSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type CarrierCostModel = z.infer<typeof CarrierCostModelSchema>;
export type ROIMetrics = z.infer<typeof ROIMetricsSchema>;
export type ShipmentTemplate = z.infer<typeof ShipmentTemplateSchema>;
export type AutoBidRule = z.infer<typeof AutoBidRuleSchema>;
export type Rating = z.infer<typeof RatingSchema>;
export type CarrierDocument = z.infer<typeof CarrierDocumentSchema>;

// Request/Response types
export type CreateShipmentRequest = z.infer<typeof CreateShipmentRequestSchema>;
export type CreateBidRequest = z.infer<typeof CreateBidRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type SignupRequest = z.infer<typeof SignupRequestSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;
