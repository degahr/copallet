import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShipment } from '../contexts/ShipmentContext';
import { useAuth } from '../contexts/AuthContext';
import { Shipment, ServiceConstraints, Address } from '../types';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Package, 
  Truck, 
  Clock,
  AlertTriangle,
  Euro,
  TrendingUp,
  Eye,
  MessageSquare
} from 'lucide-react';

const CarrierMarketplace: React.FC = () => {
  const { shipments, bids } = useShipment();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    maxDistance: 100,
    minPrice: 0,
    maxPrice: 10000,
    adrAllowed: false,
    tailLiftRequired: false,
    forkliftRequired: false,
    indoorDelivery: false,
    appointmentRequired: false
  });

  // Filter open shipments for carriers
  const openShipments = shipments.filter(shipment => 
    shipment.status === 'open' && shipment.shipperId !== user?.id
  );

  // Apply filters
  const filteredShipments = openShipments.filter(shipment => {
    const matchesSearch = 
      shipment.from?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.to?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.id.includes(searchTerm);
    
    const matchesPrice = 
      (!shipment.priceGuidance || 
       (shipment.priceGuidance.min >= filters.minPrice && 
        shipment.priceGuidance.max <= filters.maxPrice));
    
    const matchesADR = !filters.adrAllowed || shipment.adrRequired;
    
    const matchesConstraints = 
      (!filters.tailLiftRequired || shipment.constraints?.tailLiftRequired) &&
      (!filters.forkliftRequired || shipment.constraints?.forkliftRequired) &&
      (!filters.indoorDelivery || shipment.constraints?.indoorDelivery) &&
      (!filters.appointmentRequired || shipment.constraints?.appointmentRequired);
    
    return matchesSearch && matchesPrice && matchesADR && matchesConstraints;
  });

  const getBidCount = (shipmentId: string) =>
    bids.filter(bid => bid.shipmentId === shipmentId).length;

  const hasUserBid = (shipmentId: string) =>
    bids.some(bid => bid.shipmentId === shipmentId && bid.carrierId === user?.id);

  const calculateDistance = () => {
    // Mock distance calculation
    return Math.floor(Math.random() * 200) + 50;
  };

  const calculateROI = (shipment: Shipment) => {
    // Mock ROI calculation
    const distance = calculateDistance();
    const basePrice = shipment.priceGuidance?.min || 100;
    const estimatedCost = distance * 0.8 + 50; // Mock cost calculation
    const profit = basePrice - estimatedCost;
    return profit > 0 ? ((profit / estimatedCost) * 100).toFixed(1) : '0';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Available Loads</h2>
        <p className="text-gray-600">Find shipments that match your routes and capabilities</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by origin, destination, or shipment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.adrAllowed}
                onChange={(e) => setFilters(prev => ({ ...prev, adrAllowed: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">ADR Required</span>
            </label>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price (€)</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (€)</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) || 10000 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.tailLiftRequired}
                    onChange={(e) => setFilters(prev => ({ ...prev, tailLiftRequired: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-xs text-gray-700">Tail Lift</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.forkliftRequired}
                    onChange={(e) => setFilters(prev => ({ ...prev, forkliftRequired: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-xs text-gray-700">Forklift</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.indoorDelivery}
                    onChange={(e) => setFilters(prev => ({ ...prev, indoorDelivery: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-xs text-gray-700">Indoor</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.appointmentRequired}
                    onChange={(e) => setFilters(prev => ({ ...prev, appointmentRequired: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-xs text-gray-700">Appointment</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {filteredShipments.length} load{filteredShipments.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Shipments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredShipments.length === 0 ? (
          <div className="col-span-2 bg-white rounded-lg shadow p-12 text-center">
            <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No loads found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or check back later for new loads.
            </p>
          </div>
        ) : (
          filteredShipments.map((shipment) => {
            const distance = calculateDistance();
            const roi = calculateROI(shipment);
            const bidCount = getBidCount(shipment.id);
            const userHasBid = hasUserBid(shipment.id);

            return (
              <div key={shipment.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {shipment.from?.city} → {shipment.to?.city}
                      </h3>
                      <p className="text-sm text-gray-600">Shipment #{shipment.id.slice(0, 8)}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {shipment.status}
                      </span>
                      {bidCount > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {bidCount} bid{bidCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>~{distance}km</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Package className="h-4 w-4 mr-2" />
                      <span>{shipment.palletCount} pallets</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{shipment.pickupDate}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Euro className="h-4 w-4 mr-2" />
                      <span>€{shipment.priceGuidance?.min || 0} - €{shipment.priceGuidance?.max || 0}</span>
                    </div>
                  </div>

                  {/* ROI Indicator */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Estimated ROI</span>
                      <span className={`text-sm font-semibold ${
                        parseFloat(roi) > 20 ? 'text-green-600' : 
                        parseFloat(roi) > 10 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {roi}%
                      </span>
                    </div>
                  </div>

                  {/* Requirements */}
                  {shipment.constraints && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {shipment.constraints.tailLiftRequired && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Tail Lift Required
                          </span>
                        )}
                        {shipment.constraints.forkliftRequired && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Forklift Required
                          </span>
                        )}
                        {shipment.constraints.indoorDelivery && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Indoor Delivery
                          </span>
                        )}
                        {shipment.constraints.appointmentRequired && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Appointment Required
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Posted {formatDate(shipment.createdAt)}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link
                        to={`/app/shipments/${shipment.id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                      
                      {userHasBid ? (
                        <span className="inline-flex items-center px-3 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Bid Placed
                        </span>
                      ) : (
                        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                          <Euro className="h-4 w-4 mr-1" />
                          Place Bid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CarrierMarketplace;
