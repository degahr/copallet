import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Shipment, TrackingPoint } from '../../types';
import { apiService } from '../../services/api';
import { 
  MapPin, 
  Clock, 
  Truck, 
  Package, 
  CheckCircle,
  AlertCircle,
  Navigation,
  Phone,
  MessageSquare,
  Loader2
} from 'lucide-react';

const Tracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [trackingPoints, setTrackingPoints] = useState<TrackingPoint[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [eta, setEta] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch shipment and tracking data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch shipment details
        const shipmentResponse = await apiService.getShipment(id);
        setShipment(shipmentResponse.shipment);
        
        // Fetch tracking points
        const trackingResponse = await apiService.getTrackingPoints(id);
        setTrackingPoints(trackingResponse.trackingPoints || []);
        
      } catch (err) {
        console.error('Error fetching tracking data:', err);
        setError('Failed to load tracking data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Real-time tracking simulation
  useEffect(() => {
    if (isTracking && shipment) {
      // Simulate GPS tracking with real API calls
      const interval = setInterval(async () => {
        try {
          // Mock location updates (in real app, this would be actual GPS)
          const mockLocation = {
            lat: 52.3676 + (Math.random() - 0.5) * 0.01,
            lng: 4.9041 + (Math.random() - 0.5) * 0.01
          };
          
          setCurrentLocation(mockLocation);
          
          // Add tracking point via API
          await apiService.addTrackingPoint(shipment.id, {
            latitude: mockLocation.lat,
            longitude: mockLocation.lng,
            accuracy: 5,
            speed: Math.random() * 80 + 20, // Random speed between 20-100 km/h
            heading: Math.random() * 360 // Random heading
          });

          // Refresh tracking points
          const trackingResponse = await apiService.getTrackingPoints(shipment.id);
          setTrackingPoints(trackingResponse.trackingPoints || []);

          // Calculate ETA (mock)
          const remainingDistance = Math.max(0, 150 - trackingPoints.length * 10);
          const etaMinutes = Math.floor(remainingDistance / 60 * 60); // Assuming 60 km/h
          setEta(`${Math.floor(etaMinutes / 60)}h ${etaMinutes % 60}m`);
        } catch (err) {
          console.error('Error adding tracking point:', err);
        }
      }, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    }
  }, [isTracking, shipment, trackingPoints.length]);

  const startTracking = () => {
    setIsTracking(true);
    // In a real app, request location permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to mock location
          setCurrentLocation({
            lat: 52.3676,
            lng: 4.9041
          });
        }
      );
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Truck className="h-5 w-5 text-yellow-600" />;
      case 'in-transit':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Tracking Data</h1>
        <p className="text-gray-600">Please wait while we fetch the latest tracking information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-8 w-8 mx-auto text-red-600 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Tracking</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Shipment Not Found</h1>
        <p className="text-gray-600">The shipment you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Live Tracking - #{shipment.id.slice(-8)}
          </h1>
          <p className="mt-2 text-gray-600">
            {shipment.from.city} → {shipment.to.city}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
            {getStatusIcon(shipment.status)}
            <span className="ml-2 capitalize">{shipment.status.replace('-', ' ')}</span>
          </span>
          
          {shipment.status === 'assigned' && (
            <button
              onClick={startTracking}
              disabled={isTracking}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Start Tracking
            </button>
          )}
          
          {isTracking && (
            <button
              onClick={stopTracking}
              className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Stop Tracking
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map and Tracking */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map Placeholder */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Live Map
            </h2>
            
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Interactive Map</p>
                <p className="text-sm text-gray-500">
                  {isTracking ? 'Live tracking active' : 'Start tracking to see live location'}
                </p>
                {currentLocation && (
                  <p className="text-xs text-gray-500 mt-2">
                    Current: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tracking Points */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tracking History</h2>
            
            {trackingPoints.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No tracking data yet</p>
                <p className="text-sm text-gray-500">Start tracking to see location updates</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trackingPoints.slice(-10).reverse().map((point) => (
                  <div key={point.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="h-3 w-3 bg-primary-600 rounded-full"></div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          Location Update
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(point.timestamp)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                        {point.accuracy && ` (±${point.accuracy}m)`}
                        {point.speed && ` • ${point.speed.toFixed(1)} km/h`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Overview</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Status</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                  {shipment.status.replace('-', ' ')}
                </span>
              </div>
              
              {isTracking && eta && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estimated Arrival</span>
                  <span className="text-sm font-medium text-gray-900">{eta}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tracking Points</span>
                <span className="text-sm font-medium text-gray-900">{trackingPoints.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Update</span>
                <span className="text-sm font-medium text-gray-900">
                  {trackingPoints.length > 0 
                    ? formatTime(trackingPoints[trackingPoints.length - 1].timestamp)
                    : 'Never'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Route Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Details</h3>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-900">Pickup</div>
                <div className="text-sm text-gray-600">{shipment.from.city}</div>
                <div className="text-xs text-gray-500">{shipment.from.street}</div>
              </div>
              
              <div className="border-l-2 border-gray-200 pl-3 ml-2">
                <div className="text-sm font-medium text-gray-900">Delivery</div>
                <div className="text-sm text-gray-600">{shipment.to.city}</div>
                <div className="text-xs text-gray-500">{shipment.to.street}</div>
              </div>
            </div>
          </div>

          {/* Contact & Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Phone className="h-4 w-4 mr-2" />
                Call Driver
              </button>
              
              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </button>
              
              {shipment.status === 'in-transit' && (
                <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;