import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Plus, 
  Search, 
  User,
  Truck,
  Shield,
  Zap,
  BarChart3,
  Star,
  FileText,
  Calculator,
  Building,
  Users,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navigation = user?.role === 'shipper' ? [
    { name: 'Dashboard', href: '/app/dashboard', icon: Home },
    { name: 'My Shipments', href: '/app/shipments', icon: Package },
    { name: 'Create Shipment', href: '/app/shipments/create', icon: Plus },
    { name: 'Marketplace', href: '/app/marketplace', icon: Search },
    { name: 'Templates', href: '/app/templates', icon: FileText },
    { name: 'Analytics', href: '/app/analytics', icon: BarChart3 },
    { name: 'Company Profile', href: '/app/shipper-profile', icon: Building },
    { name: 'Profile', href: '/app/profile', icon: User },
  ] : user?.role === 'carrier' ? [
    { name: 'Dashboard', href: '/app/dashboard', icon: Home },
    { name: 'Browse Loads', href: '/app/marketplace', icon: Truck },
    { name: 'My Loads', href: '/app/shipments', icon: Package },
    { name: 'Verification', href: '/app/verification', icon: Shield },
    { name: 'Cost Model', href: '/app/costmodel', icon: Calculator },
    { name: 'Auto-Bid Rules', href: '/app/autobid', icon: Zap },
    { name: 'My Ratings', href: '/app/rating', icon: Star },
    { name: 'Profile', href: '/app/profile', icon: User },
  ] : user?.role === 'admin' ? [
    { name: 'Dashboard', href: '/app/dashboard', icon: Home },
    { name: 'Admin Panel', href: '/app/admin', icon: Shield },
    { name: 'User Management', href: '/app/admin/users', icon: Users },
    { name: 'Shipment Management', href: '/app/admin/shipments', icon: Package },
    { name: 'Analytics', href: '/app/admin/analytics', icon: BarChart3 },
    { name: 'Blog Management', href: '/app/admin/blog', icon: BookOpen },
    { name: 'Profile', href: '/app/profile', icon: User },
  ] : [
    { name: 'Dashboard', href: '/app/dashboard', icon: Home },
    { name: 'My Shipments', href: '/app/shipments', icon: Package },
    { name: 'Create Shipment', href: '/app/shipments/create', icon: Plus },
    { name: 'Marketplace', href: '/app/marketplace', icon: Search },
    { name: 'Profile', href: '/app/profile', icon: User },
  ];

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="flex items-center justify-center h-16 px-4 bg-primary-600">
        <Link to="/app/dashboard" className="flex items-center space-x-2">
          <img 
            src={logo} 
            alt="CoPallet Logo" 
            className="h-8 w-auto"
          />
          <h1 className="text-xl font-bold text-white">CoPallet</h1>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.profile?.firstName?.[0] || user?.email?.[0]?.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">
              {user?.profile?.firstName} {user?.profile?.lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
