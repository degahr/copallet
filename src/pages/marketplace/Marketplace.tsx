import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ShipperMarketplace from '../../components/ShipperMarketplace';
import CarrierMarketplace from '../../components/CarrierMarketplace';

const Marketplace: React.FC = () => {
  const { user } = useAuth();

  // Show shipper-focused marketplace for shippers
  if (user?.role === 'shipper') {
    return <ShipperMarketplace />;
  }

  // Keep the original carrier marketplace for carriers
  return <CarrierMarketplace />;
};

export default Marketplace;