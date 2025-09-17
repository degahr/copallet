import React, { useState } from 'react';
import { 
  Calculator, 
  Save, 
  TrendingUp, 
  MapPin, 
  Clock, 
  Euro,
  Package,
  Truck,
  Fuel
} from 'lucide-react';

interface ShippingEstimate {
  distance: number;
  pallets: number;
  weightPerPallet: number;
  urgency: 'standard' | 'express' | 'urgent';
  serviceType: 'standard' | 'white_glove' | 'temperature_controlled';
  insuranceValue: number;
}

interface CostBreakdown {
  baseRate: number;
  distanceCost: number;
  weightCost: number;
  urgencyMultiplier: number;
  serviceTypeMultiplier: number;
  insuranceCost: number;
  platformFee: number;
  totalCost: number;
  estimatedSavings: number;
}

const SpendCalculator: React.FC = () => {
  const [estimate, setEstimate] = useState<ShippingEstimate>({
    distance: 200,
    pallets: 1,
    weightPerPallet: 500,
    urgency: 'standard',
    serviceType: 'standard',
    insuranceValue: 1000
  });

  const calculateCosts = (): CostBreakdown => {
    const { distance, pallets, weightPerPallet, urgency, serviceType, insuranceValue } = estimate;
    
    // Base rates (per pallet)
    const baseRatePerPallet = 25;
    const baseRate = baseRatePerPallet * pallets;
    
    // Distance cost (€0.15 per km per pallet)
    const distanceCost = distance * 0.15 * pallets;
    
    // Weight cost (€0.02 per kg)
    const totalWeight = pallets * weightPerPallet;
    const weightCost = totalWeight * 0.02;
    
    // Urgency multipliers
    const urgencyMultipliers = {
      standard: 1.0,
      express: 1.3,
      urgent: 1.6
    };
    const urgencyMultiplier = urgencyMultipliers[urgency];
    
    // Service type multipliers
    const serviceTypeMultipliers = {
      standard: 1.0,
      white_glove: 1.4,
      temperature_controlled: 1.8
    };
    const serviceTypeMultiplier = serviceTypeMultipliers[serviceType];
    
    // Insurance cost (0.5% of value)
    const insuranceCost = insuranceValue * 0.005;
    
    // Platform fee (3% of total)
    const subtotal = (baseRate + distanceCost + weightCost) * urgencyMultiplier * serviceTypeMultiplier + insuranceCost;
    const platformFee = subtotal * 0.03;
    
    const totalCost = subtotal + platformFee;
    
    // Estimated savings vs traditional freight (typically 15-25% savings)
    const estimatedSavings = totalCost * 0.2;

    return {
      baseRate,
      distanceCost,
      weightCost,
      urgencyMultiplier,
      serviceTypeMultiplier,
      insuranceCost,
      platformFee,
      totalCost,
      estimatedSavings
    };
  };

  const updateEstimate = (field: keyof ShippingEstimate, value: any) => {
    setEstimate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const costs = calculateCosts();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Calculator className="h-6 w-6 mr-2 text-primary-600" />
          Shipping Cost Calculator
        </h2>
        <p className="mt-2 text-gray-600">
          Estimate your shipping costs and compare with traditional freight options
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="space-y-6">
          {/* Route Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Route Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance (km)
                </label>
                <input
                  type="number"
                  value={estimate.distance}
                  onChange={(e) => updateEstimate('distance', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Shipment Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Shipment Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Pallets
                </label>
                <input
                  type="number"
                  value={estimate.pallets}
                  onChange={(e) => updateEstimate('pallets', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight per Pallet (kg)
                </label>
                <input
                  type="number"
                  value={estimate.weightPerPallet}
                  onChange={(e) => updateEstimate('weightPerPallet', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level
                </label>
                <select
                  value={estimate.urgency}
                  onChange={(e) => updateEstimate('urgency', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="standard">Standard (3-5 days)</option>
                  <option value="express">Express (1-2 days)</option>
                  <option value="urgent">Urgent (Same day)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  value={estimate.serviceType}
                  onChange={(e) => updateEstimate('serviceType', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="standard">Standard Transport</option>
                  <option value="white_glove">White Glove Service</option>
                  <option value="temperature_controlled">Temperature Controlled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance Value (€)
                </label>
                <input
                  type="number"
                  value={estimate.insuranceValue}
                  onChange={(e) => updateEstimate('insuranceValue', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-6">
          {/* Total Cost */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Euro className="h-5 w-5 mr-2" />
              Cost Estimate
            </h3>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                €{costs.totalCost.toFixed(0)}
              </div>
              <p className="text-sm text-gray-600">Total Estimated Cost</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Rate ({estimate.pallets} pallets)</span>
                <span className="font-medium">€{costs.baseRate.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Distance Cost ({estimate.distance}km)</span>
                <span className="font-medium">€{costs.distanceCost.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight Cost ({estimate.pallets * estimate.weightPerPallet}kg)</span>
                <span className="font-medium">€{costs.weightCost.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Urgency ({estimate.urgency})</span>
                <span className="font-medium">×{costs.urgencyMultiplier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Type ({estimate.serviceType})</span>
                <span className="font-medium">×{costs.serviceTypeMultiplier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Insurance</span>
                <span className="font-medium">€{costs.insuranceCost.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Fee (3%)</span>
                <span className="font-medium">€{costs.platformFee.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Savings Comparison */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Estimated Savings
            </h3>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-green-600 mb-2">
                €{costs.estimatedSavings.toFixed(0)}
              </div>
              <p className="text-sm text-green-700">vs Traditional Freight</p>
            </div>
            
            <div className="text-sm text-green-800 space-y-2">
              <p>• Competitive marketplace pricing</p>
              <p>• No broker fees or hidden costs</p>
              <p>• Transparent pricing upfront</p>
              <p>• Access to verified carriers</p>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Cost Optimization Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Consolidate shipments when possible</li>
              <li>• Plan ahead to avoid urgent delivery fees</li>
              <li>• Consider standard service for non-critical shipments</li>
              <li>• Optimize pallet loading to reduce weight costs</li>
              <li>• Compare multiple carrier quotes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendCalculator;
