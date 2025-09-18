// Types for CoPallet platform

export type UserRole = 'shipper' | 'carrier' | 'dispatcher' | 'admin' | 'receiver';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  company: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  companyName: string;
  billingAddress: Address;
  vatNumber?: string;
  defaultPickupContact?: Contact;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Contact {
  name: string;
  phone: string;
  email: string;
}

export interface Shipment {
  id: string;
  shipperId: string;
  status: ShipmentStatus;
  from: Address;
  to: Address;
  pickupWindow: TimeWindow;
  deliveryWindow: TimeWindow;
  pallets: PalletInfo;
  adrRequired: boolean;
  constraints: ServiceConstraints;
  notes?: string;
  priceGuidance?: PriceRange;
  bids: Bid[];
  createdAt: Date;
  updatedAt: Date;
}

export type ShipmentStatus = 
  | 'draft' 
  | 'open' 
  | 'assigned' 
  | 'in-transit' 
  | 'delivered' 
  | 'cancelled';

export interface TimeWindow {
  start: Date;
  end: Date;
}

export interface PalletInfo {
  quantity: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  weight: number;
}

export interface ServiceConstraints {
  tailLiftRequired: boolean;
  forkliftRequired: boolean;
  indoorDelivery: boolean;
  appointmentRequired: boolean;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface Bid {
  id: string;
  shipmentId: string;
  carrierId: string;
  price: number;
  etaPickup: Date;
  message?: string;
  status: BidStatus;
  roi?: ROIMetrics;
  createdAt: Date;
}

export type BidStatus = 'pending' | 'accepted' | 'declined';

export interface ROIMetrics {
  routeKm: number;
  deadheadKm: number;
  timeEstimate: number; // hours
  variableCost: number;
  platformFee: number;
  profit: number;
  roiPercentage: number;
}

export interface CarrierCostModel {
  id: string;
  carrierId: string;
  costPerKm: number;
  driverCostPerHour: number;
  loadTimeMinutes: number;
  unloadTimeMinutes: number;
  averageSpeedKmh: number;
  platformFeePercentage: number;
}

export interface TrackingPoint {
  id: string;
  shipmentId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  accuracy?: number;
  speed?: number;
  heading?: number;
}

export interface POD {
  id: string;
  shipmentId: string;
  photos: string[];
  signature?: string;
  recipientName: string;
  timestamp: Date;
  notes?: string;
}

export interface Message {
  id: string;
  shipmentId: string;
  senderId: string;
  content: string;
  attachments?: string[];
  timestamp: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  shipmentId?: string;
  read: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | 'new_bid'
  | 'bid_accepted'
  | 'bid_declined'
  | 'shipment_assigned'
  | 'eta_update'
  | 'delivery_complete'
  | 'message_received';
