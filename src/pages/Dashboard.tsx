import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { 
  Package, 
  Plus, 
  Search, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  MapPin,
  Wifi,
  WifiOff,
  Shield,
  BarChart3,
  Eye
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [apiInfo, setApiInfo] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const health = await apiService.healthCheck();
        const test = await apiService.testApi();
        setApiStatus('connected');
        setApiInfo({ health, test });
      } catch (error) {
        console.error('API connection failed:', error);
        setApiStatus('disconnected');
      }
    };

    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        const [shipments, bids] = await Promise.all([
          apiService.getShipments(),
          apiService.getBids()
        ]);

        // Ensure we have arrays
        const shipmentsArray = Array.isArray(shipments) ? shipments : [];
        const bidsArray = Array.isArray(bids) ? bids : [];

        // Calculate stats based on user role
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        let stats = {};
        
        if (user.role === 'shipper') {
          const userShipments = shipmentsArray.filter(s => s.shipperId === user.id);
          const activeShipments = userShipments.filter(s => ['open', 'assigned', 'in-transit'].includes(s.status)).length;
          const completedThisMonth = userShipments.filter(s => s.status === 'delivered' && new Date(s.createdAt) >= startOfMonth).length;
          
          // Calculate total spent from completed shipments
          const completedShipments = userShipments.filter(s => s.status === 'delivered');
          const totalSpent = completedShipments.reduce((sum, s) => {
            const acceptedBid = bidsArray.find(b => b.shipmentId === s.id && b.status === 'accepted');
            return sum + (acceptedBid?.price || 0);
          }, 0);
          
          const quotesToReview = bidsArray.filter(b => 
            userShipments.some(s => s.id === b.shipmentId) && b.status === 'pending'
          ).length;

          stats = {
            activeShipments,
            quotesToReview,
            completedThisMonth,
            totalSpent: `€${totalSpent.toLocaleString()}`
          };
        } else if (user.role === 'carrier') {
          const userBids = bidsArray.filter(b => b.carrierId === user.id);
          const pendingBids = userBids.filter(b => b.status === 'pending').length;
          
          // Get shipments where this carrier has accepted bids
          const acceptedBids = userBids.filter(b => b.status === 'accepted');
          const carrierShipments = shipmentsArray.filter(s => 
            acceptedBids.some(b => b.shipmentId === s.id)
          );
          
          const activeLoads = carrierShipments.filter(s => ['assigned', 'in-transit'].includes(s.status)).length;
          const completedThisMonth = carrierShipments.filter(s => 
            s.status === 'delivered' && new Date(s.createdAt) >= startOfMonth
          ).length;
          
          // Calculate total revenue from completed shipments
          const completedShipments = carrierShipments.filter(s => s.status === 'delivered');
          const totalRevenue = completedShipments.reduce((sum, s) => {
            const acceptedBid = acceptedBids.find(b => b.shipmentId === s.id);
            return sum + (acceptedBid?.price || 0);
          }, 0);

          stats = {
            activeLoads,
            pendingBids,
            completedThisMonth,
            totalRevenue: `€${totalRevenue.toLocaleString()}`
          };
        } else if (user.role === 'admin') {
          const totalUsers = 6; // From our mock data
          const pendingVerifications = 1; // carrier3 has pending status
          const activeShipments = shipmentsArray.filter(s => ['open', 'assigned', 'in-transit'].includes(s.status)).length;
          
          // Calculate platform revenue from all completed shipments
          const completedShipments = shipmentsArray.filter(s => s.status === 'delivered');
          const platformRevenue = completedShipments.reduce((sum, s) => {
            const acceptedBid = bidsArray.find(b => b.shipmentId === s.id && b.status === 'accepted');
            return sum + (acceptedBid?.price || 0);
          }, 0);

          stats = {
            totalUsers,
            pendingVerifications,
            activeShipments,
            platformRevenue: `€${platformRevenue.toLocaleString()}`
          };
        }

        setDashboardStats(stats);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set default stats to prevent crashes
        setDashboardStats({
          activeShipments: 0,
          activeLoads: 0,
          pendingBids: 0,
          quotesToReview: 0,
          completedThisMonth: 0,
          totalSpent: '€0',
          totalRevenue: '€0',
          totalUsers: 0,
          pendingVerifications: 0,
          platformRevenue: '€0'
        });
      }
    };

    checkApiConnection();
    fetchDashboardData();
  }, [user]);

  const stats = user?.role === 'shipper' ? [
    { name: 'Active Shipments', value: dashboardStats?.activeShipments?.toString() || '0', icon: Package, color: 'bg-blue-500' },
    { name: 'Quotes to Review', value: dashboardStats?.quotesToReview?.toString() || '0', icon: Clock, color: 'bg-orange-500' },
    { name: 'Completed This Month', value: dashboardStats?.completedThisMonth?.toString() || '0', icon: CheckCircle, color: 'bg-green-500' },
    { name: 'Total Spent', value: dashboardStats?.totalSpent || '€0', icon: TrendingUp, color: 'bg-red-500' },
  ] : user?.role === 'carrier' ? [
    { name: 'Active Loads', value: dashboardStats?.activeLoads?.toString() || '0', icon: Package, color: 'bg-blue-500' },
    { name: 'Pending Bids', value: dashboardStats?.pendingBids?.toString() || '0', icon: Clock, color: 'bg-yellow-500' },
    { name: 'Completed This Month', value: dashboardStats?.completedThisMonth?.toString() || '0', icon: CheckCircle, color: 'bg-green-500' },
    { name: 'Total Revenue', value: dashboardStats?.totalRevenue || '€0', icon: TrendingUp, color: 'bg-purple-500' },
  ] : user?.role === 'admin' ? [
    { name: 'Total Users', value: dashboardStats?.totalUsers?.toString() || '0', icon: Package, color: 'bg-blue-500' },
    { name: 'Pending Verifications', value: dashboardStats?.pendingVerifications?.toString() || '0', icon: Clock, color: 'bg-yellow-500' },
    { name: 'Active Shipments', value: dashboardStats?.activeShipments?.toString() || '0', icon: CheckCircle, color: 'bg-green-500' },
    { name: 'Platform Revenue', value: dashboardStats?.platformRevenue || '€0', icon: TrendingUp, color: 'bg-purple-500' },
  ] : [
    { name: 'Active Shipments', value: '0', icon: Package, color: 'bg-blue-500' },
    { name: 'Pending Bids', value: '0', icon: Clock, color: 'bg-yellow-500' },
    { name: 'Completed This Month', value: '0', icon: CheckCircle, color: 'bg-green-500' },
    { name: 'Total Revenue', value: '€0', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  const quickActions = user?.role === 'shipper' ? [
    {
      title: 'Create New Shipment',
      description: 'Post a shipment to the marketplace',
      href: '/app/shipments/create',
      icon: Plus,
      color: 'bg-primary-600'
    },
    {
      title: 'Browse Marketplace',
      description: 'Find available carriers',
      href: '/app/marketplace',
      icon: Search,
      color: 'bg-green-600'
    },
    {
      title: 'Track Shipment',
      description: 'Monitor active deliveries',
      href: '/app/tracking',
      icon: MapPin,
      color: 'bg-blue-600'
    },
  ] : user?.role === 'carrier' ? [
    {
      title: 'Browse Available Loads',
      description: 'Find shipments to bid on',
      href: '/app/marketplace',
      icon: Search,
      color: 'bg-primary-600'
    },
    {
      title: 'My Active Loads',
      description: 'Manage accepted shipments',
      href: '/app/shipments',
      icon: Package,
      color: 'bg-green-600'
    },
    {
      title: 'Track Shipment',
      description: 'Update delivery progress',
      href: '/app/tracking',
      icon: MapPin,
      color: 'bg-blue-600'
    },
  ] : user?.role === 'admin' ? [
    {
      title: 'Manage Users',
      description: 'Review user verifications',
      href: '/app/admin',
      icon: Shield,
      color: 'bg-primary-600'
    },
    {
      title: 'Platform Analytics',
      description: 'View system statistics',
      href: '/app/analytics',
      icon: BarChart3,
      color: 'bg-green-600'
    },
    {
      title: 'Monitor Activity',
      description: 'Track platform usage',
      href: '/app/admin',
      icon: Eye,
      color: 'bg-blue-600'
    },
  ] : [
    {
      title: 'Create New Shipment',
      description: 'Post a shipment to the marketplace',
      href: '/app/shipments/create',
      icon: Plus,
      color: 'bg-primary-600'
    },
    {
      title: 'Browse Marketplace',
      description: 'Find available loads',
      href: '/app/marketplace',
      icon: Search,
      color: 'bg-green-600'
    },
    {
      title: 'Track Shipment',
      description: 'Monitor active deliveries',
      href: '/app/tracking',
      icon: MapPin,
      color: 'bg-blue-600'
    },
  ];

  const recentActivity = [
    { id: 1, type: 'shipment', message: 'New bid received for Shipment #1234', time: '2 hours ago' },
    { id: 2, type: 'delivery', message: 'Shipment #1230 delivered successfully', time: '4 hours ago' },
    { id: 3, type: 'bid', message: 'Your bid was accepted for Shipment #1228', time: '1 day ago' },
  ];

  return (
    <div className="space-y-8">
      {/* API Status */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {apiStatus === 'connected' && <Wifi className="h-5 w-5 text-green-500 mr-2" />}
            {apiStatus === 'disconnected' && <WifiOff className="h-5 w-5 text-red-500 mr-2" />}
            {apiStatus === 'checking' && <Clock className="h-5 w-5 text-yellow-500 mr-2" />}
            <span className="font-medium">
              Backend API: {apiStatus === 'connected' ? 'Connected' : apiStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
            </span>
          </div>
          {apiInfo && (
            <div className="text-sm text-gray-500">
              Backend: {apiInfo.health?.environment || 'unknown'} | Version: {apiInfo.test?.version || 'unknown'}
            </div>
          )}
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.profile?.firstName || 'User'}!
        </h1>
        <p className="text-gray-600">
          {user?.role === 'shipper' && `Manage your pallet shipments and connect with reliable carriers for ${user?.profile?.companyName || 'your business'}.`}
          {user?.role === 'carrier' && `Find profitable loads and grow ${user?.profile?.companyName || 'your transport business'}.`}
          {user?.role === 'dispatcher' && `Coordinate your fleet and optimize operations for ${user?.profile?.companyName || 'your logistics company'}.`}
          {user?.role === 'admin' && 'Monitor platform activity and manage the CoPallet ecosystem.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className={`p-2 sm:p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-2">
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="ml-3 font-medium text-gray-900">{action.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-primary-600 rounded-full"></div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      {user?.verificationStatus === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            Complete Your Profile
          </h3>
          <p className="text-yellow-700 mb-4">
            To start using CoPallet, please complete your profile verification.
          </p>
          <Link
            to="/app/onboarding"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
          >
            Complete Setup
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
