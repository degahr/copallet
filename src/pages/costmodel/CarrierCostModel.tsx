import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CarrierCostModel } from '../../types';
import { 
  Calculator, 
  Save, 
  Euro, 
  Clock, 
  Truck, 
  Settings,
  TrendingUp,
  MapPin,
  Fuel,
  User
} from 'lucide-react';

const CarrierCostModelPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [costModel, setCostModel] = useState<CarrierCostModel>({
    id: '1',
    carrierId: user?.id || '',
    costPerKm: 0.45,
    driverCostPerHr: 25.00,
    loadTimeMin: 30,
    unloadTimeMin: 30,
    avgSpeedKmh: 80,
    platformFeePercent: 8.5,
    fuelCostPerKm: 0.12,
    maintenanceCostPerKm: 0.08,
    insuranceCostPerKm: 0.05,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [previewCalculation, setPreviewCalculation] = useState({
    distance: 100,
    duration: 1.5,
    totalCost: 0,
    platformFee: 0,
    netProfit: 0
  });

  const calculatePreview = () => {
    const { costPerKm, driverCostPerHr, loadTimeMin, unloadTimeMin, platformFeePercent } = costModel;
    const { distance, duration } = previewCalculation;
    
    const fuelCost = distance * costModel.fuelCostPerKm;
    const maintenanceCost = distance * costModel.maintenanceCostPerKm;
    const insuranceCost = distance * costModel.insuranceCostPerKm;
    const vehicleCost = distance * costPerKm;
    const driverCost = duration * driverCostPerHr;
    const loadUnloadCost = ((loadTimeMin + unloadTimeMin) / 60) * driverCostPerHr;
    
    const totalCost = fuelCost + maintenanceCost + insuranceCost + vehicleCost + driverCost + loadUnloadCost;
    const platformFee = totalCost * (platformFeePercent / 100);
    const netProfit = totalCost - platformFee;
    
    setPreviewCalculation(prev => ({
      ...prev,
      totalCost,
      platformFee,
      netProfit
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Cost model saved successfully!');
    } catch (error) {
      console.error('Failed to save cost model:', error);
      alert('Failed to save cost model. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateCostModel = (field: keyof CarrierCostModel, value: number) => {
    setCostModel(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date()
    }));
  };

  if (user?.role !== 'carrier' && user?.role !== 'dispatcher') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">Cost model configuration is only available for carriers and dispatchers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Calculator className="h-8 w-8 mr-3 text-green-600" />
                Carrier Cost Model
              </h1>
              <p className="text-gray-600 mt-2">
                Configure your cost parameters for accurate ROI calculations
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last updated</div>
              <div className="text-sm font-medium text-gray-900">
                {new Date(costModel.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Cost Configuration */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Vehicle Costs */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-blue-600" />
                  Vehicle Costs
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost per Kilometer (€)
                    </label>
                    <div className="relative">
                      <Euro className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={costModel.costPerKm}
                        onChange={(e) => updateCostModel('costPerKm', Number(e.target.value))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Depreciation, insurance, maintenance</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fuel Cost per Kilometer (€)
                    </label>
                    <div className="relative">
                      <Fuel className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={costModel.fuelCostPerKm}
                        onChange={(e) => updateCostModel('fuelCostPerKm', Number(e.target.value))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maintenance Cost per Kilometer (€)
                    </label>
                    <div className="relative">
                      <Settings className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={costModel.maintenanceCostPerKm}
                        onChange={(e) => updateCostModel('maintenanceCostPerKm', Number(e.target.value))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance Cost per Kilometer (€)
                    </label>
                    <div className="relative">
                      <Settings className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={costModel.insuranceCostPerKm}
                        onChange={(e) => updateCostModel('insuranceCostPerKm', Number(e.target.value))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Labor Costs */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2 text-purple-600" />
                  Labor Costs
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Driver Cost per Hour (€)
                    </label>
                    <div className="relative">
                      <Euro className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={costModel.driverCostPerHr}
                        onChange={(e) => updateCostModel('driverCostPerHr', Number(e.target.value))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Including wages, benefits, taxes</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Load Time (minutes)
                    </label>
                    <div className="relative">
                      <Clock className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        min="0"
                        value={costModel.loadTimeMin}
                        onChange={(e) => updateCostModel('loadTimeMin', Number(e.target.value))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unload Time (minutes)
                    </label>
                    <div className="relative">
                      <Clock className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        min="0"
                        value={costModel.unloadTimeMin}
                        onChange={(e) => updateCostModel('unloadTimeMin', Number(e.target.value))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Average Speed (km/h)
                    </label>
                    <div className="relative">
                      <MapPin className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        min="0"
                        value={costModel.avgSpeedKmh}
                        onChange={(e) => updateCostModel('avgSpeedKmh', Number(e.target.value))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">For time calculations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Fee */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Platform Fee
              </h2>
              
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform Fee Percentage (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="20"
                    value={costModel.platformFeePercent}
                    onChange={(e) => updateCostModel('platformFeePercent', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Commission charged by the platform</p>
              </div>
            </div>

            {/* Preview Calculation */}
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-green-600" />
                Cost Preview
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Distance (km)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={previewCalculation.distance}
                    onChange={(e) => setPreviewCalculation(prev => ({ ...prev, distance: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Duration (hours)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={previewCalculation.duration}
                    onChange={(e) => setPreviewCalculation(prev => ({ ...prev, duration: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={calculatePreview}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Calculate
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-sm text-gray-600">Total Cost</div>
                  <div className="text-2xl font-bold text-gray-900">€{previewCalculation.totalCost.toFixed(2)}</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-sm text-gray-600">Platform Fee</div>
                  <div className="text-2xl font-bold text-gray-900">€{previewCalculation.platformFee.toFixed(2)}</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-sm text-gray-600">Net Profit</div>
                  <div className="text-2xl font-bold text-gray-900">€{previewCalculation.netProfit.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Cost Model
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarrierCostModelPage;
