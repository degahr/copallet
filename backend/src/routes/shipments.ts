import { Router } from 'express';
import { authenticateToken, requireVerified, requireShipper, requireCarrier } from '../middleware/auth/authMiddleware';
import { asyncHandler, CustomError } from '../middleware/errorHandler';
import { ShipmentService } from '../services/ShipmentService';
import { CreateShipmentRequestSchema, CreateBidRequestSchema } from '../types';
import { getShipment, createTrackingPoint, getTrackingPointsByShipment } from '../db/memory';

const router = Router();

// All shipment routes require authentication
router.use(authenticateToken);

// GET /api/shipments
router.get('/', requireVerified, asyncHandler(async (req, res) => {
  const user = req.user!;
  
  let shipments;
  if (user.role === 'shipper') {
    shipments = await ShipmentService.getShipmentsByShipper(user.userId);
  } else {
    shipments = await ShipmentService.getOpenShipments();
  }
  
  res.json({ shipments });
}));

// GET /api/bids
router.get('/bids', requireVerified, asyncHandler(async (req, res) => {
  const user = req.user!;
  
  let bids;
  if (user.role === 'carrier') {
    bids = await ShipmentService.getBidsByCarrier(user.userId);
  } else if (user.role === 'shipper') {
    bids = await ShipmentService.getBidsByShipper(user.userId);
  } else {
    // Admin can see all bids
    bids = await ShipmentService.getAllBids();
  }
  
  res.json({ bids });
}));

// Shipment Templates routes
// GET /api/shipments/templates - Get user's templates
router.get('/templates', authenticateToken, asyncHandler(async (req, res) => {
  const templates = await ShipmentService.getTemplates(req.user!.userId);
  res.json({ templates });
}));

// POST /api/shipments/templates - Create new template
router.post('/templates', authenticateToken, asyncHandler(async (req, res) => {
  if (req.user!.role !== 'shipper') {
    throw new CustomError('Only shippers can create templates', 403);
  }
  
  const template = await ShipmentService.createTemplate(req.body, req.user!.userId);
  res.status(201).json({
    message: 'Template created successfully',
    template
  });
}));

// PUT /api/shipments/templates/:id - Update template
router.put('/templates/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const template = await ShipmentService.updateTemplate(id, req.body);
  
  if (!template) {
    return res.status(404).json({ message: 'Template not found' });
  }
  
  res.json({
    message: 'Template updated successfully',
    template
  });
}));

// DELETE /api/shipments/templates/:id - Delete template
router.delete('/templates/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await ShipmentService.deleteTemplate(id);
  
  if (!deleted) {
    return res.status(404).json({ message: 'Template not found' });
  }
  
  res.json({ message: 'Template deleted successfully' });
}));

// POST /api/shipments/templates/:id/create-shipment - Create shipment from template
router.post('/templates/:id/create-shipment', authenticateToken, asyncHandler(async (req, res) => {
  if (req.user!.role !== 'shipper') {
    throw new CustomError('Only shippers can create shipments', 403);
  }
  
  const { id } = req.params;
  const shipment = await ShipmentService.createShipmentFromTemplate(id, req.body, req.user!.userId);
  
  res.status(201).json({
    message: 'Shipment created from template successfully',
    shipment
  });
}));

// POST /api/shipments
router.post('/', requireVerified, requireShipper, asyncHandler(async (req, res) => {
  const user = req.user!;
  const validatedData = CreateShipmentRequestSchema.parse(req.body);
  
  const shipment = await ShipmentService.createShipment(validatedData, user.userId);
  
  res.status(201).json({ shipment });
}));

// GET /api/shipments/:id
router.get('/:id', requireVerified, asyncHandler(async (req, res) => {
  const shipment = await ShipmentService.getShipment(req.params.id);
  
  if (!shipment) {
    return res.status(404).json({ error: 'Shipment not found' });
  }
  
  res.json({ shipment });
}));

// PUT /api/shipments/:id
router.put('/:id', requireVerified, asyncHandler(async (req, res) => {
  // TODO: Implement update shipment
  res.json({ message: 'Update shipment - TODO' });
}));

// POST /api/shipments/:id/bids
router.post('/:id/bids', requireVerified, requireCarrier, asyncHandler(async (req, res) => {
  const user = req.user!;
  const validatedData = CreateBidRequestSchema.parse(req.body);
  
  const bid = await ShipmentService.createBid(validatedData, user.userId);
  
  res.status(201).json({ bid });
}));

// PUT /api/shipments/:id/bids/:bidId/accept
router.put('/:id/bids/:bidId/accept', requireVerified, requireShipper, asyncHandler(async (req, res) => {
  const result = await ShipmentService.acceptBid(req.params.bidId);
  
  if (!result) {
    return res.status(404).json({ error: 'Bid not found' });
  }
  
  res.json({ 
    message: 'Bid accepted successfully',
    bid: result.bid,
    shipment: result.shipment
  });
}));

// GET /api/shipments/:id/tracking
router.get('/:id/tracking', requireVerified, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Verify shipment exists
  const shipment = getShipment(id);
  if (!shipment) {
    return res.status(404).json({ message: 'Shipment not found' });
  }
  
  // Get tracking points for this shipment
  const trackingPoints = getTrackingPointsByShipment(id);
  
  res.json({ 
    shipmentId: id,
    trackingPoints: trackingPoints.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  });
}));

// POST /api/shipments/:id/tracking
router.post('/:id/tracking', requireVerified, requireCarrier, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { latitude, longitude, accuracy, speed, heading } = req.body;
  
  // Verify shipment exists
  const shipment = getShipment(id);
  if (!shipment) {
    return res.status(404).json({ message: 'Shipment not found' });
  }
  
  // Validate required fields
  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }
  
  // Create tracking point
  const trackingPoint = createTrackingPoint({
    shipmentId: id,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    timestamp: new Date(),
    status: 'in-transit',
    accuracy: accuracy ? parseFloat(accuracy) : undefined,
    speed: speed ? parseFloat(speed) : undefined,
    heading: heading ? parseFloat(heading) : undefined,
  });
  
  res.status(201).json({ 
    message: 'Tracking point added successfully',
    trackingPoint 
  });
}));

// POST /api/shipments/:id/pod
router.post('/:id/pod', requireVerified, requireCarrier, asyncHandler(async (req, res) => {
  // TODO: Implement proof of delivery
  res.json({ message: 'Proof of delivery - TODO' });
}));

// GET /api/shipments/:id/messages
router.get('/:id/messages', requireVerified, asyncHandler(async (req, res) => {
  // TODO: Implement get messages
  res.json({ message: 'Get messages - TODO' });
}));

// POST /api/shipments/:id/messages
router.post('/:id/messages', requireVerified, asyncHandler(async (req, res) => {
  // TODO: Implement send message
  res.json({ message: 'Send message - TODO' });
}));

export default router;
