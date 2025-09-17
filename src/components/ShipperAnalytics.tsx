import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Clock, 
  Star,
  MapPin,
  Calendar,
  Download,
  Filter,
  Search,
  Truck
} from 'lucide-react';

interface ShipperAnalyticsProps {
  dateRange?: '7d' | '30d' | '90d' | '1y';
}

const ShipperAnalytics: React.FC<ShipperAnalyticsProps> = ({ dateRange: propDateRange }) => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>(propDateRange || '30d');
  const [shipments, setShipments] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const [shipmentsData, bidsData] = await Promise.all([
          apiService.getShipments(),
          apiService.getBids()
        ]);
        
        setShipments(Array.isArray(shipmentsData) ? shipmentsData : []);
        setBids(Array.isArray(bidsData) ? bidsData : []);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const analytics = useMemo(() => {
    if (!user) return null;

    // Filter shipments by shipper and date range
    const now = new Date();
    const daysAgo = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }[dateRange];

    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const userShipments = shipments.filter(s => 
      s.shipperId === user.id && new Date(s.createdAt) >= cutoffDate
    );

    // Get completed shipments with accepted bids
    const completedShipments = userShipments.filter(s => s.status === 'delivered');
    const completedWithBids = completedShipments.map(shipment => {
      const acceptedBid = bids.find(b => 
        b.shipmentId === shipment.id && b.status === 'accepted'
      );
      return { ...shipment, acceptedBid };
    }).filter(s => s.acceptedBid);

    // Cost Analytics
    const totalSpent = completedWithBids.reduce((sum, s) => sum + (s.acceptedBid?.price || 0), 0);
    const avgCostPerShipment = completedWithBids.length > 0 ? totalSpent / completedWithBids.length : 0;
    
    // Calculate savings (assuming 20% savings vs traditional freight)
    const estimatedTraditionalCost = totalSpent * 1.25; // Traditional freight is 25% more expensive
    const totalSavings = estimatedTraditionalCost - totalSpent;
    const savingsPercentage = estimatedTraditionalCost > 0 ? (totalSavings / estimatedTraditionalCost) * 100 : 0;

    // Carrier Performance
    const carrierPerformance = completedWithBids.reduce((acc, shipment) => {
      const carrierId = shipment.acceptedBid?.carrierId;
      if (!carrierId) return acc;
      
      if (!acc[carrierId]) {
        acc[carrierId] = {
          carrierName: shipment.acceptedBid?.carrierName || 'Unknown Carrier',
          shipments: 0,
          totalSpent: 0,
          avgCost: 0,
          onTimeDeliveries: 0,
          ratings: []
        };
      }
      
      acc[carrierId].shipments++;
      acc[carrierId].totalSpent += shipment.acceptedBid?.price || 0;
      acc[carrierId].avgCost = acc[carrierId].totalSpent / acc[carrierId].shipments;
      
      // Assume 90% on-time delivery for demo
      if (Math.random() > 0.1) {
        acc[carrierId].onTimeDeliveries++;
      }
      
      // Mock ratings (4-5 stars)
      acc[carrierId].ratings.push(4 + Math.random());
      
      return acc;
    }, {} as Record<string, any>);

    // Route Analysis
    const routeAnalysis = completedWithBids.reduce((acc, shipment) => {
      const route = `${shipment.from?.city || 'Unknown'} → ${shipment.to?.city || 'Unknown'}`;
      if (!acc[route]) {
        acc[route] = {
          count: 0,
          totalCost: 0,
          avgCost: 0,
          totalSavings: 0
        };
      }
      
      acc[route].count++;
      acc[route].totalCost += shipment.acceptedBid?.price || 0;
      acc[route].avgCost = acc[route].totalCost / acc[route].count;
      acc[route].totalSavings += (shipment.acceptedBid?.price || 0) * 0.2; // 20% savings
      
      return acc;
    }, {} as Record<string, any>);

    // Monthly Trends (mock data for demo)
    const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthShipments = completedWithBids.filter(s => {
        const shipmentDate = new Date(s.createdAt);
        return shipmentDate.getFullYear() === month.getFullYear() && 
               shipmentDate.getMonth() === month.getMonth();
      });
      
      const monthSpent = monthShipments.reduce((sum, s) => sum + (s.acceptedBid?.price || 0), 0);
      const monthSavings = monthSpent * 0.2;
      
      return {
        month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        spent: monthSpent,
        savings: monthSavings,
        shipments: monthShipments.length
      };
    }).reverse();

    return {
      totalShipments: userShipments.length,
      completedShipments: completedWithBids.length,
      totalSpent,
      avgCostPerShipment,
      totalSavings,
      savingsPercentage,
      carrierPerformance,
      routeAnalysis,
      monthlyTrends
    };
  }, [user, shipments, bids, dateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shipping Analytics</h2>
          <p className="text-gray-600">Track your shipping costs, savings, and carrier performance</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-semibold text-gray-900">€{analytics.totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Savings</p>
              <p className="text-2xl font-semibold text-green-600">€{analytics.totalSavings.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Cost/Shipment</p>
              <p className="text-2xl font-semibold text-gray-900">€{analytics.avgCostPerShipment.toFixed(0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Savings Rate</p>
              <p className="text-2xl font-semibold text-orange-600">{analytics.savingsPercentage.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending Trends</h3>
        <div className="space-y-4">
          {analytics.monthlyTrends.map((trend, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-900">{trend.month}</div>
                <div className="text-sm text-gray-600">{trend.shipments} shipments</div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">€{trend.spent.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Spent</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">€{trend.savings.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Saved</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carrier Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Carriers by Performance</h3>
        <div className="space-y-4">
          {Object.entries(analytics.carrierPerformance)
            .sort(([,a], [,b]) => b.shipments - a.shipments)
            .slice(0, 5)
            .map(([carrierId, carrier]) => {
              const avgRating = carrier.ratings.reduce((sum: number, rating: number) => sum + rating, 0) / carrier.ratings.length;
              const onTimeRate = (carrier.onTimeDeliveries / carrier.shipments) * 100;
              
              return (
                <div key={carrierId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Truck className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{carrier.carrierName}</div>
                      <div className="text-sm text-gray-600">{carrier.shipments} shipments</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">€{carrier.avgCost.toFixed(0)}</div>
                      <div className="text-xs text-gray-500">Avg Cost</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{onTimeRate.toFixed(0)}%</div>
                      <div className="text-xs text-gray-500">On Time</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-900">{avgRating.toFixed(1)}</span>
                      </div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Route Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Used Routes</h3>
        <div className="space-y-4">
          {Object.entries(analytics.routeAnalysis)
            .sort(([,a], [,b]) => b.count - a.count)
            .slice(0, 5)
            .map(([route, data]) => (
              <div key={route} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">{route}</div>
                    <div className="text-sm text-gray-600">{data.count} shipments</div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">€{data.avgCost.toFixed(0)}</div>
                    <div className="text-xs text-gray-500">Avg Cost</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">€{data.totalSavings.toFixed(0)}</div>
                    <div className="text-xs text-gray-500">Total Saved</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ShipperAnalytics;
