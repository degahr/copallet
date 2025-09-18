import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, LogOut, Menu } from 'lucide-react';
import NotificationCenter from '../NotificationCenter';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16">
      <div className="flex items-center justify-between px-4 sm:px-6 h-full">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Company Branding */}
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.profile?.companyName?.[0] || user?.profile?.firstName?.[0] || 'C'}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {user?.profile?.companyName || 'CoPallet'}
              </h2>
              <p className="text-xs text-gray-500">
                {user?.role === 'shipper' && 'Shipment Management'}
                {user?.role === 'carrier' && 'Transport Services'}
                {user?.role === 'dispatcher' && 'Fleet Operations'}
                {user?.role === 'admin' && 'Platform Administration'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* User Info - Hidden on small screens */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.profile?.firstName} {user?.profile?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role}
              </p>
            </div>
            <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.profile?.firstName?.[0] || user?.email?.[0]?.toUpperCase()}
              </span>
            </div>
          </div>
          
          {/* User Avatar - Visible on small screens */}
          <div className="sm:hidden h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user?.profile?.firstName?.[0] || user?.email?.[0]?.toUpperCase()}
            </span>
          </div>
          
          <NotificationCenter />
          
          <button
            onClick={logout}
            className="flex items-center px-2 sm:px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
