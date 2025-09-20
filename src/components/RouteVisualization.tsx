import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Truck, Package, Clock, Navigation } from 'lucide-react';
import { RouteCalculationService, RouteCalculation } from '../services/routeCalculation';

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
  const [mapCenter, setMapCenter] = useState<[number, number]>([from.latitude, from.longitude]);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [mapZoom, setMapZoom] = useState<number>(10);
  const [routeCalculation, setRouteCalculation] = useState<RouteCalculation | null>(null);

  // Calculate realistic route using the RouteCalculationService
  useEffect(() => {
    if (from && to) {
      const route = RouteCalculationService.calculateRoute(from, to);
      setRouteCalculation(route);
      
      // Use the calculated waypoints for the route
      const coordinates = route.waypoints.map(waypoint => [waypoint.lat, waypoint.lng] as [number, number]);
      setRouteCoordinates(coordinates);
    }
  }, [from, to]);

  // Calculate map center and zoom to fit both pickup and delivery points
  useEffect(() => {
    if (from && to) {
      // Calculate bounds to fit both points
      const lats = [from.latitude, to.latitude];
      const lngs = [from.longitude, to.longitude];
      
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      
      // Center point between pickup and delivery
      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;
      
      // Calculate distance to determine zoom level
      const latDiff = maxLat - minLat;
      const lngDiff = maxLng - minLng;
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
      
      // Dynamic zoom based on distance
      let zoom = 10; // Default zoom
      if (distance < 0.01) {
        zoom = 14; // Very close - zoom in
      } else if (distance < 0.1) {
        zoom = 12; // Close - medium zoom
      } else if (distance < 0.5) {
        zoom = 10; // Medium distance
      } else if (distance < 1.0) {
        zoom = 8; // Far - zoom out
      } else {
        zoom = 6; // Very far - zoom out more
      }
      
      setMapCenter([centerLat, centerLng]);
      setMapZoom(zoom);
    }
  }, [from, to]);

  // Update route coordinates when tracking is active
  useEffect(() => {
    if (isTracking && trackingPoints.length > 0) {
      // When tracking is active, show route through tracking points
      const route = [
        [from.latitude, from.longitude],
        ...trackingPoints.map(point => [point.latitude, point.longitude] as [number, number]),
        [to.latitude, to.longitude]
      ];
      setRouteCoordinates(route);
    } else if (routeCalculation) {
      // When not tracking, show the calculated route waypoints
      const coordinates = routeCalculation.waypoints.map(waypoint => [waypoint.lat, waypoint.lng] as [number, number]);
      setRouteCoordinates(coordinates);
    }
  }, [from, to, trackingPoints, isTracking, routeCalculation]);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Use route calculation for distance and duration
  const totalDistance = routeCalculation?.distance || 0;
  const totalDuration = routeCalculation?.duration || 0;
  const routeType = routeCalculation?.routeType || 'road';

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
            zoom={mapZoom}
            style={{ 
              height: '400px', 
              width: '100%', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              subdomains="abcd"
              maxZoom={20}
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

            {/* Current Location Marker (always show if available) */}
            {currentLocation && (
              <Marker 
                position={[currentLocation.lat, currentLocation.lng]} 
                icon={isTracking ? truckIcon : currentLocationIcon}
              >
                <Popup>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600 mb-1">
                      {isTracking ? '🚛 Current Location' : '📍 Shipment Location'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatTime(new Date())}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {isTracking ? 'Live tracking active' : 'Waiting for pickup'}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Route Line - Always show the calculated route */}
            {routeCoordinates.length > 0 && (
              <>
                {/* Route outline for better visibility */}
                <Polyline
                  positions={routeCoordinates}
                  color="white"
                  weight={8}
                  opacity={0.8}
                  lineCap="round"
                  lineJoin="round"
                />
                
                {/* Main route line */}
                <Polyline
                  positions={routeCoordinates}
                  color={isTracking ? "#2563EB" : "#6B7280"}
                  weight={isTracking ? 6 : 4}
                  opacity={isTracking ? 0.9 : 0.7}
                  dashArray={isTracking ? undefined : "15, 10"}
                  lineCap="round"
                  lineJoin="round"
                />
              </>
            )}
          </MapContainer>

          {/* Map Overlay Info */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 text-sm">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Distance:</span>
                <span className="font-medium">{totalDistance} km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Route:</span>
                <span className="font-medium capitalize">{routeType}</span>
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
            <div className="text-sm text-gray-600">{totalDistance} km</div>
            <div className="text-xs text-gray-500">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m • {routeType}</div>
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
