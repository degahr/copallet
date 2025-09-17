import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ShipperAnalytics from '../../components/ShipperAnalytics';
import CarrierAnalytics from '../../components/CarrierAnalytics';

const ShipmentAnalytics: React.FC = () => {
  const { user } = useAuth();

  // Show shipper-specific analytics for shippers
  if (user?.role === 'shipper') {
    return <ShipperAnalytics />;
  }

  // Keep the original analytics for carriers and admins
  return <CarrierAnalytics />;
};

export default ShipmentAnalytics;