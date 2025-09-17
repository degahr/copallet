import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useShipment } from '../../contexts/ShipmentContext';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Package, 
  Shield, 
  CheckCircle, 
  Clock,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  BookOpen,
  ArrowRight
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { shipments } = useShipment();

  // Mock users data for overview
  const users = [
    { id: '1', role: 'shipper', verificationStatus: 'approved', rating: 4.8 },
    { id: '2', role: 'carrier', verificationStatus: 'pending', rating: 4.5 },
    { id: '3', role: 'dispatcher', verificationStatus: 'approved', rating: 4.9 },
    { id: '4', role: 'shipper', verificationStatus: 'rejected', rating: 3.2 },
    { id: '5', role: 'carrier', verificationStatus: 'pending', rating: 4.7 }
  ];

  const analytics = {
    totalUsers: users.length,
    verifiedUsers: users.filter(u => u.verificationStatus === 'approved').length,
    pendingVerifications: users.filter(u => u.verificationStatus === 'pending').length,
    totalShipments: shipments.length,
    activeShipments: shipments.filter(s => ['open', 'assigned', 'in-transit'].includes(s.status)).length,
    completedShipments: shipments.filter(s => s.status === 'delivered').length,
    totalValue: shipments.reduce((sum, s) => sum + (s.priceGuidance?.max || 0), 0)
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600">Platform overview and management tools</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Shipments</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.totalShipments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.pendingVerifications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Platform Value</p>
              <p className="text-lg font-semibold text-gray-900">€{analytics.totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/app/admin/users"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <p className="text-sm text-gray-600">Manage users and verifications</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          </div>
        </Link>

        <Link
          to="/app/admin/shipments"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Shipment Management</h3>
                <p className="text-sm text-gray-600">Monitor all shipments</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          </div>
        </Link>

        <Link
          to="/app/admin/analytics"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">Platform insights and reports</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          </div>
        </Link>

        <Link
          to="/app/admin/blog"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Blog Management</h3>
                <p className="text-sm text-gray-600">Manage blog content</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          </div>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{analytics.verifiedUsers}</div>
            <div className="text-sm text-gray-600">Verified Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{analytics.activeShipments}</div>
            <div className="text-sm text-gray-600">Active Shipments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{analytics.completedShipments}</div>
            <div className="text-sm text-gray-600">Completed Shipments</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
