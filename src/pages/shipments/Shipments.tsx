import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShipment } from '../../contexts/ShipmentContext';
import { useAuth } from '../../contexts/AuthContext';
import { Shipment, ShipmentStatus } from '../../types';
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Package, 
  Truck, 
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  MoreVertical
} from 'lucide-react';

const Shipments: React.FC = () => {
  const { shipments, bids } = useShipment();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'price'>('date');

  // Filter shipments based on user role
  const userShipments = shipments.filter(shipment => {
    if (user?.role === 'shipper') {
      return shipment.shipperId === user.id;
    }
    // For carriers, show shipments they've bid on or are assigned to
    return bids.some(bid => bid.shipmentId === shipment.id && bid.carrierId === user?.id);
  });

  // Filter and search
  const filteredShipments = userShipments.filter(shipment => {
    const matchesSearch = 
      shipment.from.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.to.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.id.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort shipments
  const sortedShipments = [...filteredShipments].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'status':
        return a.status.localeCompare(b.status);
      case 'price': {
        const aPrice = a.priceGuidance?.min || 0;
        const bPrice = b.priceGuidance?.min || 0;
        return bPrice - aPrice;
      }
      default:
        return 0;
    }
  });

  const getStatusIcon = (status: ShipmentStatus) => {
    switch (status) {
      case 'draft':
        return <Edit className="h-4 w-4" />;
      case 'open':
        return <Clock className="h-4 w-4" />;
      case 'assigned':
        return <Truck className="h-4 w-4" />;
      case 'in-transit':
        return <Package className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: ShipmentStatus) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-transit':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBidCount = (shipmentId: string) => {
    return bids.filter(bid => bid.shipmentId === shipmentId).length;
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Shipments</h1>
          <p className="mt-2 text-gray-600">
            {user?.role === 'shipper' 
              ? 'Manage your shipments and track their progress'
              : 'View shipments you\'re involved with'
            }
          </p>
        </div>
        {user?.role === 'shipper' && (
          <Link
            to="/app/shipments/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Shipment
          </Link>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by city, shipment ID..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ShipmentStatus | 'all')}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'status' | 'price')}
            >
              <option value="date">Sort by Date</option>
              <option value="status">Sort by Status</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipments List */}
      <div className="space-y-4">
        {sortedShipments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : user?.role === 'shipper' 
                  ? 'Create your first shipment to get started'
                  : 'No shipments available at the moment'
              }
            </p>
            {user?.role === 'shipper' && !searchTerm && statusFilter === 'all' && (
              <Link
                to="/app/shipments/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Shipment
              </Link>
            )}
          </div>
        ) : (
          sortedShipments.map((shipment) => (
            <div key={shipment.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                        {getStatusIcon(shipment.status)}
                        <span className="ml-1 capitalize">{shipment.status.replace('-', ' ')}</span>
                      </span>
                      <span className="text-sm text-gray-500">#{shipment.id.slice(-8)}</span>
                      {shipment.adrRequired && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          ADR
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{shipment.from.city}</div>
                          <div className="text-xs text-gray-500">{shipment.from.country}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{shipment.to.city}</div>
                          <div className="text-xs text-gray-500">{shipment.to.country}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Package className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{shipment.pallets.quantity} pallets</div>
                          <div className="text-xs text-gray-500">{shipment.pallets.weight}kg</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <div>Pickup: {formatDateTime(shipment.pickupWindow.start)}</div>
                          <div>Delivery: {formatDateTime(shipment.deliveryWindow.end)}</div>
                        </div>
                      </div>
                      
                      <div>
                        {shipment.priceGuidance && (
                          <div className="text-lg font-semibold text-gray-900">
                            €{shipment.priceGuidance.min} - €{shipment.priceGuidance.max}
                          </div>
                        )}
                        {user?.role === 'shipper' && shipment.status === 'open' && (
                          <div className="text-sm text-blue-600">
                            {getBidCount(shipment.id)} bids received
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/app/shipments/${shipment.id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                    
                    {user?.role === 'shipper' && shipment.status === 'draft' && (
                      <Link
                        to={`/app/shipments/${shipment.id}/edit`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Shipments;