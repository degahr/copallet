import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useShipment } from '../../contexts/ShipmentContext';
import { 
  TrendingUp, 
  Users, 
  Package, 
  Euro,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  Download,
  Calendar,
  MapPin,
  Truck
} from 'lucide-react';

const AnalyticsManagement: React.FC = () => {
  const { user } = useAuth();
  const { shipments } = useShipment();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock users data for analytics
  const users = [
    { id: '1', role: 'shipper', verificationStatus: 'approved', createdAt: new Date('2024-01-15'), rating: 4.8 },
    { id: '2', role: 'carrier', verificationStatus: 'pending', createdAt: new Date('2024-01-20'), rating: 4.5 },
    { id: '3', role: 'dispatcher', verificationStatus: 'approved', createdAt: new Date('2024-01-10'), rating: 4.9 },
    { id: '4', role: 'shipper', verificationStatus: 'rejected', createdAt: new Date('2024-01-25'), rating: 3.2 },
    { id: '5', role: 'carrier', verificationStatus: 'pending', createdAt: new Date('2024-01-28'), rating: 4.7 }
  ];

  const filteredData = (() => {
    const now = new Date();
    const daysAgo = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }[dateRange];

    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    return {
      shipments: shipments.filter(s => new Date(s.createdAt) >= cutoffDate),
      users: users.filter(u => new Date(u.createdAt) >= cutoffDate)
    };
  })();

  const analytics = {
    // User Analytics
    totalUsers: users.length,
    newUsers: filteredData.users.length,
    verifiedUsers: users.filter(u => u.verificationStatus === 'approved').length,
    pendingVerifications: users.filter(u => u.verificationStatus === 'pending').length,
    averageRating: users.reduce((sum, u) => sum + u.rating, 0) / users.length,
    
    // Shipment Analytics
    totalShipments: shipments.length,
    newShipments: filteredData.shipments.length,
    activeShipments: shipments.filter(s => ['open', 'assigned', 'in-transit'].includes(s.status)).length,
    completedShipments: shipments.filter(s => s.status === 'delivered').length,
    cancelledShipments: shipments.filter(s => s.status === 'cancelled').length,
    
    // Financial Analytics
    totalValue: shipments.reduce((sum, s) => sum + (s.priceGuidance?.max || 0), 0),
    averageValue: shipments.length > 0 ? shipments.reduce((sum, s) => sum + (s.priceGuidance?.max || 0), 0) / shipments.length : 0,
    completedValue: shipments.filter(s => s.status === 'delivered').reduce((sum, s) => sum + (s.priceGuidance?.max || 0), 0),
    
    // Performance Metrics
    completionRate: shipments.length > 0 ? (shipments.filter(s => s.status === 'delivered').length / shipments.length) * 100 : 0,
    cancellationRate: shipments.length > 0 ? (shipments.filter(s => s.status === 'cancelled').length / shipments.length) * 100 : 0,
    averageDeliveryTime: 2.5, // Mock data - would be calculated from actual delivery times
  };

  const topRoutes = (() => {
    const routeCounts = shipments.reduce((acc, shipment) => {
      const route = `${shipment.from.city} → ${shipment.to.city}`;
      acc[route] = (acc[route] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(routeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([route, count]) => ({ route, count }));
  })();

  const userGrowthData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2024, i, 1);
    const monthUsers = users.filter(u => {
      const userDate = new Date(u.createdAt);
      return userDate.getFullYear() === month.getFullYear() && 
             userDate.getMonth() === month.getMonth();
    }).length;
    
    return {
      month: month.toLocaleDateString('en-US', { month: 'short' }),
      users: monthUsers
    };
  });

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access platform analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Platform Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into platform performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as '7d' | '30d' | '90d' | '1y')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
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
              <p className="text-xs text-green-600">+{analytics.newUsers} this period</p>
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
              <p className="text-xs text-green-600">+{analytics.newShipments} this period</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Euro className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900">€{analytics.totalValue.toLocaleString()}</p>
              <p className="text-xs text-gray-500">€{analytics.averageValue.toFixed(0)} avg</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.completionRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">{analytics.averageDeliveryTime} days avg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Analytics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Analytics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm text-gray-600">Verified Users</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{analytics.verifiedUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-sm text-gray-600">Pending Verifications</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{analytics.pendingVerifications}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm text-gray-600">Average Rating</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{analytics.averageRating.toFixed(1)}/5.0</span>
            </div>
          </div>
        </div>

        {/* Shipment Analytics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipment Analytics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-sm text-gray-600">Active Shipments</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{analytics.activeShipments}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{analytics.completedShipments}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm text-gray-600">Cancelled</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{analytics.cancelledShipments}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Routes */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Routes</h3>
        <div className="space-y-3">
          {topRoutes.map((route, index) => (
            <div key={route.route} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">{route.route}</span>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900">{route.count} shipments</span>
            </div>
          ))}
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth (2024)</h3>
        <div className="grid grid-cols-12 gap-2">
          {userGrowthData.map((data, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-500 mb-1">{data.month}</div>
              <div className="bg-blue-100 rounded-t" style={{ height: `${(data.users / Math.max(...userGrowthData.map(d => d.users))) * 100}px` }}>
                <div className="text-xs text-blue-600 font-semibold pt-1">{data.users}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Export User Data</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <BarChart3 className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Generate Reports</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Calendar className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Schedule Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsManagement;
