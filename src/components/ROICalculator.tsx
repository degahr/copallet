import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CarrierCostModel, ROIMetrics } from '../types';
import { 
  Calculator, 
  Save, 
  TrendingUp, 
  Fuel, 
  Clock, 
  Euro,
  Settings
} from 'lucide-react';

const ROICalculator: React.FC = () => {
  const { user } = useAuth();
  const [costModel, setCostModel] = useState<CarrierCostModel>({
    id: '',
    carrierId: user?.id || '',
    costPerKm: 0.8,
    driverCostPerHour: 25,
    loadTimeMinutes: 30,
    unloadTimeMinutes: 30,
    averageSpeedKmh: 60,
    platformFeePercentage: 5
  });

  const [testScenario, setTestScenario] = useState({
    distance: 200,
    deadheadKm: 50,
    bidPrice: 500
  });

  const calculateROI = (): ROIMetrics => {
    const { distance, deadheadKm, bidPrice } = testScenario;
    const { costPerKm, driverCostPerHour, loadTimeMinutes, unloadTimeMinutes, averageSpeedKmh, platformFeePercentage } = costModel;
    
    const totalKm = distance + deadheadKm;
    const timeEstimate = totalKm / averageSpeedKmh + (loadTimeMinutes + unloadTimeMinutes) / 60;
    const variableCost = totalKm * costPerKm + timeEstimate * driverCostPerHour;
    const platformFee = bidPrice * (platformFeePercentage / 100);
    const profit = bidPrice - variableCost - platformFee;
    const roiPercentage = profit > 0 ? (profit / variableCost) * 100 : 0;

    return {
      routeKm: distance,
      deadheadKm,
      timeEstimate,
      variableCost,
      platformFee,
      profit,
      roiPercentage
    };
  };

  const updateCostModel = (field: keyof CarrierCostModel, value: number) => {
    setCostModel(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateTestScenario = (field: keyof typeof testScenario, value: number) => {
    setTestScenario(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const roi = calculateROI();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ROI Calculator</h1>
          <p className="mt-2 text-gray-600">
            Configure your cost model and calculate profitability for different scenarios
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
          <Save className="h-4 w-4 mr-2" />
          Save Cost Model
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Model Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Your Cost Model
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost per Kilometer (€)
              </label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={costModel.costPerKm}
                  onChange={(e) => updateCostModel('costPerKm', parseFloat(e.target.value) || 0)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Includes fuel, maintenance, insurance</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver Cost per Hour (€)
              </label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={costModel.driverCostPerHour}
                  onChange={(e) => updateCostModel('driverCostPerHour', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Load Time (minutes)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={costModel.loadTimeMinutes}
                    onChange={(e) => updateCostModel('loadTimeMinutes', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unload Time (minutes)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={costModel.unloadTimeMinutes}
                    onChange={(e) => updateCostModel('unloadTimeMinutes', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Average Speed (km/h)
              </label>
              <div className="relative">
                <Fuel className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={costModel.averageSpeedKmh}
                  onChange={(e) => updateCostModel('averageSpeedKmh', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform Fee (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="20"
                className="px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={costModel.platformFeePercentage}
                onChange={(e) => updateCostModel('platformFeePercentage', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">CoPallet's commission fee</p>
            </div>
          </div>
        </div>

        {/* Test Scenario & Results */}
        <div className="space-y-6">
          {/* Test Scenario */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Test Scenario
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Route Distance (km)
                </label>
                <input
                  type="number"
                  min="1"
                  className="px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={testScenario.distance}
                  onChange={(e) => updateTestScenario('distance', parseInt(e.target.value) || 1)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadhead Distance (km)
                </label>
                <input
                  type="number"
                  min="0"
                  className="px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={testScenario.deadheadKm}
                  onChange={(e) => updateTestScenario('deadheadKm', parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-gray-500 mt-1">Distance to pickup location</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bid Price (€)
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={testScenario.bidPrice}
                    onChange={(e) => updateTestScenario('bidPrice', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ROI Results */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              ROI Analysis
            </h2>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${roi.roiPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {roi.roiPercentage > 0 ? '+' : ''}{roi.roiPercentage.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600">Return on Investment</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-gray-600">Total Distance</div>
                  <div className="font-semibold text-gray-900">{roi.routeKm + roi.deadheadKm}km</div>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-gray-600">Time Estimate</div>
                  <div className="font-semibold text-gray-900">{roi.timeEstimate.toFixed(1)}h</div>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-gray-600">Variable Cost</div>
                  <div className="font-semibold text-gray-900">€{roi.variableCost.toFixed(0)}</div>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-gray-600">Platform Fee</div>
                  <div className="font-semibold text-gray-900">€{roi.platformFee.toFixed(0)}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">Net Profit</span>
                  <span className={`text-xl font-bold ${roi.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    €{roi.profit.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Profitability Indicator */}
              <div className={`rounded-lg p-4 text-center ${
                roi.roiPercentage > 20 ? 'bg-green-50 text-green-800' :
                roi.roiPercentage > 10 ? 'bg-yellow-50 text-yellow-800' :
                roi.roiPercentage > 0 ? 'bg-orange-50 text-orange-800' :
                'bg-red-50 text-red-800'
              }`}>
                {roi.roiPercentage > 20 ? 'Excellent Profitability' :
                 roi.roiPercentage > 10 ? 'Good Profitability' :
                 roi.roiPercentage > 0 ? 'Low Profitability' :
                 'Not Profitable'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Tips for Better ROI</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Minimize deadhead distance by planning return loads</li>
          <li>• Consider fuel efficiency and maintenance costs in your per-km rate</li>
          <li>• Factor in driver overtime costs for longer routes</li>
          <li>• Account for loading/unloading time in your calculations</li>
          <li>• Regularly update your cost model based on actual expenses</li>
        </ul>
      </div>
    </div>
  );
};

export default ROICalculator;
