import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShipment } from '../../contexts/ShipmentContext';
import { useAuth } from '../../contexts/AuthContext';
import { useErrorHandler } from '../../contexts/ErrorContext';
import { useToastHelpers } from '../../contexts/ToastContext';
import { Input, Textarea } from '../../components/forms/FormFields';
import { Shipment, Bid, ROIMetrics, Address } from '../../types';
import { 
  MapPin, 
  Calendar, 
  Package, 
  Truck, 
  Clock,
  AlertTriangle,
  Euro,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Users,
  Route,
  Camera,
  Workflow
} from 'lucide-react';

const ShipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { shipments, bids, createBid, acceptBid } = useShipment();
  const { user } = useAuth();
  const { handleError } = useErrorHandler();
  const { showSuccess } = useToastHelpers();
  
  const [showBidForm, setShowBidForm] = useState(false);
  const [showROI, setShowROI] = useState(false);
  const [bidForm, setBidForm] = useState({
    price: 0,
    etaPickup: new Date(),
    message: ''
  });
  const [bidErrors, setBidErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const shipment = shipments.find(s => s.id === id);
  const shipmentBids = bids.filter(bid => bid.shipmentId === id);
  const userBid = shipmentBids.find(bid => bid.carrierId === user?.id);

  if (!shipment) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Shipment Not Found</h1>
        <Link
          to="/app/shipments"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shipments
        </Link>
      </div>
    );
  }

  // const formatDate = (date: Date) => {
  //   return new Date(date).toLocaleDateString('en-US', {
  //     month: 'short',
  //     day: 'numeric',
  //     year: 'numeric'
  //   });
  // };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDistance = () => {
    // Mock distance calculation
    return Math.floor(Math.random() * 500) + 50;
  };

  const calculateROI = (bidPrice: number): ROIMetrics => {
    const distance = calculateDistance();
    const deadheadKm = Math.floor(Math.random() * 100) + 20;
    const costPerKm = 0.8; // €0.80 per km
    const driverCostPerHour = 25; // €25 per hour
    const timeEstimate = (distance + deadheadKm) / 60; // hours at 60 km/h
    const platformFeePercentage = 0.05; // 5%
    
    const variableCost = (distance + deadheadKm) * costPerKm + timeEstimate * driverCostPerHour;
    const platformFee = bidPrice * platformFeePercentage;
    const profit = bidPrice - variableCost - platformFee;
    const roiPercentage = profit > 0 ? (profit / variableCost) * 100 : 0;

    return {
      routeKm: distance,
      deadheadKm,
      timeEstimate,
      variableCost,
      platformFee,
      profit,
      roiPercentage
    };
  };

  const handleBidFormChange = (field: string, value: string | number | Date) => {
    setBidForm(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (bidErrors[field]) {
      setBidErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setBidErrors({});

    try {
      // Basic validation
      if (bidForm.price <= 0) {
        setBidErrors({ price: 'Bid price must be greater than 0' });
        setLoading(false);
        return;
      }

      // Check if ETA is in the future
      if (bidForm.etaPickup <= new Date()) {
        setBidErrors({ etaPickup: 'ETA pickup must be in the future' });
        setLoading(false);
        return;
      }

      // Check if ETA is within shipment pickup window
      if (shipment?.pickupWindow && 
          (bidForm.etaPickup < shipment.pickupWindow.start || 
           bidForm.etaPickup > shipment.pickupWindow.end)) {
        setBidErrors({ etaPickup: 'ETA pickup must be within the shipment pickup window' });
        setLoading(false);
        return;
      }

      const roi = calculateROI(bidForm.price);
      await createBid({
        shipmentId: shipment!.id,
        carrierId: user?.id || '',
        price: bidForm.price,
        etaPickup: bidForm.etaPickup,
        message: bidForm.message,
        status: 'pending',
        roi
      });
      
      showSuccess('Bid Placed!', 'Your bid has been submitted successfully.');
      setShowBidForm(false);
      setBidForm({ price: 0, etaPickup: new Date(), message: '' });
    } catch (error) {
      console.error('Failed to place bid:', error);
      handleError(error, 'Failed to place bid');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    setLoading(true);
    try {
      await acceptBid(bidId);
    } catch (error) {
      console.error('Failed to accept bid:', error);
    } finally {
      setLoading(false);
    }
  };

  const isShipper = user?.role === 'shipper';
  const isCarrier = user?.role === 'carrier' || user?.role === 'dispatcher';
  const canBid = isCarrier && shipment.status === 'open' && !userBid;
  const canAcceptBids = isShipper && shipment.status === 'open' && shipmentBids.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to={isShipper ? "/app/shipments" : "/app/marketplace"}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Shipment #{shipment.id.slice(-8)}
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                shipment.status === 'open' ? 'bg-blue-100 text-blue-800' :
                shipment.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                shipment.status === 'in-transit' ? 'bg-purple-100 text-purple-800' :
                shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {shipment.status.replace('-', ' ')}
              </span>
              {shipment.adrRequired && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  ADR Required
                </span>
              )}
            </div>
          </div>
        </div>

        {canBid && (
          <button
            onClick={() => setShowBidForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <Euro className="h-4 w-4 mr-2" />
            Place Bid
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Route className="h-5 w-5 mr-2" />
              Route Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Pickup Location</h3>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">{shipment.from.street}</div>
                    <div className="text-sm text-gray-600">
                      {shipment.from.city}, {shipment.from.postalCode}
                    </div>
                    <div className="text-sm text-gray-500">{shipment.from.country}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Location</h3>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">{shipment.to.street}</div>
                    <div className="text-sm text-gray-600">
                      {shipment.to.city}, {shipment.to.postalCode}
                    </div>
                    <div className="text-sm text-gray-500">{shipment.to.country}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Pickup Window</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <div>
                      <div>{formatDateTime(shipment.pickupWindow.start)}</div>
                      <div>to {formatDateTime(shipment.pickupWindow.end)}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Window</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <div>
                      <div>{formatDateTime(shipment.deliveryWindow.start)}</div>
                      <div>to {formatDateTime(shipment.deliveryWindow.end)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cargo Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Cargo Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Pallets</h3>
                <div className="text-2xl font-bold text-gray-900">{shipment.pallets.quantity}</div>
                <div className="text-sm text-gray-600">Total weight: {shipment.pallets.weight}kg</div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Dimensions</h3>
                <div className="text-lg font-semibold text-gray-900">
                  {shipment.pallets.dimensions.length} × {shipment.pallets.dimensions.width} × {shipment.pallets.dimensions.height} cm
                </div>
                <div className="text-sm text-gray-600">Per pallet</div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Distance</h3>
                <div className="text-2xl font-bold text-gray-900">{calculateDistance(shipment.from, shipment.to)}km</div>
                <div className="text-sm text-gray-600">Estimated route</div>
              </div>
            </div>

            {/* Service Requirements */}
            {Object.values(shipment.constraints).some(Boolean) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Service Requirements</h3>
                <div className="flex flex-wrap gap-2">
                  {shipment.constraints.tailLiftRequired && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <Truck className="h-4 w-4 mr-1" />
                      Tail-lift Required
                    </span>
                  )}
                  {shipment.constraints.forkliftRequired && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <Package className="h-4 w-4 mr-1" />
                      Forklift Required
                    </span>
                  )}
                  {shipment.constraints.indoorDelivery && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      <MapPin className="h-4 w-4 mr-1" />
                      Indoor Delivery
                    </span>
                  )}
                  {shipment.constraints.appointmentRequired && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="h-4 w-4 mr-1" />
                      Appointment Required
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {shipment.notes && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Notes</h3>
                <p className="text-sm text-gray-600">{shipment.notes}</p>
              </div>
            )}
          </div>

          {/* Bids Section */}
          {shipmentBids.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Bids ({shipmentBids.length})
              </h2>
              
              <div className="space-y-4">
                {shipmentBids.map((bid) => (
                  <div key={bid.id} className={`border rounded-lg p-4 ${
                    bid.status === 'accepted' ? 'border-green-200 bg-green-50' :
                    bid.status === 'declined' ? 'border-red-200 bg-red-50' :
                    'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="text-xl font-bold text-gray-900">€{bid.price}</div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            bid.status === 'declined' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {bid.status}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          ETA Pickup: {formatDateTime(bid.etaPickup)}
                        </div>
                        
                        {bid.message && (
                          <p className="text-sm text-gray-600 mb-2">{bid.message}</p>
                        )}

                        {bid.roi && (
                          <div className="bg-gray-50 rounded p-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Estimated ROI:</span>
                              <span className={`font-semibold ${bid.roi.roiPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {bid.roi.roiPercentage > 0 ? '+' : ''}{bid.roi.roiPercentage.toFixed(1)}%
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Route: {bid.roi.routeKm}km • Deadhead: {bid.roi.deadheadKm}km • Profit: €{bid.roi.profit.toFixed(0)}
                            </div>
                          </div>
                        )}
                      </div>

                      {canAcceptBids && bid.status === 'pending' && (
                        <button
                          onClick={() => handleAcceptBid(bid.id)}
                          disabled={loading}
                          className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Guidance */}
          {shipment.priceGuidance && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Guidance</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  €{shipment.priceGuidance.min} - €{shipment.priceGuidance.max}
                </div>
                <p className="text-sm text-gray-600">
                  Based on historical data for this route
                </p>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to={`/app/messaging/${shipment.id}`}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Shipper
              </Link>
              
              {isCarrier && (
                <button 
                  onClick={() => setShowROI(true)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Calculate ROI
                </button>
              )}

              {shipment.status === 'in-transit' && (
                <Link
                  to={`/app/pod/${shipment.id}`}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Capture POD
                </Link>
              )}

              <Link
                to={`/app/tracking/${shipment.id}`}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Route className="h-4 w-4 mr-2" />
                Track Shipment
              </Link>

              <Link
                to={`/app/workflow/${shipment.id}`}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Workflow className="h-4 w-4 mr-2" />
                Manage Status
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Modal */}
      {showROI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                ROI Calculation
              </h2>
              <button
                onClick={() => setShowROI(false)}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Route Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Route Analysis</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Distance:</span>
                    <span className="ml-2 font-medium">~150 km</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Estimated Time:</span>
                    <span className="ml-2 font-medium">2.5 hours</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Deadhead:</span>
                    <span className="ml-2 font-medium">~25 km</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Distance:</span>
                    <span className="ml-2 font-medium">~175 km</span>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle Cost (175 km × €0.45):</span>
                    <span className="font-medium">€78.75</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Driver Cost (2.5 hrs × €25):</span>
                    <span className="font-medium">€62.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuel Cost (175 km × €0.12):</span>
                    <span className="font-medium">€21.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Load/Unload Time (1 hr × €25):</span>
                    <span className="font-medium">€25.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Maintenance (175 km × €0.08):</span>
                    <span className="font-medium">€14.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Insurance (175 km × €0.05):</span>
                    <span className="font-medium">€8.75</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                    <span>Total Cost:</span>
                    <span>€210.00</span>
                  </div>
                </div>
              </div>

              {/* Revenue & Profit */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Revenue & Profit</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bid Amount:</span>
                    <span className="font-medium">€{shipment.priceGuidance?.max || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee (8.5%):</span>
                    <span className="font-medium">€{((shipment.priceGuidance?.max || 0) * 0.085).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net Revenue:</span>
                    <span className="font-medium">€{((shipment.priceGuidance?.max || 0) * 0.915).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-green-600">
                    <span>Net Profit:</span>
                    <span>€{(((shipment.priceGuidance?.max || 0) * 0.915) - 210).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-green-600">
                    <span>ROI:</span>
                    <span>{((((shipment.priceGuidance?.max || 0) * 0.915) - 210) / 210 * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>• This shipment offers a {((((shipment.priceGuidance?.max || 0) * 0.915) - 210) / 210 * 100).toFixed(1)}% ROI</p>
                  <p>• Consider bidding at €{Math.round(210 * 1.2)} for 20% margin</p>
                  <p>• Route efficiency is good with minimal deadhead</p>
                  <p>• ADR requirements may limit competition</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowROI(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowROI(false);
                  setShowBidForm(true);
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Place Bid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bid Form Modal */}
      {showBidForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Place Your Bid</h3>
              
              <form onSubmit={handlePlaceBid} className="space-y-4">
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  label="Bid Price (€)"
                  value={bidForm.price || ''}
                  onChange={(e) => handleBidFormChange('price', parseFloat(e.target.value) || 0)}
                  error={bidErrors.price}
                  helpText="Enter your competitive bid price"
                />

                <Input
                  type="datetime-local"
                  required
                  label="ETA Pickup"
                  value={bidForm.etaPickup.toISOString().slice(0, 16)}
                  onChange={(e) => handleBidFormChange('etaPickup', new Date(e.target.value))}
                  error={bidErrors.etaPickup}
                  helpText="When can you pick up the shipment?"
                />

                <Textarea
                  label="Message (Optional)"
                  placeholder="Any additional information..."
                  value={bidForm.message}
                  onChange={(e) => handleBidFormChange('message', e.target.value)}
                  error={bidErrors.message}
                  rows={3}
                />

                {bidForm.price > 0 && (
                  <div className="bg-gray-50 rounded p-3 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-600">Estimated ROI:</span>
                      <span className={`font-semibold ${calculateROI(bidForm.price).roiPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {calculateROI(bidForm.price).roiPercentage > 0 ? '+' : ''}{calculateROI(bidForm.price).roiPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Profit: €{calculateROI(bidForm.price).profit.toFixed(0)}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBidForm(false)}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || bidForm.price <= 0}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                  >
                    {loading ? 'Placing Bid...' : 'Place Bid'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentDetail;