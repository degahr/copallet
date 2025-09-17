import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, LogOut } from 'lucide-react';
import NotificationCenter from '../NotificationCenter';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.profile?.firstName || 'User'}!
          </h2>
          <p className="text-sm text-gray-600">
            {user?.role === 'shipper' && 'Manage your shipments and find carriers'}
            {user?.role === 'carrier' && 'Find loads and manage your deliveries'}
            {user?.role === 'dispatcher' && 'Coordinate your fleet operations'}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <NotificationCenter />
          
          <button
            onClick={logout}
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
