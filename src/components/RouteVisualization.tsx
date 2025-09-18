import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Truck, Package, Clock, Navigation } from 'lucide-react';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TrackingPoint {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  accuracy?: number;
  speed?: number;
  heading?: number;
}

interface RouteVisualizationProps {
  from: { latitude: number; longitude: number; city: string; street: string };
  to: { latitude: number; longitude: number; city: string; street: string };
  trackingPoints: TrackingPoint[];
  currentLocation?: { lat: number; lng: number };
  isTracking?: boolean;
  className?: string;
}

// Custom icons
const createCustomIcon = (color: string, icon: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
      ">
        ${icon}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const pickupIcon = createCustomIcon('#10B981', '📦');
const deliveryIcon = createCustomIcon('#EF4444', '🏁');
const truckIcon = createCustomIcon('#3B82F6', '🚛');
const currentLocationIcon = createCustomIcon('#F59E0B', '📍');

const RouteVisualization: React.FC<RouteVisualizationProps> = ({
  from,
  to,
  trackingPoints,
  currentLocation,
  isTracking = false,
  className = ''
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([52.3676, 4.9041]);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  // Calculate map center and bounds
  useEffect(() => {
    const coordinates = [
      [from.latitude, from.longitude],
      [to.latitude, to.longitude],
      ...trackingPoints.map(point => [point.latitude, point.longitude] as [number, number]),
      ...(currentLocation ? [[currentLocation.lat, currentLocation.lng]] : [])
    ];

    if (coordinates.length > 0) {
      const lats = coordinates.map(coord => coord[0]);
      const lngs = coordinates.map(coord => coord[1]);
      
      const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
      const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
      
      setMapCenter([centerLat, centerLng]);
    }
  }, [from, to, trackingPoints, currentLocation]);

  // Generate route coordinates (simplified - in real app, use routing service)
  useEffect(() => {
    const route = [
      [from.latitude, from.longitude],
      ...trackingPoints.map(point => [point.latitude, point.longitude] as [number, number]),
      ...(currentLocation ? [[currentLocation.lat, currentLocation.lng]] : []),
      [to.latitude, to.longitude]
    ];
    setRouteCoordinates(route);
  }, [from, to, trackingPoints, currentLocation]);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDistance = (point1: [number, number], point2: [number, number]) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (point2[0] - point1[0]) * Math.PI / 180;
    const dLng = (point2[1] - point1[1]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const totalDistance = routeCoordinates.length > 1 
    ? routeCoordinates.reduce((total, point, index) => {
        if (index === 0) return 0;
        return total + getDistance(routeCoordinates[index - 1], point);
      }, 0)
    : 0;

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Route Visualization
          </h2>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Pickup
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              Route
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              Delivery
            </div>
            {isTracking && (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                Live
              </div>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="relative">
          <MapContainer
            center={mapCenter}
            zoom={8}
            style={{ height: '400px', width: '100%', borderRadius: '8px' }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Pickup Location */}
            <Marker position={[from.latitude, from.longitude]} icon={pickupIcon}>
              <Popup>
                <div className="text-center">
                  <div className="font-semibold text-green-600 mb-1">Pickup Location</div>
                  <div className="text-sm">{from.city}</div>
                  <div className="text-xs text-gray-500">{from.street}</div>
                </div>
              </Popup>
            </Marker>

            {/* Delivery Location */}
            <Marker position={[to.latitude, to.longitude]} icon={deliveryIcon}>
              <Popup>
                <div className="text-center">
                  <div className="font-semibold text-red-600 mb-1">Delivery Location</div>
                  <div className="text-sm">{to.city}</div>
                  <div className="text-xs text-gray-500">{to.street}</div>
                </div>
              </Popup>
            </Marker>

            {/* Tracking Points */}
            {trackingPoints.map((point, index) => (
              <CircleMarker
                key={point.id}
                center={[point.latitude, point.longitude]}
                radius={4}
                color="#3B82F6"
                fillColor="#3B82F6"
                weight={2}
                opacity={0.8}
                fillOpacity={0.6}
              >
                <Popup>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600 mb-1">Tracking Point #{index + 1}</div>
                    <div className="text-sm">{formatTime(point.timestamp)}</div>
                    <div className="text-xs text-gray-500">
                      {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                    </div>
                    {point.speed && (
                      <div className="text-xs text-gray-500">
                        Speed: {point.speed.toFixed(1)} km/h
                      </div>
                    )}
                    {point.accuracy && (
                      <div className="text-xs text-gray-500">
                        Accuracy: ±{point.accuracy}m
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {/* Current Location (if tracking) */}
            {currentLocation && isTracking && (
              <Marker position={[currentLocation.lat, currentLocation.lng]} icon={truckIcon}>
                <Popup>
                  <div className="text-center">
                    <div className="font-semibold text-yellow-600 mb-1">Current Location</div>
                    <div className="text-sm">Live Tracking Active</div>
                    <div className="text-xs text-gray-500">
                      {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Route Line */}
            {routeCoordinates.length > 1 && (
              <Polyline
                positions={routeCoordinates}
                color="#3B82F6"
                weight={3}
                opacity={0.7}
                dashArray="5, 5"
              />
            )}
          </MapContainer>

          {/* Map Overlay Info */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 text-sm">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Distance:</span>
                <span className="font-medium">{totalDistance.toFixed(1)} km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Points:</span>
                <span className="font-medium">{trackingPoints.length}</span>
              </div>
              {isTracking && (
                <div className="flex items-center justify-between text-green-600">
                  <span>Status:</span>
                  <span className="font-medium flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                    Live
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Route Summary */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <Package className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-900">Pickup</span>
            </div>
            <div className="text-sm text-gray-600">{from.city}</div>
            <div className="text-xs text-gray-500">{from.street}</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <Navigation className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-900">Route</span>
            </div>
            <div className="text-sm text-gray-600">{totalDistance.toFixed(1)} km</div>
            <div className="text-xs text-gray-500">{trackingPoints.length} tracking points</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <MapPin className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-sm font-medium text-gray-900">Delivery</span>
            </div>
            <div className="text-sm text-gray-600">{to.city}</div>
            <div className="text-xs text-gray-500">{to.street}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteVisualization;
