import { 
  createShipment, 
  getShipment, 
  getShipmentsByShipper, 
  getOpenShipments, 
  updateShipment,
  createBid,
  getBidsByShipment,
  getBidsByCarrier,
  updateBid,
  Shipment,
  Bid,
  ShipmentTemplate,
  createShipmentTemplate,
  updateShipmentTemplate,
  deleteShipmentTemplate,
  getShipmentTemplate,
  getTemplatesByShipper
} from '../db/memory';
import { CreateShipmentRequest, CreateBidRequest, ShipmentStatus } from '../types';

export class ShipmentService {
  static async createShipment(data: CreateShipmentRequest, shipperId: string): Promise<Shipment> {
    const shipment = createShipment({
      shipperId,
      status: 'draft',
      from: data.fromAddress,
      to: data.toAddress,
      pickupWindow: data.pickupWindow,
      deliveryWindow: data.deliveryWindow,
      pallets: data.pallets,
      adrRequired: data.adrRequired,
      constraints: data.constraints,
      notes: data.notes,
    });

    return shipment;
  }

  static async getShipment(id: string): Promise<Shipment | null> {
    return getShipment(id) || null;
  }

  static async getShipmentsByShipper(shipperId: string): Promise<Shipment[]> {
    return getShipmentsByShipper(shipperId);
  }

  static async getOpenShipments(): Promise<Shipment[]> {
    return getOpenShipments();
  }

  static async updateShipment(id: string, updates: Partial<Shipment>): Promise<Shipment | null> {
    return updateShipment(id, updates) || null;
  }

  static async publishShipment(id: string): Promise<Shipment | null> {
    return updateShipment(id, { status: 'open' }) || null;
  }

  static async assignShipment(id: string, carrierId: string): Promise<Shipment | null> {
    return updateShipment(id, { 
      status: 'assigned', 
      assignedCarrierId: carrierId,
      assignedAt: new Date()
    }) || null;
  }

  static async updateShipmentStatus(id: string, status: ShipmentStatus): Promise<Shipment | null> {
    return updateShipment(id, { status }) || null;
  }

  static async createBid(data: CreateBidRequest, carrierId: string): Promise<Bid> {
    const bid = createBid({
      ...data,
      carrierId,
      status: 'pending',
    });

    return bid;
  }

  static async getBidsByShipment(shipmentId: string): Promise<Bid[]> {
    return getBidsByShipment(shipmentId);
  }

  static async getBidsByCarrier(carrierId: string): Promise<Bid[]> {
    return getBidsByCarrier(carrierId);
  }

  static async getBidsByShipper(shipperId: string): Promise<Bid[]> {
    // Get all shipments by this shipper, then get bids for those shipments
    const shipments = getShipmentsByShipper(shipperId);
    const allBids: Bid[] = [];
    
    for (const shipment of shipments) {
      const shipmentBids = getBidsByShipment(shipment.id);
      allBids.push(...shipmentBids);
    }
    
    return allBids;
  }

  static async getAllBids(): Promise<Bid[]> {
    // This would need to be implemented in the memory database
    // For now, we'll get bids from all shipments
    const shipments = getOpenShipments();
    const allBids: Bid[] = [];
    
    for (const shipment of shipments) {
      const shipmentBids = getBidsByShipment(shipment.id);
      allBids.push(...shipmentBids);
    }
    
    return allBids;
  }

  static async acceptBid(bidId: string): Promise<{ bid: Bid; shipment: Shipment } | null> {
    const bid = updateBid(bidId, { status: 'accepted' });
    if (!bid) return null;

    // Update shipment
    const shipment = updateShipment(bid.shipmentId, {
      status: 'assigned',
      assignedCarrierId: bid.carrierId,
      assignedAt: new Date(),
    });

    if (!shipment) return null;

    // Decline all other bids for this shipment
    const otherBids = getBidsByShipment(bid.shipmentId);
    otherBids.forEach(otherBid => {
      if (otherBid.id !== bidId) {
        updateBid(otherBid.id, { status: 'declined' });
      }
    });

    return { bid, shipment };
  }

  static async declineBid(bidId: string): Promise<Bid | null> {
    return updateBid(bidId, { status: 'declined' }) || null;
  }

  // Template methods
  static async getTemplates(shipperId: string): Promise<ShipmentTemplate[]> {
    return getTemplatesByShipper(shipperId);
  }

  static async createTemplate(data: any, shipperId: string): Promise<ShipmentTemplate> {
    return createShipmentTemplate({
      ...data,
      shipperId,
    });
  }

  static async updateTemplate(templateId: string, data: any): Promise<ShipmentTemplate | null> {
    return updateShipmentTemplate(templateId, data) || null;
  }

  static async deleteTemplate(templateId: string): Promise<boolean> {
    return deleteShipmentTemplate(templateId);
  }

  static async getTemplate(templateId: string): Promise<ShipmentTemplate | null> {
    return getShipmentTemplate(templateId) || null;
  }

  static async createShipmentFromTemplate(templateId: string, additionalData: any, shipperId: string): Promise<Shipment> {
    const template = getShipmentTemplate(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    if (template.shipperId !== shipperId) {
      throw new Error('Access denied');
    }

    // Create shipment from template with additional data
    const shipmentData = {
      ...template,
      ...additionalData,
      shipperId,
      status: 'draft' as ShipmentStatus,
    };

    return createShipment(shipmentData);
  }
}
