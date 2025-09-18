import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TrackingPoint } from '../types';
import { apiService } from '../services/api';

interface TrackingContextType {
  activeTrackings: Set<string>;
  trackingData: Map<string, {
    points: TrackingPoint[];
    currentLocation?: { lat: number; lng: number };
    isLive: boolean;
  }>;
  startTracking: (shipmentId: string) => Promise<void>;
  stopTracking: (shipmentId: string) => void;
  getTrackingData: (shipmentId: string) => {
    points: TrackingPoint[];
    currentLocation?: { lat: number; lng: number };
    isLive: boolean;
  };
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

interface TrackingProviderProps {
  children: ReactNode;
}

export const TrackingProvider: React.FC<TrackingProviderProps> = ({ children }) => {
  const [activeTrackings, setActiveTrackings] = useState<Set<string>>(new Set());
  const [trackingData, setTrackingData] = useState<Map<string, {
    points: TrackingPoint[];
    currentLocation?: { lat: number; lng: number };
    isLive: boolean;
  }>>(new Map());

  // Global tracking intervals
  const trackingIntervals = new Map<string, NodeJS.Timeout>();

  const startTracking = async (shipmentId: string) => {
    if (activeTrackings.has(shipmentId)) return;

    try {
      // Initialize tracking data
      const response = await apiService.getTrackingPoints(shipmentId);
      setTrackingData(prev => new Map(prev.set(shipmentId, {
        points: response.trackingPoints || [],
        isLive: true
      })));

      setActiveTrackings(prev => new Set(prev.add(shipmentId)));

      // Start simulation interval
      let progress = 0;
      const totalSteps = 20;
      
      const interval = setInterval(async () => {
        try {
          progress += 1;
          
          // Get shipment data for route calculation
          const shipmentResponse = await apiService.getShipment(shipmentId);
          const shipment = shipmentResponse.shipment;
          
          // Calculate position along route
          const fromLat = shipment.from.latitude || 52.3676;
          const fromLng = shipment.from.longitude || 4.9041;
          const toLat = shipment.to.latitude || 52.3676;
          const toLng = shipment.to.longitude || 4.9041;
          
          const t = Math.min(progress / totalSteps, 1);
          const mockLocation = {
            lat: fromLat + (toLat - fromLat) * t + (Math.random() - 0.5) * 0.005,
            lng: fromLng + (toLng - fromLng) * t + (Math.random() - 0.5) * 0.005
          };
          
          // Add tracking point
          await apiService.addTrackingPoint(shipmentId, {
            latitude: mockLocation.lat,
            longitude: mockLocation.lng,
            accuracy: Math.random() * 10 + 3,
            speed: Math.random() * 40 + 50,
            heading: Math.random() * 30 + 45
          });

          // Update tracking data
          const trackingResponse = await apiService.getTrackingPoints(shipmentId);
          setTrackingData(prev => new Map(prev.set(shipmentId, {
            points: trackingResponse.trackingPoints || [],
            currentLocation: mockLocation,
            isLive: true
          })));

          // Stop tracking when route is complete
          if (progress >= totalSteps) {
            stopTracking(shipmentId);
          }
        } catch (err) {
          console.error('Error in tracking simulation:', err);
        }
      }, 5000);

      trackingIntervals.set(shipmentId, interval);
    } catch (err) {
      console.error('Error starting tracking:', err);
    }
  };

  const stopTracking = (shipmentId: string) => {
    const interval = trackingIntervals.get(shipmentId);
    if (interval) {
      clearInterval(interval);
      trackingIntervals.delete(shipmentId);
    }

    setActiveTrackings(prev => {
      const newSet = new Set(prev);
      newSet.delete(shipmentId);
      return newSet;
    });

    setTrackingData(prev => {
      const newMap = new Map(prev);
      const data = newMap.get(shipmentId);
      if (data) {
        newMap.set(shipmentId, { ...data, isLive: false });
      }
      return newMap;
    });
  };

  const getTrackingData = (shipmentId: string) => {
    return trackingData.get(shipmentId) || {
      points: [],
      isLive: false
    };
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      trackingIntervals.forEach(interval => clearInterval(interval));
    };
  }, []);

  const value: TrackingContextType = {
    activeTrackings,
    trackingData,
    startTracking,
    stopTracking,
    getTrackingData
  };

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = (): TrackingContextType => {
  const context = useContext(TrackingContext);
  if (context === undefined) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};
