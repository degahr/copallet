import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShipment } from '../../contexts/ShipmentContext';
import { useAuth } from '../../contexts/AuthContext';
import { useErrorHandler } from '../../contexts/ErrorContext';
import { useToastHelpers } from '../../contexts/ToastContext';
import { Input } from '../../components/forms/FormFields';
import AddressSearchAdvanced from '../../components/AddressSearchAdvanced';
import { RouteCalculationService } from '../../services/routeCalculation';
import { Shipment, TimeWindow, PalletInfo, ServiceConstraints } from '../../types';
import { MapPin, Calendar, Package, AlertTriangle, Truck, ArrowLeft, Save } from 'lucide-react';

const EditShipment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { shipments, updateShipment } = useShipment();
  const { user } = useAuth();
  const { handleError } = useErrorHandler();
  const { showSuccess } = useToastHelpers();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipment = shipments.find(s => s.id === id);

  const [formData, setFormData] = useState<Partial<Shipment>>({});
  const [priceGuidance, setPriceGuidance] = useState({ min: 0, max: 0 });
  const [dataLoaded, setDataLoaded] = useState(false);

  const calculatePriceGuidance = () => {
    if (!formData.from || !formData.to || !formData.from.latitude || !formData.from.longitude || !formData.to.latitude || !formData.to.longitude) {
      console.log('Cannot calculate price: missing coordinates');
      return;
    }

    // Calculate realistic route distance
    const route = RouteCalculationService.calculateRoute(formData.from, formData.to);
    
    const palletQuantity = formData.pallets?.quantity || 1;
    const basePrice = palletQuantity * 50; // €50 per pallet base
    const distanceMultiplier = 1 + (route.distance / 1000); // Distance-based pricing
    const urgencyMultiplier = 1.1; // Based on time window
    
    // Add multipliers for special requirements
    let specialMultiplier = 1.0;
    if (formData.adrRequired) specialMultiplier += 0.3; // ADR adds 30%
    if (formData.constraints?.tailLiftRequired) specialMultiplier += 0.2; // Tail lift adds 20%
    if (formData.constraints?.forkliftRequired) specialMultiplier += 0.15; // Forklift adds 15%
    if (formData.constraints?.indoorDelivery) specialMultiplier += 0.1; // Indoor delivery adds 10%
    if (formData.constraints?.appointmentRequired) specialMultiplier += 0.05; // Appointment adds 5%
    
    const min = Math.round(basePrice * distanceMultiplier * specialMultiplier);
    const max = Math.round(basePrice * distanceMultiplier * urgencyMultiplier * specialMultiplier * 1.3);
    
    console.log('EditShipment price calculation:', {
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

  useEffect(() => {
    if (shipment && !dataLoaded) {
      console.log('Loading shipment data:', shipment); // Debug log
      
      const loadedFormData = {
        from: shipment.from || {
          street: '',
          city: '',
          postalCode: '',
          country: ''
        },
        to: shipment.to || {
          street: '',
          city: '',
          postalCode: '',
          country: ''
        },
        pickupWindow: {
          start: shipment.pickupWindow?.start ? new Date(shipment.pickupWindow.start) : new Date(),
          end: shipment.pickupWindow?.end ? new Date(shipment.pickupWindow.end) : new Date()
        },
        deliveryWindow: {
          start: shipment.deliveryWindow?.start ? new Date(shipment.deliveryWindow.start) : new Date(),
          end: shipment.deliveryWindow?.end ? new Date(shipment.deliveryWindow.end) : new Date()
        },
        pallets: shipment.pallets || {
          quantity: 1,
          dimensions: {
            length: 120,
            width: 80,
            height: 144
          },
          weight: 1000
        },
        adrRequired: shipment.adrRequired || false,
        constraints: shipment.constraints || {
          tailLiftRequired: false,
          forkliftRequired: false,
          temperatureControlled: false,
          indoorDelivery: false,
          appointmentRequired: false
        },
        notes: shipment.notes || ''
      };
      
      setFormData(loadedFormData);
      
      if (shipment.priceGuidance) {
        setPriceGuidance({
          min: shipment.priceGuidance.min || 0,
          max: shipment.priceGuidance.max || 0
        });
      } else {
        setPriceGuidance({ min: 0, max: 0 });
      }
      
      setDataLoaded(true);
      console.log('Form data loaded:', loadedFormData); // Debug log
    }
  }, [shipment, dataLoaded]);

  // Calculate price guidance after data is loaded
  useEffect(() => {
    if (dataLoaded && formData.pallets?.quantity) {
      calculatePriceGuidance();
    }
  }, [dataLoaded, formData.pallets?.quantity, formData.adrRequired, formData.constraints]);

  if (!shipment) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Shipment Not Found</h1>
        <p className="text-gray-600 mb-4">Loading shipment data...</p>
        <button
          onClick={() => navigate('/app/shipments')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shipments
        </button>
      </div>
    );
  }

  if (!dataLoaded) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Shipment Data</h1>
        <p className="text-gray-600 mb-4">Please wait while we load your shipment details...</p>
      </div>
    );
  }

  if (shipment.status !== 'draft') {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Cannot Edit Shipment</h1>
        <p className="text-gray-600 mb-4">Only draft shipments can be edited.</p>
        <button
          onClick={() => navigate('/app/shipments')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shipments
        </button>
      </div>
    );
  }

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      // Validate addresses
      if (!formData.from?.street || !formData.from?.city || !formData.from?.postalCode || !formData.from?.country) {
        newErrors.from = 'Please complete the pickup address';
      }
      if (!formData.to?.street || !formData.to?.city || !formData.to?.postalCode || !formData.to?.country) {
        newErrors.to = 'Please complete the delivery address';
      }
      
      // Validate time windows
      if (!formData.pickupWindow?.start || !formData.pickupWindow?.end) {
        newErrors.pickupWindow = 'Please set pickup time window';
      }
      if (!formData.deliveryWindow?.start || !formData.deliveryWindow?.end) {
        newErrors.deliveryWindow = 'Please set delivery time window';
      }
      
      // Validate pickup is before delivery
      if (formData.pickupWindow?.start && formData.deliveryWindow?.start && 
          formData.pickupWindow.start >= formData.deliveryWindow.start) {
        newErrors.timeWindow = 'Pickup must be before delivery';
      }
    }

    if (stepNumber === 2) {
      // Validate pallet info
      if (!formData.pallets?.quantity || formData.pallets.quantity < 1) {
        newErrors.pallets = 'Please specify at least 1 pallet';
      }
      if (!formData.pallets?.weight || formData.pallets.weight < 1) {
        newErrors.weight = 'Please specify pallet weight';
      }
      if (!formData.pallets?.dimensions?.length || formData.pallets.dimensions.length < 1) {
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

  const updateFormData = (field: keyof Shipment, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  };

  const updateTimeWindow = (type: 'pickupWindow' | 'deliveryWindow', field: keyof TimeWindow, value: Date) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type]!,
        [field]: value
      }
    }));
  };

  const updatePalletInfo = (field: keyof PalletInfo, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      pallets: {
        ...(prev.pallets || { quantity: 1, dimensions: { length: 120, width: 80, height: 144 }, weight: 1000 }),
        [field]: value
      }
    }));
  };

  const updateConstraints = (field: keyof ServiceConstraints, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      constraints: {
        ...prev.constraints!,
        [field]: value
      }
    }));
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

      const updatedShipment = {
        fromAddress: formData.from!,
        toAddress: formData.to!,
        pickupWindow: formData.pickupWindow!,
        deliveryWindow: formData.deliveryWindow!,
        pallets: formData.pallets!,
        adrRequired: formData.adrRequired || false,
        constraints: formData.constraints,
        notes: formData.notes,
        priceGuidance: {
          min: priceGuidance.min,
          max: priceGuidance.max,
          currency: 'EUR'
        }
      };
      
      await updateShipment(shipment.id, updatedShipment);
      showSuccess('Shipment Updated!', 'Your shipment has been updated successfully.');
      navigate('/app/shipments');
    } catch (error) {
      console.error('Failed to update shipment:', error);
      handleError(error, 'Failed to update shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Shipment</h1>
            <p className="mt-2 text-gray-600">Update your shipment details</p>
          </div>
          <button
            onClick={() => navigate('/app/shipments')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shipments
          </button>
        </div>
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
              { number: 1, title: 'Addresses & Times', icon: MapPin },
              { number: 2, title: 'Pallets & Services', icon: Package },
              { number: 3, title: 'Price Guidance', icon: Calendar }
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
        {/* Step 1: Addresses and Time Windows */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Pickup Location
              </h3>
              <AddressSearchAdvanced
                value={{
                  street: formData.from?.street || '',
                  city: formData.from?.city || '',
                  postalCode: formData.from?.postalCode || '',
                  country: formData.from?.country || '',
                  latitude: formData.from?.latitude,
                  longitude: formData.from?.longitude
                }}
                onChange={(address) => {
                  updateFormData('from', {
                    ...(formData.from || {}),
                    ...address
                  });
                }}
                label="Pickup Address"
                placeholder="Search for pickup address..."
                required
                error={errors.from}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Delivery Location
              </h3>
              <AddressSearchAdvanced
                value={{
                  street: formData.to?.street || '',
                  city: formData.to?.city || '',
                  postalCode: formData.to?.postalCode || '',
                  country: formData.to?.country || '',
                  latitude: formData.to?.latitude,
                  longitude: formData.to?.longitude
                }}
                onChange={(address) => {
                  updateFormData('to', {
                    ...(formData.to || {}),
                    ...address
                  });
                }}
                label="Delivery Address"
                placeholder="Search for delivery address..."
                required
                error={errors.to}
              />
            </div>

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
                      value={formData.pickupWindow?.start ? formData.pickupWindow.start.toISOString().slice(0, 16) : ''}
                      onChange={(e) => updateTimeWindow('pickupWindow', 'start', new Date(e.target.value))}
                      error={errors.pickupWindow}
                    />
                    <Input
                      type="datetime-local"
                      required
                      label="End Time"
                      value={formData.pickupWindow?.end ? formData.pickupWindow.end.toISOString().slice(0, 16) : ''}
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
                      value={formData.deliveryWindow?.start ? formData.deliveryWindow.start.toISOString().slice(0, 16) : ''}
                      onChange={(e) => updateTimeWindow('deliveryWindow', 'start', new Date(e.target.value))}
                      error={errors.deliveryWindow}
                    />
                    <Input
                      type="datetime-local"
                      required
                      label="End Time"
                      value={formData.deliveryWindow?.end ? formData.deliveryWindow.end.toISOString().slice(0, 16) : ''}
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
                onClick={() => setStep(2)}
                className="px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Next: Pallets & Services
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Pallets and Services */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Pallet Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  min="1"
                  required
                  label="Number of Pallets"
                  value={formData.pallets?.quantity || 1}
                  onChange={(e) => updatePalletInfo('quantity', parseInt(e.target.value))}
                  error={errors.pallets}
                />
                <Input
                  type="number"
                  min="1"
                  required
                  label="Weight (kg)"
                  value={formData.pallets?.weight || 1000}
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
                  value={formData.pallets?.dimensions?.length || 120}
                  onChange={(e) => updatePalletInfo('dimensions', {
                    ...(formData.pallets?.dimensions || { length: 120, width: 80, height: 144 }),
                    length: parseInt(e.target.value)
                  })}
                  error={errors.dimensions}
                />
                <Input
                  type="number"
                  min="1"
                  required
                  label="Width (cm)"
                  value={formData.pallets?.dimensions?.width || 80}
                  onChange={(e) => updatePalletInfo('dimensions', {
                    ...(formData.pallets?.dimensions || { length: 120, width: 80, height: 144 }),
                    width: parseInt(e.target.value)
                  })}
                  error={errors.dimensions}
                />
                <Input
                  type="number"
                  min="1"
                  required
                  label="Height (cm)"
                  value={formData.pallets?.dimensions?.height || 144}
                  onChange={(e) => updatePalletInfo('dimensions', {
                    ...(formData.pallets?.dimensions || { length: 120, width: 80, height: 144 }),
                    height: parseInt(e.target.value)
                  })}
                  error={errors.dimensions}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Special Requirements
              </h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={formData.adrRequired}
                    onChange={(e) => updateFormData('adrRequired', e.target.checked)}
                  />
                  <span className="ml-2 block text-sm text-gray-900">ADR (Dangerous Goods) Required</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={formData.constraints?.tailLiftRequired}
                    onChange={(e) => updateConstraints('tailLiftRequired', e.target.checked)}
                  />
                  <span className="ml-2 block text-sm text-gray-900">Tail Lift Required</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={formData.constraints?.forkliftRequired}
                    onChange={(e) => updateConstraints('forkliftRequired', e.target.checked)}
                  />
                  <span className="ml-2 block text-sm text-gray-900">Forklift Required</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={formData.constraints?.temperatureControlled}
                    onChange={(e) => updateConstraints('temperatureControlled', e.target.checked)}
                  />
                  <span className="ml-2 block text-sm text-gray-900">Temperature Controlled</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={formData.constraints?.indoorDelivery}
                    onChange={(e) => updateConstraints('indoorDelivery', e.target.checked)}
                  />
                  <span className="ml-2 block text-sm text-gray-900">Indoor Delivery</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={formData.constraints?.appointmentRequired}
                    onChange={(e) => updateConstraints('appointmentRequired', e.target.checked)}
                  />
                  <span className="ml-2 block text-sm text-gray-900">Appointment Required</span>
                </label>
              </div>
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
                onClick={() => setStep(3)}
                className="px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Next: Price Guidance
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Price Guidance */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Price Guidance</h3>
                <button
                  type="button"
                  onClick={calculatePriceGuidance}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <Truck className="h-4 w-4 mr-1" />
                  Recalculate
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">
                  €{priceGuidance.min} - €{priceGuidance.max}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Based on {formData.pallets?.quantity || 1} pallets and {priceGuidance.min > 0 ? 'calculated route distance' : 'route distance'}
                  {formData.adrRequired && <span className="text-red-600"> • ADR Required (+30%)</span>}
                  {formData.constraints?.tailLiftRequired && <span className="text-blue-600"> • Tail Lift (+20%)</span>}
                  {formData.constraints?.forkliftRequired && <span className="text-purple-600"> • Forklift (+15%)</span>}
                  {formData.constraints?.indoorDelivery && <span className="text-green-600"> • Indoor Delivery (+10%)</span>}
                  {formData.constraints?.appointmentRequired && <span className="text-orange-600"> • Appointment (+5%)</span>}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  label="Minimum Price (€)"
                  value={priceGuidance.min || 0}
                  onChange={(e) => setPriceGuidance(prev => ({ ...prev, min: parseFloat(e.target.value) || 0 }))}
                  error={errors.priceGuidance}
                />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  label="Maximum Price (€)"
                  value={priceGuidance.max || 0}
                  onChange={(e) => setPriceGuidance(prev => ({ ...prev, max: parseFloat(e.target.value) || 0 }))}
                  error={errors.priceGuidance}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Additional Notes</h3>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={4}
                placeholder="Any additional information or special instructions..."
                value={formData.notes || ''}
                onChange={(e) => updateFormData('notes', e.target.value)}
              />
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
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditShipment;
