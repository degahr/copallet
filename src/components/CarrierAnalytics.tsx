import React, { useState, useMemo } from 'react';
import { useShipment } from '../contexts/ShipmentContext';
import { 
  MapPin, 
  Package, 
  Euro,
  Clock,
  CheckCircle,
  Download
} from 'lucide-react';

const CarrierAnalytics: React.FC = () => {
  const { shipments } = useShipment();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const filteredShipments = useMemo(() => {
    let filtered = shipments;

    // Filter by date range
    const now = new Date();
    const daysAgo = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }[dateRange];

    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    filtered = filtered.filter(shipment => shipment.createdAt >= cutoffDate);

    return filtered;
  }, [shipments, dateRange]);

  const analytics = useMemo(() => {
    const total = filteredShipments.length;
    const completed = filteredShipments.filter(s => s.status === 'delivered').length;
    const inProgress = filteredShipments.filter(s => ['assigned', 'in-transit'].includes(s.status)).length;
    const cancelled = filteredShipments.filter(s => s.status === 'cancelled').length;
    
    const totalValue = filteredShipments.reduce((sum, s) => sum + (s.priceGuidance?.max || 0), 0);
    const avgValue = total > 0 ? totalValue / total : 0;
    
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    const cancellationRate = total > 0 ? (cancelled / total) * 100 : 0;

    // Status distribution
    const statusDistribution = {
      draft: filteredShipments.filter(s => s.status === 'draft').length,
      open: filteredShipments.filter(s => s.status === 'open').length,
      assigned: filteredShipments.filter(s => s.status === 'assigned').length,
      'in-transit': filteredShipments.filter(s => s.status === 'in-transit').length,
      delivered: filteredShipments.filter(s => s.status === 'delivered').length,
      cancelled: filteredShipments.filter(s => s.status === 'cancelled').length
    };

    // Route analysis
    const routeAnalysis = filteredShipments.reduce((acc, shipment) => {
      const route = `${shipment.from?.city || 'Unknown'} → ${shipment.to?.city || 'Unknown'}`;
      if (!acc[route]) {
        acc[route] = { count: 0, totalValue: 0, avgValue: 0 };
      }
      acc[route].count++;
      acc[route].totalValue += shipment.priceGuidance?.max || 0;
      acc[route].avgValue = acc[route].totalValue / acc[route].count;
      return acc;
    }, {} as Record<string, { count: number; totalValue: number; avgValue: number }>);

    return {
      total,
      completed,
      inProgress,
      cancelled,
      totalValue,
      avgValue,
      completionRate,
      cancellationRate,
      statusDistribution,
      routeAnalysis
    };
  }, [filteredShipments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shipment Analytics</h2>
          <p className="text-gray-600">Track shipment performance and market trends</p>
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
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Shipments</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Euro className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Value</p>
              <p className="text-2xl font-semibold text-gray-900">€{analytics.avgValue.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(analytics.statusDistribution).map(([status, count]) => (
            <div key={status} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 capitalize">{status.replace('-', ' ')}</span>
                <span className="text-lg font-semibold text-gray-900">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Route Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Routes</h3>
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
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">€{data.avgValue.toFixed(0)}</div>
                  <div className="text-xs text-gray-500">Avg Value</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CarrierAnalytics;
