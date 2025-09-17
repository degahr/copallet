import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Shipment, Bid, TrackingPoint, POD, Message } from '../types';
import { useAuth } from './AuthContext';
import apiService from '../services/api';

interface ShipmentContextType {
  shipments: Shipment[];
  bids: Bid[];
  trackingPoints: TrackingPoint[];
  pods: POD[];
  messages: Message[];
  loading: boolean;
  createShipment: (shipment: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateShipment: (id: string, updates: Partial<Shipment>) => Promise<void>;
  updateShipmentStatus: (id: string, status: Shipment['status']) => Promise<void>;
  createBid: (bid: Omit<Bid, 'id' | 'createdAt'>) => Promise<void>;
  acceptBid: (bidId: string) => Promise<void>;
  addTrackingPoint: (point: Omit<TrackingPoint, 'id'>) => Promise<void>;
  createPOD: (pod: Omit<POD, 'id'>) => Promise<void>;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
  loadShipments: () => Promise<void>;
}

const ShipmentContext = createContext<ShipmentContextType | undefined>(undefined);

export const useShipment = (): ShipmentContextType => {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error('useShipment must be used within a ShipmentProvider');
  }
  return context;
};

interface ShipmentProviderProps {
  children: ReactNode;
}

export const ShipmentProvider: React.FC<ShipmentProviderProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [trackingPoints, setTrackingPoints] = useState<TrackingPoint[]>([]);
  const [pods, setPods] = useState<POD[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const loadShipments = async () => {
    if (!user) {
      setShipments([]);
      setBids([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await apiService.request('/shipments');
      setShipments(response.shipments || []);
    } catch (error) {
      console.error('Failed to load shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadShipments();
    }
  }, [user, authLoading]);

  const createShipment = async (shipmentData: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await apiService.request('/shipments', {
        method: 'POST',
        body: JSON.stringify(shipmentData),
      });
      
      setShipments(prev => [...prev, response.shipment]);
      return response.shipment;
    } catch (error) {
      console.error('Failed to create shipment:', error);
      throw error;
    }
  };

  const updateShipment = async (id: string, updates: Partial<Shipment>) => {
    try {
      await apiService.request(`/shipments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      setShipments(prev => prev.map(shipment => 
        shipment.id === id ? { ...shipment, ...updates } : shipment
      ));
    } catch (error) {
      console.error('Failed to update shipment:', error);
      throw error;
    }
  };

  const updateShipmentStatus = async (id: string, status: Shipment['status']) => {
    await updateShipment(id, { status });
  };

  const createBid = async (bidData: Omit<Bid, 'id' | 'createdAt'>) => {
    try {
      const response = await apiService.request(`/shipments/${bidData.shipmentId}/bids`, {
        method: 'POST',
        body: JSON.stringify(bidData),
      });
      
      setBids(prev => [...prev, response.bid]);
    } catch (error) {
      console.error('Failed to create bid:', error);
      throw error;
    }
  };

  const acceptBid = async (bidId: string) => {
    try {
      // Find the shipment ID from the bid
      const bid = bids.find(b => b.id === bidId);
      if (!bid) throw new Error('Bid not found');

      await apiService.request(`/shipments/${bid.shipmentId}/bids/${bidId}/accept`, {
        method: 'PUT',
      });
      
      // Update the shipment status
      setShipments(prev => prev.map(shipment => 
        shipment.id === bid.shipmentId 
          ? { ...shipment, status: 'assigned', assignedCarrierId: bid.carrierId }
          : shipment
      ));
      
      // Update bid status
      setBids(prev => prev.map(b => 
        b.id === bidId ? { ...b, status: 'accepted' } : b
      ));
    } catch (error) {
      console.error('Failed to accept bid:', error);
      throw error;
    }
  };

  const addTrackingPoint = async (point: Omit<TrackingPoint, 'id'>) => {
    try {
      const response = await apiService.request(`/shipments/${point.shipmentId}/tracking`, {
        method: 'POST',
        body: JSON.stringify(point),
      });
      
      setTrackingPoints(prev => [...prev, response.trackingPoint]);
    } catch (error) {
      console.error('Failed to add tracking point:', error);
      throw error;
    }
  };

  const createPOD = async (podData: Omit<POD, 'id'>) => {
    try {
      const response = await apiService.request(`/shipments/${podData.shipmentId}/pod`, {
        method: 'POST',
        body: JSON.stringify(podData),
      });
      
      setPods(prev => [...prev, response.pod]);
    } catch (error) {
      console.error('Failed to create POD:', error);
      throw error;
    }
  };

  const sendMessage = async (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    try {
      const response = await apiService.request(`/shipments/${messageData.shipmentId}/messages`, {
        method: 'POST',
        body: JSON.stringify(messageData),
      });
      
      setMessages(prev => [...prev, response.message]);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  const value: ShipmentContextType = {
    shipments,
    bids,
    trackingPoints,
    pods,
    messages,
    loading,
    createShipment,
    updateShipment,
    updateShipmentStatus,
    createBid,
    acceptBid,
    addTrackingPoint,
    createPOD,
    sendMessage,
    loadShipments,
  };

  return (
    <ShipmentContext.Provider value={value}>
      {children}
    </ShipmentContext.Provider>
  );
};