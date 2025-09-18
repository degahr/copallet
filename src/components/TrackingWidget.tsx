import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Truck, Package, Navigation } from 'lucide-react';
import { useTracking } from '../contexts/TrackingContext';
import { Shipment } from '../types';

interface TrackingWidgetProps {
  shipments: Shipment[];
  className?: string;
}

const TrackingWidget: React.FC<TrackingWidgetProps> = ({ shipments, className = '' }) => {
  const { activeTrackings, getTrackingData, startTracking, stopTracking } = useTracking();

  const activeShipments = shipments.filter(shipment => 
    shipment.status === 'assigned' || shipment.status === 'in-transit'
  );

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Truck className="h-4 w-4 text-yellow-600" />;
      case 'in-transit':
        return <Package className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  if (activeShipments.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Navigation className="h-5 w-5 mr-2" />
          Live Tracking
        </h3>
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No active shipments</p>
          <p className="text-sm text-gray-500">Create a shipment to start tracking</p>
          <Link
            to="/app/shipments/create"
            className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <Package className="h-4 w-4 mr-2" />
            Create Shipment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Navigation className="h-5 w-5 mr-2" />
        Live Tracking
      </h3>
      
      <div className="space-y-4">
        {activeShipments.slice(0, 3).map((shipment) => {
          const isTracking = activeTrackings.has(shipment.id);
          const trackingData = getTrackingData(shipment.id);
          const lastPoint = trackingData.points[trackingData.points.length - 1];
          
          return (
            <div key={shipment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                    {getStatusIcon(shipment.status)}
                    <span className="ml-1 capitalize">{shipment.status.replace('-', ' ')}</span>
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    #{shipment.id.slice(-8)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isTracking ? (
                    <div className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-xs font-medium">Live</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => startTracking(shipment.id)}
                      className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors"
                    >
                      Start
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{shipment.from.city} → {shipment.to.city}</span>
                </div>
                
                {lastPoint && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Last update: {formatTime(lastPoint.timestamp)}</span>
                  </div>
                )}
                
                {trackingData.points.length > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Navigation className="h-4 w-4 mr-2" />
                    <span>{trackingData.points.length} tracking points</span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <Link
                  to={`/app/tracking/${shipment.id}`}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View Details →
                </Link>
                
                {isTracking && (
                  <button
                    onClick={() => stopTracking(shipment.id)}
                    className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    Stop
                  </button>
                )}
              </div>
            </div>
          );
        })}
        
        {activeShipments.length > 3 && (
          <div className="text-center pt-2">
            <Link
              to="/app/shipments"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all {activeShipments.length} active shipments →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingWidget;
