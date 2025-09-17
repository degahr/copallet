import { Router } from 'express';
import { authenticateToken, requireVerified, requireShipper, requireCarrier } from '../middleware/auth/authMiddleware';
import { asyncHandler } from '../middleware/errorHandler';
import { ShipmentService } from '../services/ShipmentService';
import { CreateShipmentRequestSchema, CreateBidRequestSchema } from '../types';

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
  // TODO: Implement get tracking points
  res.json({ message: 'Get tracking points - TODO' });
}));

// POST /api/shipments/:id/tracking
router.post('/:id/tracking', requireVerified, requireCarrier, asyncHandler(async (req, res) => {
  // TODO: Implement add tracking point
  res.json({ message: 'Add tracking point - TODO' });
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
