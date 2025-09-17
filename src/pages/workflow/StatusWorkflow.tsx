import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShipment } from '../../contexts/ShipmentContext';
import { useAuth } from '../../contexts/AuthContext';
import { Shipment, ShipmentStatus } from '../../types';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  Truck, 
  Package,
  AlertCircle,
  ArrowLeft,
  MapPin,
  Calendar,
  User
} from 'lucide-react';

const StatusWorkflow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { shipments, updateShipmentStatus } = useShipment();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const shipment = shipments.find(s => s.id === id);
  
  if (!shipment) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Shipment Not Found</h2>
          <p className="text-gray-600">The requested shipment could not be found.</p>
        </div>
      </div>
    );
  }

  const getStatusInfo = (status: ShipmentStatus) => {
    switch (status) {
      case 'draft':
        return { 
          label: 'Draft', 
          color: 'gray', 
          icon: Package,
          description: 'Shipment is being prepared',
          nextActions: ['Post to Marketplace']
        };
      case 'open':
        return { 
          label: 'Open for Bidding', 
          color: 'blue', 
          icon: Clock,
          description: 'Waiting for carrier bids',
          nextActions: ['Accept Bid', 'Cancel Shipment']
        };
      case 'assigned':
        return { 
          label: 'Assigned', 
          color: 'purple', 
          icon: Truck,
          description: 'Carrier assigned, awaiting pickup',
          nextActions: ['Start Job', 'Cancel Assignment']
        };
      case 'in-transit':
        return { 
          label: 'In Transit', 
          color: 'yellow', 
          icon: Truck,
          description: 'Shipment is on the way',
          nextActions: ['Update Location', 'Complete Delivery']
        };
      case 'delivered':
        return { 
          label: 'Delivered', 
          color: 'green', 
          icon: CheckCircle,
          description: 'Shipment completed successfully',
          nextActions: ['Rate Carrier', 'Archive']
        };
      case 'cancelled':
        return { 
          label: 'Cancelled', 
          color: 'red', 
          icon: AlertCircle,
          description: 'Shipment was cancelled',
          nextActions: ['Create New Shipment']
        };
      default:
        return { 
          label: 'Unknown', 
          color: 'gray', 
          icon: Package,
          description: 'Status unknown',
          nextActions: []
        };
    }
  };

  const statusInfo = getStatusInfo(shipment.status);
  const StatusIcon = statusInfo.icon;

  const handleStatusChange = async (newStatus: ShipmentStatus) => {
    setLoading(true);
    try {
      await updateShipmentStatus(shipment.id, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update shipment status');
    } finally {
      setLoading(false);
    }
  };

  const getNextStatus = (currentStatus: ShipmentStatus): ShipmentStatus | null => {
    switch (currentStatus) {
      case 'draft': return 'open';
      case 'open': return 'assigned';
      case 'assigned': return 'in-transit';
      case 'in-transit': return 'delivered';
      default: return null;
    }
  };

  const canChangeStatus = (currentStatus: ShipmentStatus, userRole: string) => {
    if (userRole === 'admin') return true;
    
    switch (currentStatus) {
      case 'draft':
        return userRole === 'shipper';
      case 'open':
        return userRole === 'shipper';
      case 'assigned':
        return userRole === 'carrier' || userRole === 'shipper';
      case 'in-transit':
        return userRole === 'carrier';
      case 'delivered':
        return userRole === 'shipper';
      default:
        return false;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <StatusIcon className={`h-6 w-6 mr-2 text-${statusInfo.color}-600`} />
                Status Workflow
              </h1>
              <p className="text-gray-600">Shipment #{shipment.id.slice(-8)}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Status */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Current Status
                </h2>
                <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                  statusInfo.color === 'green' ? 'bg-green-100 text-green-800' :
                  statusInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                  statusInfo.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                  statusInfo.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  statusInfo.color === 'red' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  <StatusIcon className="h-4 w-4 mr-2" />
                  {statusInfo.label}
                </div>
                <p className="text-gray-600 mt-2">{statusInfo.description}</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(shipment.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Timeline</h2>
            <div className="space-y-4">
              {[
                { status: 'draft', label: 'Draft Created', date: shipment.createdAt },
                { status: 'open', label: 'Posted to Marketplace', date: shipment.status === 'open' ? shipment.updatedAt : null },
                { status: 'assigned', label: 'Carrier Assigned', date: shipment.status === 'assigned' ? shipment.updatedAt : null },
                { status: 'in-transit', label: 'In Transit', date: shipment.status === 'in-transit' ? shipment.updatedAt : null },
                { status: 'delivered', label: 'Delivered', date: shipment.status === 'delivered' ? shipment.updatedAt : null }
              ].map((timelineItem, index) => {
                const isCompleted = shipment.status === timelineItem.status || 
                  (timelineItem.status === 'draft' && shipment.status !== 'draft');
                const isCurrent = shipment.status === timelineItem.status;
                
                return (
                  <div key={timelineItem.status} className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500 text-white' : 
                      isCurrent ? 'bg-blue-500 text-white' : 
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {timelineItem.label}
                      </p>
                      {timelineItem.date && (
                        <p className="text-xs text-gray-500">
                          {formatDate(timelineItem.date)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          {canChangeStatus(shipment.status, user?.role || '') && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Actions</h2>
              <div className="flex flex-wrap gap-3">
                {statusInfo.nextActions.map((action) => {
                  const nextStatus = getNextStatus(shipment.status);
                  if (action === 'Post to Marketplace' && nextStatus) {
                    return (
                      <button
                        key={action}
                        onClick={() => handleStatusChange(nextStatus)}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Updating...' : action}
                      </button>
                    );
                  }
                  
                  if (action === 'Start Job' && nextStatus) {
                    return (
                      <button
                        key={action}
                        onClick={() => handleStatusChange(nextStatus)}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Starting...' : action}
                      </button>
                    );
                  }
                  
                  if (action === 'Complete Delivery' && nextStatus) {
                    return (
                      <button
                        key={action}
                        onClick={() => handleStatusChange(nextStatus)}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Completing...' : action}
                      </button>
                    );
                  }
                  
                  return (
                    <button
                      key={action}
                      disabled
                      className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
                    >
                      {action}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Shipment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Route Information
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">From:</span>
                  <p className="font-medium">{shipment.from.city}, {shipment.from.country}</p>
                </div>
                <div>
                  <span className="text-gray-600">To:</span>
                  <p className="font-medium">{shipment.to.city}, {shipment.to.country}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Pickup:</span>
                  <p className="font-medium">{formatDate(shipment.pickupWindow.start)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Delivery:</span>
                  <p className="font-medium">{formatDate(shipment.deliveryWindow.start)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusWorkflow;
