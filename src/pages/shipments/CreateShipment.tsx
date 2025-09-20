import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShipment } from '../../contexts/ShipmentContext';
import { useAuth } from '../../contexts/AuthContext';
import { useErrorHandler } from '../../contexts/ErrorContext';
import { useToastHelpers } from '../../contexts/ToastContext';
import { Input } from '../../components/forms/FormFields';
import AddressSearchAdvanced from '../../components/AddressSearchAdvanced';
import { RouteCalculationService } from '../../services/routeCalculation';
import { Shipment, TimeWindow, PalletInfo, ServiceConstraints } from '../../types';
import { MapPin, Calendar, Package, AlertTriangle, Truck } from 'lucide-react';

const CreateShipment: React.FC = () => {
  const navigate = useNavigate();
  const { createShipment } = useShipment();
  const { user } = useAuth();
  const { handleError } = useErrorHandler();
  const { showSuccess } = useToastHelpers();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [shipment, setShipment] = useState<Partial<Shipment>>({
    shipperId: user?.id || '',
    status: 'draft',
    from: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    },
    to: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    },
    pickupWindow: {
      start: new Date(),
      end: new Date()
    },
    deliveryWindow: {
      start: new Date(),
      end: new Date()
    },
    pallets: {
      quantity: 1,
      dimensions: {
        length: 120,
        width: 80,
        height: 144
      },
      weight: 1000
    },
    adrRequired: false,
    constraints: {
      tailLiftRequired: false,
      forkliftRequired: false,
      indoorDelivery: false,
      appointmentRequired: false
    },
    notes: ''
  });

  const [priceGuidance, setPriceGuidance] = useState({ min: 0, max: 0 });

  // Auto-calculate price when shipment data changes
  React.useEffect(() => {
    if (shipment.pallets?.quantity) {
      calculatePriceGuidance();
    }
  }, [shipment.pallets?.quantity, shipment.adrRequired, shipment.constraints]);

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      // Validate addresses
      if (!shipment.from?.street || !shipment.from?.city || !shipment.from?.postalCode || !shipment.from?.country) {
        newErrors.from = 'Please complete the pickup address';
      }
      if (!shipment.to?.street || !shipment.to?.city || !shipment.to?.postalCode || !shipment.to?.country) {
        newErrors.to = 'Please complete the delivery address';
      }
      
      // Validate time windows
      if (!shipment.pickupWindow?.start || !shipment.pickupWindow?.end) {
        newErrors.pickupWindow = 'Please set pickup time window';
      }
      if (!shipment.deliveryWindow?.start || !shipment.deliveryWindow?.end) {
        newErrors.deliveryWindow = 'Please set delivery time window';
      }
      
      // Validate pickup is before delivery
      if (shipment.pickupWindow?.start && shipment.deliveryWindow?.start && 
          shipment.pickupWindow.start >= shipment.deliveryWindow.start) {
        newErrors.timeWindow = 'Pickup must be before delivery';
      }
    }

    if (stepNumber === 2) {
      // Validate pallet info
      if (!shipment.pallets?.quantity || shipment.pallets.quantity < 1) {
        newErrors.pallets = 'Please specify at least 1 pallet';
      }
      if (!shipment.pallets?.weight || shipment.pallets.weight < 1) {
        newErrors.weight = 'Please specify pallet weight';
      }
      if (!shipment.pallets?.dimensions?.length || shipment.pallets.dimensions.length < 1) {
        newErrors.dimensions = 'Please specify pallet dimensions';
      }
    }

    if (stepNumber === 3) {
      // Validate price guidance
      if (priceGuidance.min <= 0 || priceGuidance.max <= 0) {
        newErrors.priceGuidance = 'Please set valid price range';
      }
      if (priceGuidance.min >= priceGuidance.max) {
        newErrors.priceGuidance = 'Minimum price must be less than maximum price';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateShipment = (field: keyof Shipment, value: unknown) => {
    setShipment(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  };

  const updateTimeWindow = (type: 'pickupWindow' | 'deliveryWindow', field: keyof TimeWindow, value: Date) => {
    setShipment(prev => ({
      ...prev,
      [type]: {
        ...prev[type]!,
        [field]: value
      }
    }));
  };

  const updatePalletInfo = (field: keyof PalletInfo, value: unknown) => {
    setShipment(prev => ({
      ...prev,
      pallets: {
        ...(prev.pallets || { quantity: 1, dimensions: { length: 120, width: 80, height: 144 }, weight: 1000 }),
        [field]: value
      }
    }));
  };

  const updateConstraints = (field: keyof ServiceConstraints, value: boolean) => {
    setShipment(prev => ({
      ...prev,
      constraints: {
        ...prev.constraints!,
        [field]: value
      }
    }));
  };

  const calculatePriceGuidance = () => {
    if (!shipment.from || !shipment.to || !shipment.from.latitude || !shipment.from.longitude || !shipment.to.latitude || !shipment.to.longitude) {
      console.log('Cannot calculate price: missing coordinates');
      return;
    }

    // Calculate realistic route distance
    const route = RouteCalculationService.calculateRoute(shipment.from, shipment.to);
    
    const palletQuantity = shipment.pallets?.quantity || 1;
    const basePrice = palletQuantity * 50; // €50 per pallet base
    const distanceMultiplier = 1 + (route.distance / 1000); // Distance-based pricing
    const urgencyMultiplier = 1.1; // Based on time window
    
    // Add multipliers for special requirements
    let specialMultiplier = 1.0;
    if (shipment.adrRequired) specialMultiplier += 0.3; // ADR adds 30%
    if (shipment.constraints?.tailLiftRequired) specialMultiplier += 0.2; // Tail lift adds 20%
    if (shipment.constraints?.forkliftRequired) specialMultiplier += 0.15; // Forklift adds 15%
    if (shipment.constraints?.indoorDelivery) specialMultiplier += 0.1; // Indoor delivery adds 10%
    if (shipment.constraints?.appointmentRequired) specialMultiplier += 0.05; // Appointment adds 5%
    
    const min = Math.round(basePrice * distanceMultiplier * specialMultiplier);
    const max = Math.round(basePrice * distanceMultiplier * urgencyMultiplier * specialMultiplier * 1.3);
    
    console.log('CreateShipment price calculation:', {
      palletQuantity,
      basePrice,
      distance: route.distance,
      routeType: route.routeType,
      specialMultiplier,
      min,
      max
    });
    
    setPriceGuidance({ min, max });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate all steps before submitting
      if (!validateStep(1) || !validateStep(2)) {
        setStep(1); // Go back to first step with errors
        return;
      }

      const shipmentToCreate = {
        fromAddress: shipment.from!,
        toAddress: shipment.to!,
        pickupWindow: shipment.pickupWindow!,
        deliveryWindow: shipment.deliveryWindow!,
        pallets: shipment.pallets!,
        adrRequired: shipment.adrRequired || false,
        constraints: shipment.constraints,
        notes: shipment.notes
      };
      
      await createShipment(shipmentToCreate as any);
      showSuccess('Shipment Created!', 'Your shipment has been saved as a draft.');
      navigate('/app/shipments');
    } catch (error) {
      console.error('Failed to create shipment:', error);
      handleError(error, 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  const handlePostToMarketplace = async () => {
    setLoading(true);
    setErrors({});
    
    try {
      // Validate all steps before posting
      if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
        setStep(1); // Go back to first step with errors
        return;
      }

      const shipmentToPost = {
        fromAddress: shipment.from!,
        toAddress: shipment.to!,
        pickupWindow: shipment.pickupWindow!,
        deliveryWindow: shipment.deliveryWindow!,
        pallets: shipment.pallets!,
        adrRequired: shipment.adrRequired || false,
        constraints: shipment.constraints,
        notes: shipment.notes,
        priceGuidance: {
          min: priceGuidance.min,
          max: priceGuidance.max,
          currency: 'EUR'
        }
      };
      
      await createShipment(shipmentToPost as any);
      showSuccess('Shipment Posted!', 'Your shipment has been posted to the marketplace.');
      navigate('/app/shipments');
    } catch (error) {
      console.error('Failed to post shipment:', error);
      handleError(error, 'Failed to post shipment to marketplace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Shipment</h1>
        <p className="mt-2 text-gray-600">
          Fill in the details below to create and post your shipment to the marketplace
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="relative">
          {/* Progress line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
            <div 
              className="h-0.5 bg-primary-600 transition-all duration-300 ease-in-out"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
          
          {/* Steps */}
          <div className="relative flex justify-between">
            {[
              { number: 1, title: 'Location & Timing', icon: MapPin },
              { number: 2, title: 'Cargo Details', icon: Package },
              { number: 3, title: 'Services & Pricing', icon: Truck }
            ].map(({ number, title, icon: Icon }) => (
              <div key={number} className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium border-2 transition-all duration-300 ${
                  step >= number 
                    ? 'bg-primary-600 text-white border-primary-600' 
                    : 'bg-white text-gray-600 border-gray-300'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`mt-2 text-xs font-medium text-center max-w-20 ${
                  step >= number ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow">
          {step === 1 && (
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location & Timing
              </h2>

              {/* Pickup Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Pickup Location</h3>
                <AddressSearchAdvanced
                  value={{
                    street: shipment.from?.street || '',
                    city: shipment.from?.city || '',
                    postalCode: shipment.from?.postalCode || '',
                    country: shipment.from?.country || '',
                    latitude: shipment.from?.latitude,
                    longitude: shipment.from?.longitude
                  }}
                  onChange={(address) => {
                    updateShipment('from', {
                      ...shipment.from,
                      ...address
                    });
                  }}
                  label="Pickup Address"
                  placeholder="Search for pickup address..."
                  required
                  error={errors.from}
                />
              </div>

              {/* Delivery Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Delivery Location</h3>
                <AddressSearchAdvanced
                  value={{
                    street: shipment.to?.street || '',
                    city: shipment.to?.city || '',
                    postalCode: shipment.to?.postalCode || '',
                    country: shipment.to?.country || '',
                    latitude: shipment.to?.latitude,
                    longitude: shipment.to?.longitude
                  }}
                  onChange={(address) => {
                    updateShipment('to', {
                      ...shipment.to,
                      ...address
                    });
                  }}
                  label="Delivery Address"
                  placeholder="Search for delivery address..."
                  required
                  error={errors.to}
                />
              </div>

              {/* Time Windows */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Time Windows
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pickup Window
                    </label>
                    <div className="mt-1 space-y-2">
                      <Input
                        type="datetime-local"
                        required
                        label="Start Time"
                        value={shipment.pickupWindow?.start.toISOString().slice(0, 16)}
                        onChange={(e) => updateTimeWindow('pickupWindow', 'start', new Date(e.target.value))}
                        error={errors.pickupWindow}
                      />
                      <Input
                        type="datetime-local"
                        required
                        label="End Time"
                        value={shipment.pickupWindow?.end.toISOString().slice(0, 16)}
                        onChange={(e) => updateTimeWindow('pickupWindow', 'end', new Date(e.target.value))}
                        error={errors.pickupWindow}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Delivery Window
                    </label>
                    <div className="mt-1 space-y-2">
                      <Input
                        type="datetime-local"
                        required
                        label="Start Time"
                        value={shipment.deliveryWindow?.start.toISOString().slice(0, 16)}
                        onChange={(e) => updateTimeWindow('deliveryWindow', 'start', new Date(e.target.value))}
                        error={errors.deliveryWindow}
                      />
                      <Input
                        type="datetime-local"
                        required
                        label="End Time"
                        value={shipment.deliveryWindow?.end.toISOString().slice(0, 16)}
                        onChange={(e) => updateTimeWindow('deliveryWindow', 'end', new Date(e.target.value))}
                        error={errors.deliveryWindow}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {(errors.pickupWindow || errors.deliveryWindow || errors.timeWindow) && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <ul className="list-disc list-inside space-y-1">
                          {errors.pickupWindow && <li>{errors.pickupWindow}</li>}
                          {errors.deliveryWindow && <li>{errors.deliveryWindow}</li>}
                          {errors.timeWindow && <li>{errors.timeWindow}</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep(1)) {
                      setStep(2);
                    }
                  }}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Next: Cargo Details
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Cargo Details
              </h2>

              {/* Pallet Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Pallet Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    min="1"
                    required
                    label="Number of Pallets"
                    value={shipment.pallets?.quantity || ''}
                    onChange={(e) => updatePalletInfo('quantity', parseInt(e.target.value))}
                    error={errors.pallets}
                  />
                  <Input
                    type="number"
                    min="1"
                    required
                    label="Weight (kg)"
                    value={shipment.pallets?.weight || ''}
                    onChange={(e) => updatePalletInfo('weight', parseInt(e.target.value))}
                    error={errors.weight}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    type="number"
                    min="1"
                    required
                    label="Length (cm)"
                    value={shipment.pallets?.dimensions.length || ''}
                    onChange={(e) => updatePalletInfo('dimensions', {
                      ...shipment.pallets?.dimensions,
                      length: parseInt(e.target.value)
                    })}
                    error={errors.dimensions}
                  />
                  <Input
                    type="number"
                    min="1"
                    required
                    label="Width (cm)"
                    value={shipment.pallets?.dimensions.width || ''}
                    onChange={(e) => updatePalletInfo('dimensions', {
                      ...shipment.pallets?.dimensions,
                      width: parseInt(e.target.value)
                    })}
                    error={errors.dimensions}
                  />
                  <Input
                    type="number"
                    min="1"
                    required
                    label="Height (cm)"
                    value={shipment.pallets?.dimensions.height || ''}
                    onChange={(e) => updatePalletInfo('dimensions', {
                      ...shipment.pallets?.dimensions,
                      height: parseInt(e.target.value)
                    })}
                    error={errors.dimensions}
                  />
                </div>
              </div>

              {/* ADR Requirements */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Special Requirements
                </h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="adrRequired"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={shipment.adrRequired}
                    onChange={(e) => updateShipment('adrRequired', e.target.checked)}
                  />
                  <label htmlFor="adrRequired" className="ml-2 block text-sm text-gray-900">
                    ADR (Dangerous Goods) Required
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any special instructions or additional information..."
                  value={shipment.notes}
                  onChange={(e) => updateShipment('notes', e.target.value)}
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep(2)) {
                      setStep(3);
                    }
                  }}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Next: Services & Pricing
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Services & Pricing
              </h2>

              {/* Service Constraints */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Service Requirements</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="tailLiftRequired"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={shipment.constraints?.tailLiftRequired}
                      onChange={(e) => updateConstraints('tailLiftRequired', e.target.checked)}
                    />
                    <label htmlFor="tailLiftRequired" className="ml-2 block text-sm text-gray-900">
                      Tail-lift Required
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="forkliftRequired"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={shipment.constraints?.forkliftRequired}
                      onChange={(e) => updateConstraints('forkliftRequired', e.target.checked)}
                    />
                    <label htmlFor="forkliftRequired" className="ml-2 block text-sm text-gray-900">
                      Forklift Required
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="indoorDelivery"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={shipment.constraints?.indoorDelivery}
                      onChange={(e) => updateConstraints('indoorDelivery', e.target.checked)}
                    />
                    <label htmlFor="indoorDelivery" className="ml-2 block text-sm text-gray-900">
                      Indoor Delivery Required
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="appointmentRequired"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={shipment.constraints?.appointmentRequired}
                      onChange={(e) => updateConstraints('appointmentRequired', e.target.checked)}
                    />
                    <label htmlFor="appointmentRequired" className="ml-2 block text-sm text-gray-900">
                      Appointment Required
                    </label>
                  </div>
                </div>
              </div>

              {/* Price Guidance */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Price Guidance</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Estimated Price Range</span>
                    <button
                      type="button"
                      onClick={calculatePriceGuidance}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Calculate
                    </button>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    €{priceGuidance.min} - €{priceGuidance.max}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Based on {shipment.pallets?.quantity || 1} pallets and {priceGuidance.min > 0 ? 'calculated route distance' : 'route distance'}
                    {shipment.adrRequired && <span className="text-red-600"> • ADR Required (+30%)</span>}
                    {shipment.constraints?.tailLiftRequired && <span className="text-blue-600"> • Tail Lift (+20%)</span>}
                    {shipment.constraints?.forkliftRequired && <span className="text-purple-600"> • Forklift (+15%)</span>}
                    {shipment.constraints?.indoorDelivery && <span className="text-green-600"> • Indoor Delivery (+10%)</span>}
                    {shipment.constraints?.appointmentRequired && <span className="text-orange-600"> • Appointment (+5%)</span>}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    label="Minimum Price (€)"
                    value={priceGuidance.min || ''}
                    onChange={(e) => setPriceGuidance(prev => ({ ...prev, min: parseFloat(e.target.value) || 0 }))}
                    error={errors.priceGuidance}
                  />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    label="Maximum Price (€)"
                    value={priceGuidance.max || ''}
                    onChange={(e) => setPriceGuidance(prev => ({ ...prev, max: parseFloat(e.target.value) || 0 }))}
                    error={errors.priceGuidance}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Back
                </button>
                <div className="space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save as Draft'}
                  </button>
                  <button
                    type="button"
                    onClick={handlePostToMarketplace}
                    disabled={loading || priceGuidance.min === 0}
                    className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {loading ? 'Posting...' : 'Post to Marketplace'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateShipment;