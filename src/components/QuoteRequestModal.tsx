import React, { useState } from 'react';
import { X, Send, Package, MapPin, Calendar, Euro, MessageSquare } from 'lucide-react';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  carrier: {
    id: string;
    name: string;
    company: string;
    rating: number;
    pricing: {
      baseRate: number;
      costPerKm: number;
      minOrder: number;
    };
  };
  onSubmit: (quoteData: QuoteRequestData) => void;
}

interface QuoteRequestData {
  shipmentDetails: {
    fromAddress: string;
    toAddress: string;
    palletCount: number;
    palletDimensions: string;
    weight: number;
    pickupDate: string;
    deliveryDate: string;
    specialRequirements: string[];
  };
  budget: {
    maxPrice: number;
    currency: string;
  };
  message: string;
  contactPreferences: {
    preferredMethod: 'email' | 'phone' | 'platform';
    phoneNumber?: string;
  };
}

const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({
  isOpen,
  onClose,
  carrier,
  onSubmit
}) => {
  const [formData, setFormData] = useState<QuoteRequestData>({
    shipmentDetails: {
      fromAddress: '',
      toAddress: '',
      palletCount: 1,
      palletDimensions: '120x80x144',
      weight: 1000,
      pickupDate: '',
      deliveryDate: '',
      specialRequirements: []
    },
    budget: {
      maxPrice: carrier.pricing.baseRate,
      currency: 'EUR'
    },
    message: '',
    contactPreferences: {
      preferredMethod: 'platform'
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof QuoteRequestData],
        [field]: value
      }
    }));
  };

  const handleSpecialRequirementToggle = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      shipmentDetails: {
        ...prev.shipmentDetails,
        specialRequirements: prev.shipmentDetails.specialRequirements.includes(requirement)
          ? prev.shipmentDetails.specialRequirements.filter(r => r !== requirement)
          : [...prev.shipmentDetails.specialRequirements, requirement]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting quote request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Request Quote</h2>
            <p className="text-sm text-gray-600">from {carrier.name} at {carrier.company}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Shipment Details</span>
            <span>Budget & Timeline</span>
            <span>Contact & Message</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Shipment Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Shipment Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Address
                  </label>
                  <input
                    type="text"
                    value={formData.shipmentDetails.fromAddress}
                    onChange={(e) => handleNestedInputChange('shipmentDetails', 'fromAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Pickup location"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Address
                  </label>
                  <input
                    type="text"
                    value={formData.shipmentDetails.toAddress}
                    onChange={(e) => handleNestedInputChange('shipmentDetails', 'toAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Delivery location"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Pallets
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.shipmentDetails.palletCount}
                    onChange={(e) => handleNestedInputChange('shipmentDetails', 'palletCount', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pallet Dimensions (cm)
                  </label>
                  <input
                    type="text"
                    value={formData.shipmentDetails.palletDimensions}
                    onChange={(e) => handleNestedInputChange('shipmentDetails', 'palletDimensions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="120x80x144"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.shipmentDetails.weight}
                    onChange={(e) => handleNestedInputChange('shipmentDetails', 'weight', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['ADR Required', 'Tail Lift', 'Forklift Access', 'Indoor Delivery', 'Appointment Required', 'Temperature Controlled'].map((req) => (
                    <label key={req} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.shipmentDetails.specialRequirements.includes(req)}
                        onChange={() => handleSpecialRequirementToggle(req)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{req}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Budget & Timeline */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Euro className="h-5 w-5 mr-2" />
                Budget & Timeline
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Budget
                  </label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.budget.maxPrice}
                      onChange={(e) => handleNestedInputChange('budget', 'maxPrice', parseFloat(e.target.value))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Carrier's base rate: €{carrier.pricing.baseRate}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={formData.budget.currency}
                    onChange={(e) => handleNestedInputChange('budget', 'currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Pickup Date
                  </label>
                  <input
                    type="date"
                    value={formData.shipmentDetails.pickupDate}
                    onChange={(e) => handleNestedInputChange('shipmentDetails', 'pickupDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Required Delivery Date
                  </label>
                  <input
                    type="date"
                    value={formData.shipmentDetails.deliveryDate}
                    onChange={(e) => handleNestedInputChange('shipmentDetails', 'deliveryDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact & Message */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Contact & Message
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Contact Method
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'platform', label: 'Through CoPallet Platform' },
                    { value: 'email', label: 'Email' },
                    { value: 'phone', label: 'Phone Call' }
                  ].map((method) => (
                    <label key={method.value} className="flex items-center">
                      <input
                        type="radio"
                        name="contactMethod"
                        value={method.value}
                        checked={formData.contactPreferences.preferredMethod === method.value}
                        onChange={(e) => handleNestedInputChange('contactPreferences', 'preferredMethod', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.contactPreferences.preferredMethod === 'phone' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPreferences.phoneNumber || ''}
                    onChange={(e) => handleNestedInputChange('contactPreferences', 'phoneNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+31 6 12345678"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional information or special instructions..."
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Quote Request
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteRequestModal;
