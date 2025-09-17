import { useState, useEffect, useCallback } from 'react';
import { Calculator, MapPin, Package, Clock, Euro } from 'lucide-react';

const PricingCalculator = () => {
  const [formData, setFormData] = useState({
    distance: '',
    pallets: '',
    weight: '',
    deliveryType: 'standard',
    adrRequired: false,
    tailLiftRequired: false,
    temperatureControlled: false,
  });

  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  const calculatePrice = useCallback(() => {
    const distance = parseFloat(formData.distance) || 0;
    const pallets = parseInt(formData.pallets) || 0;
    const weight = parseFloat(formData.weight) || 0;

    if (distance === 0 || pallets === 0) {
      setCalculatedPrice(null);
      return;
    }

    // Base calculation
    let basePrice = 150; // Base rate
    let pricePerKm = 1.2;
    let pricePerPallet = 25;

    // Distance calculation
    const distancePrice = distance * pricePerKm;
    
    // Pallet calculation
    const palletPrice = pallets * pricePerPallet;

    // Weight surcharge (if over 1000kg per pallet)
    const weightPerPallet = weight / pallets;
    const weightSurcharge = weightPerPallet > 1000 ? (weightPerPallet - 1000) * 0.1 * pallets : 0;

    // Delivery type pricing
    let deliveryMultiplier = 1;
    if (formData.deliveryType === 'express') deliveryMultiplier = 1.5;
    if (formData.deliveryType === 'same-day') deliveryMultiplier = 2;

    // Additional services
    let additionalCosts = 0;
    if (formData.adrRequired) additionalCosts += 200;
    if (formData.tailLiftRequired) additionalCosts += 50;
    if (formData.temperatureControlled) additionalCosts += 100;

    const totalPrice = (basePrice + distancePrice + palletPrice + weightSurcharge + additionalCosts) * deliveryMultiplier;
    setCalculatedPrice(Math.round(totalPrice));
  }, [formData]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Auto-calculate when form data changes
  useEffect(() => {
    calculatePrice();
  }, [calculatePrice]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Calculator className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Instant Price Calculator</h2>
        <p className="text-gray-600">Get an accurate quote in seconds</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="h-4 w-4 inline mr-2" />
            Distance (km)
          </label>
          <input
            type="number"
            value={formData.distance}
            onChange={(e) => handleInputChange('distance', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="e.g., 250"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Package className="h-4 w-4 inline mr-2" />
            Number of Pallets
          </label>
          <input
            type="number"
            value={formData.pallets}
            onChange={(e) => handleInputChange('pallets', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="e.g., 4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Weight (kg)
          </label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="e.g., 2000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-2" />
            Delivery Type
          </label>
          <select 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            value={formData.deliveryType}
            onChange={(e) => handleInputChange('deliveryType', e.target.value)}
          >
            <option value="standard">Standard (3-5 days)</option>
            <option value="express">Express (1-2 days)</option>
            <option value="same-day">Same Day</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Services</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.adrRequired}
              onChange={(e) => handleInputChange('adrRequired', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">ADR Required</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.tailLiftRequired}
              onChange={(e) => handleInputChange('tailLiftRequired', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Tail Lift</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.temperatureControlled}
              onChange={(e) => handleInputChange('temperatureControlled', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Temperature Control</span>
          </label>
        </div>
      </div>

      <button
        onClick={calculatePrice}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors mb-6"
      >
        Recalculate Price
      </button>

      {calculatedPrice && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Euro className="h-6 w-6 text-green-600 mr-2" />
            <span className="text-3xl font-bold text-green-600">€{calculatedPrice}</span>
          </div>
          <p className="text-green-700 mb-4">Estimated total cost</p>
          <div className="text-sm text-green-600 space-y-1">
            <p>• Price includes fuel surcharge</p>
            <p>• {formData.deliveryType === 'standard' ? 'Standard delivery (3-5 days)' : 
                formData.deliveryType === 'express' ? 'Express delivery (1-2 days)' : 
                'Same-day delivery'}</p>
            <p>• Final price may vary based on specific requirements</p>
            <p>• Contact us for exact quote</p>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-4">
          Need a more detailed quote? Our team can provide exact pricing.
        </p>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2 rounded-lg transition-colors">
          Get Detailed Quote
        </button>
      </div>
    </div>
  );
};

export default PricingCalculator;
