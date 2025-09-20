// Simple in-memory database for testing
// In production, this would be replaced with PostgreSQL + Drizzle ORM

interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'shipper' | 'carrier' | 'dispatcher' | 'admin';
  verificationStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  companyName?: string;
  vatNumber?: string;
  billingAddress?: any;
  defaultPickupContact?: any;
  createdAt: Date;
  updatedAt: Date;
}

interface Shipment {
  id: string;
  shipperId: string;
  status: 'draft' | 'open' | 'assigned' | 'in-transit' | 'delivered' | 'cancelled';
  from: any;
  to: any;
  pickupWindow: any;
  deliveryWindow: any;
  pallets: any;
  adrRequired: boolean;
  constraints?: any;
  notes?: string;
  priceGuidance?: any;
  assignedCarrierId?: string;
  assignedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Bid {
  id: string;
  shipmentId: string;
  carrierId: string;
  price: number;
  etaPickup?: Date;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: string;
  shipmentId: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

interface TrackingPoint {
  id: string;
  shipmentId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  status: string;
  notes?: string;
  accuracy?: number;
  speed?: number;
  heading?: number;
}

interface POD {
  id: string;
  shipmentId: string;
  carrierId: string;
  photoUrl?: string;
  signatureUrl?: string;
  recipientName: string;
  deliveryNotes?: string;
  deliveredAt: Date;
  createdAt: Date;
}

interface Rating {
  id: string;
  shipmentId: string;
  raterId: string;
  rateeId: string;
  rating: number; // 1-5 stars
  comment?: string;
  createdAt: Date;
}

interface ShipmentTemplate {
  id: string;
  shipperId: string;
  name: string;
  from: any;
  to: any;
  pallets: any;
  constraints: any;
  notes?: string;
  createdAt: Date;
}

interface AutoBidRule {
  id: string;
  carrierId: string;
  name: string;
  conditions: {
    maxPrice?: number;
    maxDistance?: number;
    adrRequired?: boolean;
    tailLiftRequired?: boolean;
  };
  bidPrice: number;
  isActive: boolean;
  createdAt: Date;
}

interface CarrierCostModel {
  id: string;
  carrierId: string;
  name: string;
  baseRate: number;
  perKmRate: number;
  perPalletRate: number;
  adrSurcharge: number;
  tailLiftSurcharge: number;
  isActive: boolean;
  createdAt: Date;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  authorBio?: string;
  authorImage?: string;
  date: Date;
  category: string;
  readTime?: string;
  image?: string;
  featured: boolean;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled';
  scheduledAt?: Date;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage
const users: Map<string, User> = new Map();
const userProfiles: Map<string, UserProfile> = new Map();
const shipments: Map<string, Shipment> = new Map();
const bids: Map<string, Bid> = new Map();
const messages: Map<string, Message> = new Map();
const notifications: Map<string, Notification> = new Map();
const trackingPoints: Map<string, TrackingPoint> = new Map();
const pods: Map<string, POD> = new Map();
const ratings: Map<string, Rating> = new Map();
const shipmentTemplates: Map<string, ShipmentTemplate> = new Map();
const autoBidRules: Map<string, AutoBidRule> = new Map();
const carrierCostModels: Map<string, CarrierCostModel> = new Map();
const blogPosts: Map<string, BlogPost> = new Map();

// Helper functions
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const findUserByEmail = (email: string): User | undefined => {
  return Array.from(users.values()).find(user => user.email === email);
};

export const findUserById = (id: string): User | undefined => {
  return users.get(id);
};

export const createUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
  const id = generateId();
  const now = new Date();
  const user: User = {
    ...userData,
    id,
    createdAt: now,
    updatedAt: now,
  };
  users.set(id, user);
  return user;
};

export const updateUser = (id: string, updates: Partial<User>): User | undefined => {
  const user = users.get(id);
  if (!user) return undefined;
  
  const updatedUser = {
    ...user,
    ...updates,
    updatedAt: new Date(),
  };
  users.set(id, updatedUser);
  return updatedUser;
};

export const createUserProfile = (profileData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): UserProfile => {
  const id = generateId();
  const now = new Date();
  const profile: UserProfile = {
    ...profileData,
    id,
    createdAt: now,
    updatedAt: now,
  };
  userProfiles.set(id, profile);
  return profile;
};

export const getUserProfile = (userId: string): UserProfile | undefined => {
  return Array.from(userProfiles.values()).find(profile => profile.userId === userId);
};

export const updateUserProfile = (userId: string, updates: Partial<UserProfile>): UserProfile | undefined => {
  const profile = getUserProfile(userId);
  if (!profile) return undefined;
  
  const updatedProfile = {
    ...profile,
    ...updates,
    updatedAt: new Date(),
  };
  userProfiles.set(profile.id, updatedProfile);
  return updatedProfile;
};

export const createShipment = (shipmentData: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>): Shipment => {
  const id = generateId();
  const now = new Date();
  const shipment: Shipment = {
    ...shipmentData,
    id,
    createdAt: now,
    updatedAt: now,
  };
  shipments.set(id, shipment);
  return shipment;
};

export const getShipment = (id: string): Shipment | undefined => {
  return shipments.get(id);
};

export const getShipmentsByShipper = (shipperId: string): Shipment[] => {
  return Array.from(shipments.values()).filter(shipment => shipment.shipperId === shipperId);
};

export const getOpenShipments = (): Shipment[] => {
  return Array.from(shipments.values()).filter(shipment => shipment.status === 'open');
};

export const updateShipment = (id: string, updates: Partial<Shipment>): Shipment | undefined => {
  const shipment = shipments.get(id);
  if (!shipment) return undefined;
  
  const updatedShipment = {
    ...shipment,
    ...updates,
    updatedAt: new Date(),
  };
  shipments.set(id, updatedShipment);
  return updatedShipment;
};

export const createBid = (bidData: Omit<Bid, 'id' | 'createdAt' | 'updatedAt'>): Bid => {
  const id = generateId();
  const now = new Date();
  const bid: Bid = {
    ...bidData,
    id,
    createdAt: now,
    updatedAt: now,
  };
  bids.set(id, bid);
  return bid;
};

export const getBidsByShipment = (shipmentId: string): Bid[] => {
  return Array.from(bids.values()).filter(bid => bid.shipmentId === shipmentId);
};

export const getBidsByCarrier = (carrierId: string): Bid[] => {
  return Array.from(bids.values()).filter(bid => bid.carrierId === carrierId);
};

export const updateBid = (id: string, updates: Partial<Bid>): Bid | undefined => {
  const bid = bids.get(id);
  if (!bid) return undefined;
  
  const updatedBid = {
    ...bid,
    ...updates,
    updatedAt: new Date(),
  };
  bids.set(id, updatedBid);
  return updatedBid;
};

// Message functions
export const createMessage = (data: Omit<Message, 'id' | 'createdAt'>): Message => {
  const id = generateId();
  const message: Message = {
    id,
    ...data,
    createdAt: new Date(),
  };
  messages.set(id, message);
  return message;
};

export const getMessagesByShipment = (shipmentId: string): Message[] => {
  return Array.from(messages.values()).filter(msg => msg.shipmentId === shipmentId);
};

// Notification functions
export const createNotification = (data: Omit<Notification, 'id' | 'createdAt'>): Notification => {
  const id = generateId();
  const notification: Notification = {
    id,
    ...data,
    createdAt: new Date(),
  };
  notifications.set(id, notification);
  return notification;
};

export const getNotificationsByUser = (userId: string): Notification[] => {
  return Array.from(notifications.values()).filter(notif => notif.userId === userId);
};

// Tracking functions
export const createTrackingPoint = (data: Omit<TrackingPoint, 'id'>): TrackingPoint => {
  const id = generateId();
  const trackingPoint: TrackingPoint = {
    id,
    ...data,
  };
  trackingPoints.set(id, trackingPoint);
  return trackingPoint;
};

export const getTrackingPointsByShipment = (shipmentId: string): TrackingPoint[] => {
  return Array.from(trackingPoints.values()).filter(point => point.shipmentId === shipmentId);
};

// POD functions
export const createPOD = (data: Omit<POD, 'id' | 'createdAt'>): POD => {
  const id = generateId();
  const pod: POD = {
    id,
    ...data,
    createdAt: new Date(),
  };
  pods.set(id, pod);
  return pod;
};

export const getPODsByShipment = (shipmentId: string): POD[] => {
  return Array.from(pods.values()).filter(pod => pod.shipmentId === shipmentId);
};

// Rating functions
export const createRating = (data: Omit<Rating, 'id' | 'createdAt'>): Rating => {
  const id = generateId();
  const rating: Rating = {
    id,
    ...data,
    createdAt: new Date(),
  };
  ratings.set(id, rating);
  return rating;
};

export const getRatingsByUser = (userId: string): Rating[] => {
  return Array.from(ratings.values()).filter(rating => rating.rateeId === userId);
};

// Template functions
export const createShipmentTemplate = (data: Omit<ShipmentTemplate, 'id' | 'createdAt'>): ShipmentTemplate => {
  const id = generateId();
  const template: ShipmentTemplate = {
    id,
    ...data,
    createdAt: new Date(),
  };
  shipmentTemplates.set(id, template);
  return template;
};

export const updateShipmentTemplate = (id: string, updates: Partial<Omit<ShipmentTemplate, 'id' | 'createdAt'>>): ShipmentTemplate | undefined => {
  const template = shipmentTemplates.get(id);
  if (!template) return undefined;
  
  const updatedTemplate = {
    ...template,
    ...updates,
    updatedAt: new Date()
  };
  
  shipmentTemplates.set(id, updatedTemplate);
  return updatedTemplate;
};

export const deleteShipmentTemplate = (id: string): boolean => {
  return shipmentTemplates.delete(id);
};

export const getShipmentTemplate = (id: string): ShipmentTemplate | undefined => {
  return shipmentTemplates.get(id);
};

export const getTemplatesByShipper = (shipperId: string): ShipmentTemplate[] => {
  return Array.from(shipmentTemplates.values()).filter(template => template.shipperId === shipperId);
};

// Auto-bid functions
export const createAutoBidRule = (data: Omit<AutoBidRule, 'id' | 'createdAt'>): AutoBidRule => {
  const id = generateId();
  const rule: AutoBidRule = {
    id,
    ...data,
    createdAt: new Date(),
  };
  autoBidRules.set(id, rule);
  return rule;
};

export const getAutoBidRulesByCarrier = (carrierId: string): AutoBidRule[] => {
  return Array.from(autoBidRules.values()).filter(rule => rule.carrierId === carrierId);
};

// Cost model functions
export const createCarrierCostModel = (data: Omit<CarrierCostModel, 'id' | 'createdAt'>): CarrierCostModel => {
  const id = generateId();
  const model: CarrierCostModel = {
    id,
    ...data,
    createdAt: new Date(),
  };
  carrierCostModels.set(id, model);
  return model;
};

export const getCostModelsByCarrier = (carrierId: string): CarrierCostModel[] => {
  return Array.from(carrierCostModels.values()).filter(model => model.carrierId === carrierId);
};

// Blog post functions
export const createBlogPost = (data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost => {
  const id = generateId();
  const now = new Date();
  const slug = data.title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const post: BlogPost = {
    id,
    ...data,
    slug,
    createdAt: now,
    updatedAt: now,
  };
  blogPosts.set(id, post);
  return post;
};

export const updateBlogPost = (id: string, updates: Partial<Omit<BlogPost, 'id' | 'createdAt'>>): BlogPost | undefined => {
  const post = blogPosts.get(id);
  if (!post) return undefined;
  
  const updatedPost = {
    ...post,
    ...updates,
    updatedAt: new Date(),
  };
  
  // Update slug if title changed
  if (updates.title) {
    updatedPost.slug = updates.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  blogPosts.set(id, updatedPost);
  return updatedPost;
};

export const getBlogPost = (id: string): BlogPost | undefined => {
  return blogPosts.get(id);
};

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return Array.from(blogPosts.values()).find(post => post.slug === slug);
};

export const getAllBlogPosts = (): BlogPost[] => {
  return Array.from(blogPosts.values()).sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const getPublishedBlogPosts = (): BlogPost[] => {
  return Array.from(blogPosts.values())
    .filter(post => post.status === 'published')
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const getBlogPostsByCategory = (category: string): BlogPost[] => {
  return Array.from(blogPosts.values())
    .filter(post => post.category === category && post.status === 'published')
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const deleteBlogPost = (id: string): boolean => {
  return blogPosts.delete(id);
};

import bcrypt from 'bcryptjs';

// Seed some initial data
export const seedDatabase = async () => {
  const passwordHash = await bcrypt.hash('admin123', 12);
  
  // Create admin user
  const adminUser = createUser({
    email: 'admin@copallet.com',
    passwordHash,
    role: 'admin',
    verificationStatus: 'approved',
    isActive: true,
  });
  console.log('Admin user created:', adminUser.email);

  createUserProfile({
    userId: adminUser.id,
    firstName: 'Admin',
    lastName: 'User',
    companyName: 'CoPallet',
  });

  // Create sample shipper
  const shipperUser = createUser({
    email: 'shipper@example.com',
    passwordHash,
    role: 'shipper',
    verificationStatus: 'approved',
    isActive: true,
  });
  console.log('Shipper user created:', shipperUser.email);

  createUserProfile({
    userId: shipperUser.id,
    firstName: 'John',
    lastName: 'Shipper',
    companyName: 'ABC Logistics',
    phone: '+1234567890',
  });

  // Create sample carrier
  const carrierUser = createUser({
    email: 'carrier@example.com',
    passwordHash,
    role: 'carrier',
    verificationStatus: 'approved',
    isActive: true,
  });
  console.log('Carrier user created:', carrierUser.email);

  createUserProfile({
    userId: carrierUser.id,
    firstName: 'Mike',
    lastName: 'Driver',
    companyName: 'Fast Transport',
    phone: '+0987654321',
  });

  // Create additional users for better testing
  const shipper2 = createUser({
    email: 'logistics@company.com',
    passwordHash,
    role: 'shipper',
    verificationStatus: 'approved',
    isActive: true,
  });
  
  createUserProfile({
    userId: shipper2.id,
    firstName: 'Sarah',
    lastName: 'Johnson',
    companyName: 'Global Logistics Ltd',
    phone: '+31612345678',
  });

  const carrier2 = createUser({
    email: 'fleet@transport.com',
    passwordHash,
    role: 'carrier',
    verificationStatus: 'approved',
    isActive: true,
  });
  
  createUserProfile({
    userId: carrier2.id,
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    companyName: 'Euro Transport Solutions',
    phone: '+31687654321',
  });

  const carrier3 = createUser({
    email: 'driver@freight.com',
    passwordHash,
    role: 'carrier',
    verificationStatus: 'pending',
    isActive: true,
  });
  
  createUserProfile({
    userId: carrier3.id,
    firstName: 'Anna',
    lastName: 'Schmidt',
    companyName: 'Schmidt Logistics',
    phone: '+49123456789',
  });

  // Create multiple sample shipments
  const shipment1 = createShipment({
    shipperId: shipperUser.id,
    status: 'open',
    from: {
      street: '123 Main St',
      city: 'Amsterdam',
      postalCode: '1012 AB',
      country: 'Netherlands',
      latitude: 52.3676,
      longitude: 4.9041,
    },
    to: {
      street: '456 Business Ave',
      city: 'Rotterdam',
      postalCode: '3011 AA',
      country: 'Netherlands',
      latitude: 51.9244,
      longitude: 4.4777,
    },
    pickupWindow: {
      start: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      end: new Date(Date.now() + 25 * 60 * 60 * 1000), // Tomorrow + 1 hour
    },
    deliveryWindow: {
      start: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
      end: new Date(Date.now() + 49 * 60 * 60 * 1000), // Day after tomorrow + 1 hour
    },
    pallets: {
      quantity: 2,
      dimensions: {
        length: 120,
        width: 80,
        height: 144,
      },
      weight: 1500,
    },
    adrRequired: false,
    constraints: {
      tailLiftRequired: true,
      forkliftRequired: false,
      indoorDelivery: false,
      appointmentRequired: false,
    },
    notes: 'Handle with care - fragile goods',
    priceGuidance: {
      min: 200,
      max: 350,
    },
  });

  const shipment2 = createShipment({
    shipperId: shipper2.id,
    status: 'assigned',
    from: {
      street: '789 Industrial Blvd',
      city: 'Utrecht',
      postalCode: '3511 AB',
      country: 'Netherlands',
      latitude: 52.0907,
      longitude: 5.1214,
    },
    to: {
      street: '321 Warehouse St',
      city: 'Eindhoven',
      postalCode: '5611 AA',
      country: 'Netherlands',
      latitude: 51.4416,
      longitude: 5.4697,
    },
    pickupWindow: {
      start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // + 2 hours
    },
    deliveryWindow: {
      start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // + 2 hours
    },
    pallets: {
      quantity: 4,
      dimensions: {
        length: 120,
        width: 80,
        height: 144,
      },
      weight: 2800,
    },
    adrRequired: false,
    constraints: {
      tailLiftRequired: false,
      forkliftRequired: true,
      indoorDelivery: true,
      appointmentRequired: true,
    },
    notes: 'Electronics shipment - temperature controlled',
    priceGuidance: {
      min: 450,
      max: 650,
    },
    assignedCarrierId: carrierUser.id,
    assignedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  });

  const shipment3 = createShipment({
    shipperId: shipperUser.id,
    status: 'in-transit',
    from: {
      street: '555 Port Road',
      city: 'Hamburg',
      postalCode: '20095',
      country: 'Germany',
      latitude: 53.5511,
      longitude: 9.9937,
    },
    to: {
      street: '888 Distribution Center',
      city: 'Berlin',
      postalCode: '10115',
      country: 'Germany',
      latitude: 52.5200,
      longitude: 13.4050,
    },
    pickupWindow: {
      start: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      end: new Date(Date.now() - 23 * 60 * 60 * 1000), // Yesterday + 1 hour
    },
    deliveryWindow: {
      start: new Date(Date.now() + 12 * 60 * 60 * 1000), // Today + 12 hours
      end: new Date(Date.now() + 14 * 60 * 60 * 1000), // Today + 14 hours
    },
    pallets: {
      quantity: 6,
      dimensions: {
        length: 120,
        width: 80,
        height: 144,
      },
      weight: 4200,
    },
    adrRequired: true,
    constraints: {
      tailLiftRequired: true,
      forkliftRequired: false,
      indoorDelivery: false,
      appointmentRequired: true,
    },
    notes: 'Dangerous goods - ADR certified driver required',
    priceGuidance: {
      min: 800,
      max: 1200,
    },
    assignedCarrierId: carrier2.id,
    assignedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
  });

  const shipment4 = createShipment({
    shipperId: shipper2.id,
    status: 'delivered',
    from: {
      street: '100 Factory Lane',
      city: 'Antwerp',
      postalCode: '2000',
      country: 'Belgium',
      latitude: 51.2194,
      longitude: 4.4025,
    },
    to: {
      street: '200 Retail Park',
      city: 'Brussels',
      postalCode: '1000',
      country: 'Belgium',
      latitude: 50.8503,
      longitude: 4.3517,
    },
    pickupWindow: {
      start: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      end: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // + 2 hours
    },
    deliveryWindow: {
      start: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      end: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // + 2 hours
    },
    pallets: {
      quantity: 3,
      dimensions: {
        length: 120,
        width: 80,
        height: 144,
      },
      weight: 2100,
    },
    adrRequired: false,
    constraints: {
      tailLiftRequired: false,
      forkliftRequired: true,
      indoorDelivery: false,
      appointmentRequired: false,
    },
    notes: 'Completed successfully - on time delivery',
    priceGuidance: {
      min: 300,
      max: 450,
    },
    assignedCarrierId: carrierUser.id,
    assignedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  });

  // Create sample bids
  createBid({
    shipmentId: shipment1.id,
    carrierId: carrierUser.id,
    price: 280,
    etaPickup: new Date(Date.now() + 25 * 60 * 60 * 1000),
    message: 'I can pick up tomorrow morning. Have experience with fragile goods.',
    status: 'pending',
  });

  createBid({
    shipmentId: shipment1.id,
    carrierId: carrier2.id,
    price: 320,
    etaPickup: new Date(Date.now() + 26 * 60 * 60 * 1000),
    message: 'Available for pickup. Professional handling guaranteed.',
    status: 'pending',
  });

  createBid({
    shipmentId: shipment2.id,
    carrierId: carrierUser.id,
    price: 580,
    etaPickup: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
    message: 'Perfect for my route. Can handle temperature controlled goods.',
    status: 'accepted',
  });

  // Additional bids for more variety
  createBid({
    shipmentId: shipment1.id,
    carrierId: carrier3.id,
    price: 300,
    etaPickup: new Date(Date.now() + 28 * 60 * 60 * 1000),
    message: 'New to platform but eager to prove reliability.',
    status: 'pending',
  });

  createBid({
    shipmentId: shipment2.id,
    carrierId: carrier2.id,
    price: 520,
    etaPickup: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
    message: 'Competitive rate with excellent service record.',
    status: 'declined',
  });

  createBid({
    shipmentId: shipment3.id,
    carrierId: carrier2.id,
    price: 950,
    etaPickup: new Date(Date.now() - 20 * 60 * 60 * 1000),
    message: 'ADR certified driver available. Can handle dangerous goods safely.',
    status: 'accepted',
  });

  createBid({
    shipmentId: shipment4.id,
    carrierId: carrierUser.id,
    price: 380,
    etaPickup: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    message: 'Local driver familiar with Brussels area. Can deliver on time.',
    status: 'accepted',
  });

  // Create additional shipments for more comprehensive testing
  const shipment5 = createShipment({
    shipperId: shipperUser.id,
    status: 'open',
    from: {
      street: '100 Tech Park',
      city: 'Munich',
      postalCode: '80331',
      country: 'Germany',
      latitude: 48.1351,
      longitude: 11.5820,
    },
    to: {
      street: '200 Innovation Hub',
      city: 'Vienna',
      postalCode: '1010',
      country: 'Austria',
      latitude: 48.2082,
      longitude: 16.3738,
    },
    pickupWindow: {
      start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // + 3 hours
    },
    deliveryWindow: {
      start: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      end: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // + 3 hours
    },
    pallets: {
      quantity: 8,
      dimensions: {
        length: 120,
        width: 80,
        height: 144,
      },
      weight: 3200,
    },
    adrRequired: false,
    constraints: {
      tailLiftRequired: true,
      forkliftRequired: false,
      indoorDelivery: true,
      appointmentRequired: true,
    },
    notes: 'High-value electronics - secure handling required',
    priceGuidance: {
      min: 600,
      max: 900,
    },
  });

  const shipment6 = createShipment({
    shipperId: shipper2.id,
    status: 'open',
    from: {
      street: '300 Industrial Zone',
      city: 'Milan',
      postalCode: '20121',
      country: 'Italy',
      latitude: 45.4642,
      longitude: 9.1900,
    },
    to: {
      street: '400 Logistics Center',
      city: 'Zurich',
      postalCode: '8001',
      country: 'Switzerland',
      latitude: 47.3769,
      longitude: 8.5417,
    },
    pickupWindow: {
      start: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // + 4 hours
    },
    deliveryWindow: {
      start: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
      end: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // + 4 hours
    },
    pallets: {
      quantity: 5,
      dimensions: {
        length: 120,
        width: 80,
        height: 144,
      },
      weight: 2500,
    },
    adrRequired: true,
    constraints: {
      tailLiftRequired: false,
      forkliftRequired: true,
      indoorDelivery: false,
      appointmentRequired: false,
    },
    notes: 'Chemical products - ADR certification mandatory',
    priceGuidance: {
      min: 700,
      max: 1100,
    },
  });

  // Add bids for new shipments
  createBid({
    shipmentId: shipment5.id,
    carrierId: carrierUser.id,
    price: 750,
    etaPickup: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    message: 'Secure transport specialist. Can handle high-value electronics.',
    status: 'pending',
  });

  createBid({
    shipmentId: shipment5.id,
    carrierId: carrier2.id,
    price: 820,
    etaPickup: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
    message: 'Insured transport with GPS tracking available.',
    status: 'pending',
  });

  createBid({
    shipmentId: shipment6.id,
    carrierId: carrier2.id,
    price: 850,
    etaPickup: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    message: 'ADR certified driver with 10+ years experience.',
    status: 'pending',
  });

  createBid({
    shipmentId: shipment6.id,
    carrierId: carrierUser.id,
    price: 920,
    etaPickup: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
    message: 'Specialized chemical transport equipment available.',
    status: 'pending',
  });

  // Create comprehensive mock data for all features

  // Messages for shipments
  createMessage({
    shipmentId: shipment1.id,
    senderId: shipperUser.id,
    content: 'Hi, I have a question about the pickup time. Can we schedule it for 9 AM instead of 8 AM?',
  });

  createMessage({
    shipmentId: shipment1.id,
    senderId: carrierUser.id,
    content: 'Sure! 9 AM works perfectly for me. I\'ll be there with a tail lift truck.',
  });

  createMessage({
    shipmentId: shipment2.id,
    senderId: shipper2.id,
    content: 'Please ensure temperature is maintained at 2-8°C during transport.',
  });

  createMessage({
    shipmentId: shipment2.id,
    senderId: carrierUser.id,
    content: 'No problem! My truck has temperature control. I\'ll monitor it throughout the journey.',
  });

  createMessage({
    shipmentId: shipment3.id,
    senderId: shipperUser.id,
    content: 'The ADR documents are ready. Driver needs to bring valid ADR license.',
  });

  createMessage({
    shipmentId: shipment3.id,
    senderId: carrier2.id,
    content: 'Confirmed! I have ADR certification and all required safety equipment.',
  });

  // Notifications for users
  createNotification({
    userId: shipperUser.id,
    title: 'New Bid Received',
    message: 'You received a new bid of €280 for shipment from Amsterdam to Rotterdam',
    type: 'info',
    read: false,
  });

  createNotification({
    userId: shipperUser.id,
    title: 'Bid Accepted',
    message: 'Your bid for shipment to Eindhoven has been accepted by the shipper',
    type: 'success',
    read: true,
  });

  createNotification({
    userId: carrierUser.id,
    title: 'Shipment Assigned',
    message: 'You have been assigned to transport electronics from Utrecht to Eindhoven',
    type: 'success',
    read: false,
  });

  createNotification({
    userId: carrier2.id,
    title: 'Delivery Completed',
    message: 'Your delivery to Berlin has been completed successfully',
    type: 'success',
    read: true,
  });

  createNotification({
    userId: shipper2.id,
    title: 'Payment Processed',
    message: 'Payment of €450 has been processed for your completed shipment',
    type: 'success',
    read: false,
  });

  // Tracking points for in-transit shipments
  createTrackingPoint({
    shipmentId: shipment3.id,
    latitude: 53.5511,
    longitude: 9.9937,
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
    status: 'Picked up',
    notes: 'Shipment picked up from Hamburg port',
  });

  createTrackingPoint({
    shipmentId: shipment3.id,
    latitude: 52.5200,
    longitude: 13.4050,
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
    status: 'In transit',
    notes: 'Currently on A10 highway, making good progress',
  });

  createTrackingPoint({
    shipmentId: shipment3.id,
    latitude: 52.5200,
    longitude: 13.4050,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'Near destination',
    notes: 'Approaching Berlin distribution center',
  });

  // POD for delivered shipment
  createPOD({
    shipmentId: shipment4.id,
    carrierId: carrierUser.id,
    photoUrl: '/mock-pod-photo.jpg',
    signatureUrl: '/mock-signature.jpg',
    recipientName: 'Maria Schmidt',
    deliveryNotes: 'Delivered to loading dock as requested. Recipient confirmed goods in good condition.',
    deliveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  });

  // Ratings and reviews
  createRating({
    shipmentId: shipment4.id,
    raterId: shipper2.id,
    rateeId: carrierUser.id,
    rating: 5,
    comment: 'Excellent service! Driver was punctual, professional, and handled the goods with care. Highly recommended.',
  });

  createRating({
    shipmentId: shipment4.id,
    raterId: carrierUser.id,
    rateeId: shipper2.id,
    rating: 4,
    comment: 'Good communication throughout the process. Clear instructions and flexible with timing.',
  });

  // Shipment templates
  createShipmentTemplate({
    shipperId: shipperUser.id,
    name: 'Electronics - Amsterdam to Rotterdam',
    from: {
      street: '123 Main St',
      city: 'Amsterdam',
      postalCode: '1012 AB',
      country: 'Netherlands',
      latitude: 52.3676,
      longitude: 4.9041,
    },
    to: {
      street: '456 Business Ave',
      city: 'Rotterdam',
      postalCode: '3011 AA',
      country: 'Netherlands',
      latitude: 51.9244,
      longitude: 4.4777,
    },
    pallets: {
      quantity: 2,
      dimensions: { length: 120, width: 80, height: 144 },
      weight: 1500,
    },
    constraints: {
      tailLiftRequired: true,
      forkliftRequired: false,
      indoorDelivery: false,
      appointmentRequired: false,
    },
    notes: 'Standard electronics transport template',
  });

  createShipmentTemplate({
    shipperId: shipper2.id,
    name: 'Temperature Controlled - Utrecht to Eindhoven',
    from: {
      street: '789 Industrial Blvd',
      city: 'Utrecht',
      postalCode: '3511 AB',
      country: 'Netherlands',
      latitude: 52.0907,
      longitude: 5.1214,
    },
    to: {
      street: '321 Warehouse St',
      city: 'Eindhoven',
      postalCode: '5611 AA',
      country: 'Netherlands',
      latitude: 51.4416,
      longitude: 5.4697,
    },
    pallets: {
      quantity: 4,
      dimensions: { length: 120, width: 80, height: 144 },
      weight: 2800,
    },
    constraints: {
      tailLiftRequired: false,
      forkliftRequired: true,
      indoorDelivery: true,
      appointmentRequired: true,
    },
    notes: 'Temperature controlled goods template',
  });

  // Auto-bid rules for carriers
  createAutoBidRule({
    carrierId: carrierUser.id,
    name: 'Standard Pallet Transport',
    conditions: {
      maxPrice: 500,
      maxDistance: 200,
      adrRequired: false,
      tailLiftRequired: true,
    },
    bidPrice: 300,
    isActive: true,
  });

  createAutoBidRule({
    carrierId: carrierUser.id,
    name: 'ADR Dangerous Goods',
    conditions: {
      maxPrice: 1000,
      maxDistance: 300,
      adrRequired: true,
      tailLiftRequired: false,
    },
    bidPrice: 800,
    isActive: true,
  });

  createAutoBidRule({
    carrierId: carrier2.id,
    name: 'Temperature Controlled',
    conditions: {
      maxPrice: 600,
      maxDistance: 150,
      adrRequired: false,
      tailLiftRequired: false,
    },
    bidPrice: 450,
    isActive: true,
  });

  // Carrier cost models
  createCarrierCostModel({
    carrierId: carrierUser.id,
    name: 'Standard Rate Card',
    baseRate: 150,
    perKmRate: 1.2,
    perPalletRate: 25,
    adrSurcharge: 200,
    tailLiftSurcharge: 50,
    isActive: true,
  });

  createCarrierCostModel({
    carrierId: carrier2.id,
    name: 'Premium Service',
    baseRate: 200,
    perKmRate: 1.5,
    perPalletRate: 30,
    adrSurcharge: 250,
    tailLiftSurcharge: 75,
    isActive: true,
  });

  createCarrierCostModel({
    carrierId: carrier2.id,
    name: 'Economy Service',
    baseRate: 100,
    perKmRate: 0.8,
    perPalletRate: 20,
    adrSurcharge: 150,
    tailLiftSurcharge: 30,
    isActive: false,
  });

  console.log('Database seeded with comprehensive sample data');
  console.log(`Admin: admin@copallet.com / admin123`);
  console.log(`Shipper 1: shipper@example.com / admin123`);
  console.log(`Shipper 2: logistics@company.com / admin123`);
  console.log(`Carrier 1: carrier@example.com / admin123`);
  console.log(`Carrier 2: fleet@transport.com / admin123`);
  console.log(`Carrier 3 (Pending): driver@freight.com / admin123`);
  console.log(`Total users created: ${users.size}`);
  console.log(`Total shipments created: ${shipments.size}`);
  console.log(`Total bids created: ${bids.size}`);
  console.log(`Total messages created: ${messages.size}`);
  console.log(`Total notifications created: ${notifications.size}`);
  console.log(`Total tracking points created: ${trackingPoints.size}`);
  console.log(`Total PODs created: ${pods.size}`);
  console.log(`Total ratings created: ${ratings.size}`);
  console.log(`Total templates created: ${shipmentTemplates.size}`);
  console.log(`Total auto-bid rules created: ${autoBidRules.size}`);
  console.log(`Total cost models created: ${carrierCostModels.size}`);

  // Sample blog posts
  createBlogPost({
    title: "The Future of Pallet Freight: Digital Transformation in Logistics",
    slug: "future-pallet-freight-digital-transformation",
    date: new Date('2024-01-15'),
    content: `
      <p>The logistics industry is undergoing a massive digital transformation, and pallet freight is at the forefront of this revolution. Traditional freight forwarding methods are being replaced by intelligent platforms that connect shippers with carriers in real-time.</p>
      
      <h2>The Current State of Pallet Freight</h2>
      <p>Pallet freight represents one of the most efficient ways to transport goods across Europe. With standardized pallet sizes and established networks, it offers reliability and cost-effectiveness that other transport methods struggle to match.</p>
      
      <p>However, the industry has faced several challenges:</p>
      <ul>
        <li>Fragmented carrier networks</li>
        <li>Manual booking processes</li>
        <li>Limited visibility into shipment status</li>
        <li>Inefficient route planning</li>
      </ul>
      
      <h2>Digital Platforms: The Game Changer</h2>
      <p>Digital freight platforms like CoPallet are revolutionizing the industry by:</p>
      
      <h3>1. Intelligent Matching</h3>
      <p>Advanced algorithms analyze shipment requirements and carrier capabilities to find the perfect match. This reduces empty miles and improves efficiency.</p>
      
      <h3>2. Real-Time Tracking</h3>
      <p>GPS tracking and automated updates provide complete visibility from pickup to delivery. Shippers can track their goods in real-time, reducing anxiety and improving customer service.</p>
      
      <h3>3. Automated Processes</h3>
      <p>From booking to invoicing, digital platforms automate routine tasks, reducing errors and administrative overhead.</p>
      
      <h2>The Benefits for Shippers</h2>
      <p>Shippers are seeing significant benefits from digital freight platforms:</p>
      
      <ul>
        <li><strong>Cost Reduction:</strong> Up to 30% savings through better carrier matching and reduced empty miles</li>
        <li><strong>Improved Reliability:</strong> Verified carriers and performance tracking ensure consistent service</li>
        <li><strong>Better Visibility:</strong> Real-time tracking and automated notifications</li>
        <li><strong>Simplified Management:</strong> One platform for all freight needs</li>
      </ul>
      
      <h2>The Benefits for Carriers</h2>
      <p>Carriers also benefit significantly:</p>
      
      <ul>
        <li><strong>Increased Load Utilization:</strong> Better matching reduces empty return journeys</li>
        <li><strong>Streamlined Operations:</strong> Automated booking and documentation</li>
        <li><strong>Performance Insights:</strong> Analytics help optimize routes and pricing</li>
        <li><strong>Direct Access:</strong> Connect directly with shippers without intermediaries</li>
      </ul>
      
      <h2>Looking Ahead: The Future of Digital Freight</h2>
      <p>The future of pallet freight is undoubtedly digital. We're seeing several trends emerging:</p>
      
      <h3>Artificial Intelligence</h3>
      <p>AI is being used for predictive analytics, demand forecasting, and dynamic pricing. This helps optimize the entire supply chain.</p>
      
      <h3>Blockchain Integration</h3>
      <p>Blockchain technology is being explored for secure, transparent documentation and smart contracts.</p>
      
      <h3>Sustainability Focus</h3>
      <p>Digital platforms are helping reduce carbon emissions through better route optimization and load consolidation.</p>
      
      <h2>Conclusion</h2>
      <p>The digital transformation of pallet freight is not just a trend—it's a necessity. Companies that embrace these technologies will be better positioned to compete in an increasingly complex logistics landscape.</p>
      
      <p>At CoPallet, we're proud to be part of this transformation, helping shippers and carriers alike benefit from the power of digital logistics.</p>
    `,
    excerpt: "Discover how digital platforms are revolutionizing the pallet freight industry, making shipping more efficient and cost-effective for businesses of all sizes.",
    author: "Sarah Johnson",
    authorBio: "Sarah is a logistics technology expert with over 10 years of experience in freight management and digital transformation.",
    authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    category: "Industry Insights",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=400&fit=crop",
    featured: true,
    tags: ["Digital Transformation", "Logistics", "Freight", "Technology"],
    status: "published",
    publishedAt: new Date('2024-01-15'),
  });

  createBlogPost({
    title: "How to Choose the Right Carrier for Your Shipments",
    slug: "how-to-choose-right-carrier-shipments",
    date: new Date('2024-01-10'),
    content: `
      <p>Selecting the right carrier is crucial for successful freight management. With so many options available, it can be challenging to make the best choice. Here's a comprehensive guide to help you choose the perfect carrier for your shipments.</p>
      
      <h2>1. Assess Your Requirements</h2>
      <p>Before selecting a carrier, clearly define your shipping needs:</p>
      
      <ul>
        <li><strong>Shipment Volume:</strong> How many pallets do you ship regularly?</li>
        <li><strong>Geographic Coverage:</strong> What regions do you need coverage for?</li>
        <li><strong>Service Level:</strong> Do you need standard or express delivery?</li>
        <li><strong>Special Requirements:</strong> ADR, temperature control, tail lift, etc.</li>
        <li><strong>Budget Constraints:</strong> What's your target cost per shipment?</li>
      </ul>
      
      <h2>2. Evaluate Carrier Capabilities</h2>
      <p>Look for carriers that match your specific requirements:</p>
      
      <h3>Fleet Size and Capacity</h3>
      <p>Ensure the carrier has sufficient capacity to handle your volume consistently. A carrier with a small fleet might struggle during peak periods.</p>
      
      <h3>Service Areas</h3>
      <p>Verify that the carrier operates in all the regions you need. Some carriers specialize in specific routes or regions.</p>
      
      <h3>Equipment and Capabilities</h3>
      <p>Check if they have the right equipment for your needs:</p>
      <ul>
        <li>Tail lift trucks for ground-level delivery</li>
        <li>Temperature-controlled vehicles for perishables</li>
        <li>ADR-certified drivers for dangerous goods</li>
        <li>Forklift access for loading/unloading</li>
      </ul>
      
      <h2>3. Check Performance Metrics</h2>
      <p>Look for carriers with strong performance records:</p>
      
      <ul>
        <li><strong>On-Time Delivery:</strong> What percentage of deliveries are on time?</li>
        <li><strong>Damage Rate:</strong> How often do shipments arrive damaged?</li>
        <li><strong>Customer Satisfaction:</strong> What do other shippers say about them?</li>
        <li><strong>Response Time:</strong> How quickly do they respond to inquiries?</li>
      </ul>
      
      <h2>4. Consider Pricing Structure</h2>
      <p>Understand how carriers price their services:</p>
      
      <ul>
        <li><strong>Base Rate:</strong> Minimum charge per shipment</li>
        <li><strong>Per Kilometer:</strong> Distance-based pricing</li>
        <li><strong>Per Pallet:</strong> Volume-based pricing</li>
        <li><strong>Surcharges:</strong> Additional fees for special services</li>
      </ul>
      
      <h2>5. Verify Insurance and Compliance</h2>
      <p>Ensure the carrier meets all legal and insurance requirements:</p>
      
      <ul>
        <li>Proper insurance coverage for your goods</li>
        <li>Valid operating licenses</li>
        <li>ADR certification for dangerous goods</li>
        <li>Compliance with local regulations</li>
      </ul>
      
      <h2>6. Test with Small Shipments</h2>
      <p>Before committing to a large contract, test the carrier with smaller shipments:</p>
      
      <ul>
        <li>Evaluate their communication and updates</li>
        <li>Check delivery times and condition of goods</li>
        <li>Assess their problem-solving capabilities</li>
        <li>Review their invoicing and documentation</li>
      </ul>
      
      <h2>7. Build Long-Term Relationships</h2>
      <p>Once you find reliable carriers, invest in building relationships:</p>
      
      <ul>
        <li>Provide consistent volume for better rates</li>
        <li>Give advance notice of shipments when possible</li>
        <li>Pay invoices promptly</li>
        <li>Provide feedback to help them improve</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Choosing the right carrier is an investment in your supply chain success. Take the time to evaluate options thoroughly, test relationships, and build partnerships that will serve your business for years to come.</p>
      
      <p>Remember, the cheapest option isn't always the best. Focus on finding carriers that offer the right combination of reliability, service, and value for your specific needs.</p>
    `,
    excerpt: "Learn the key factors to consider when selecting a carrier, from pricing and reliability to specialized services and coverage areas.",
    author: "Mike Chen",
    authorBio: "Mike is a supply chain consultant specializing in carrier selection and freight optimization strategies.",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    category: "Shipping Tips",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=400&fit=crop",
    featured: false,
    tags: ["Carrier Selection", "Logistics", "Best Practices"],
    status: "published",
    publishedAt: new Date('2024-01-10'),
  });

  createBlogPost({
    title: "Cost Optimization Strategies for Pallet Shipping",
    slug: "cost-optimization-strategies-pallet-shipping",
    date: new Date('2024-01-05'),
    content: `
      <p>Reducing shipping costs while maintaining service quality is a constant challenge for businesses. Here are proven strategies to optimize your pallet shipping costs without compromising on delivery performance.</p>
      
      <h2>1. Consolidate Shipments</h2>
      <p>One of the most effective ways to reduce costs is through shipment consolidation:</p>
      
      <ul>
        <li><strong>Batch Orders:</strong> Group multiple orders going to the same region</li>
        <li><strong>Schedule Optimization:</strong> Plan shipments for optimal carrier utilization</li>
        <li><strong>Route Planning:</strong> Combine shipments on efficient routes</li>
      </ul>
      
      <h2>2. Optimize Pallet Utilization</h2>
      <p>Maximize the use of each pallet space:</p>
      
      <ul>
        <li><strong>Efficient Packing:</strong> Use proper palletization techniques</li>
        <li><strong>Mixed Loads:</strong> Combine compatible products on single pallets</li>
        <li><strong>Standard Sizes:</strong> Use standard pallet sizes for better carrier compatibility</li>
      </ul>
      
      <h2>3. Leverage Technology</h2>
      <p>Digital platforms can significantly reduce costs:</p>
      
      <ul>
        <li><strong>Real-Time Pricing:</strong> Compare rates across multiple carriers instantly</li>
        <li><strong>Route Optimization:</strong> AI-powered route planning reduces fuel costs</li>
        <li><strong>Load Matching:</strong> Better matching reduces empty miles</li>
      </ul>
      
      <h2>4. Build Carrier Relationships</h2>
      <p>Long-term relationships often lead to better rates:</p>
      
      <ul>
        <li><strong>Volume Commitments:</strong> Guarantee minimum volumes for better rates</li>
        <li><strong>Regular Routes:</strong> Establish consistent routes for preferred pricing</li>
        <li><strong>Performance Incentives:</strong> Reward carriers for excellent service</li>
      </ul>
      
      <h2>5. Flexible Scheduling</h2>
      <p>Flexibility can lead to significant savings:</p>
      
      <ul>
        <li><strong>Off-Peak Shipping:</strong> Ship during less busy periods for better rates</li>
        <li><strong>Lead Time Optimization:</strong> Give carriers more time for better pricing</li>
        <li><strong>Alternative Routes:</strong> Consider slightly longer routes for better rates</li>
      </ul>
      
      <h2>6. Monitor and Analyze</h2>
      <p>Regular analysis helps identify cost-saving opportunities:</p>
      
      <ul>
        <li><strong>Cost Tracking:</strong> Monitor shipping costs by route, carrier, and time</li>
        <li><strong>Performance Metrics:</strong> Track delivery times and service quality</li>
        <li><strong>Trend Analysis:</strong> Identify patterns and optimization opportunities</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Cost optimization is an ongoing process that requires continuous monitoring and adjustment. By implementing these strategies, you can significantly reduce your pallet shipping costs while maintaining or improving service quality.</p>
    `,
    excerpt: "Explore proven strategies to reduce your pallet shipping costs while maintaining service quality and delivery reliability.",
    author: "Emma Davis",
    authorBio: "Emma is a logistics cost optimization specialist with expertise in freight management and supply chain efficiency.",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    category: "Cost Management",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
    featured: false,
    tags: ["Cost Optimization", "Shipping", "Efficiency"],
    status: "published",
    publishedAt: new Date('2024-01-05'),
  });

  console.log(`Total blog posts created: ${blogPosts.size}`);
};

export { 
  User, 
  UserProfile, 
  Shipment, 
  Bid, 
  Message, 
  Notification, 
  TrackingPoint, 
  POD, 
  Rating, 
  ShipmentTemplate, 
  AutoBidRule, 
  CarrierCostModel,
  BlogPost
};
