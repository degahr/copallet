import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ShipmentTemplate } from '../../types';
import apiService from '../../services/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Save,
  Package,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';

const ShipmentTemplates: React.FC = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<ShipmentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ShipmentTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    from: {
      street: '',
      city: '',
      postalCode: '',
      country: 'Netherlands'
    },
    to: {
      street: '',
      city: '',
      postalCode: '',
      country: 'Netherlands'
    },
    pallets: {
      quantity: 1,
      dimensions: { length: 120, width: 80, height: 144 },
      weight: 1000
    },
    adrRequired: false,
    constraints: {
      tailLiftRequired: false,
      forkliftRequired: false,
      indoorDelivery: false,
      appointmentRequired: false
    },
    notes: '',
    priceGuidance: { min: 0, max: 0, currency: 'EUR' }
  });

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const templatesData = await apiService.getShipmentTemplates();
        setTemplates(templatesData);
      } catch (err) {
        setError('Failed to load templates');
        console.error('Error fetching templates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTemplate) {
        await apiService.updateShipmentTemplate(editingTemplate.id, formData);
        setTemplates(prev => prev.map(template => 
          template.id === editingTemplate.id 
            ? { ...template, ...formData, updatedAt: new Date() }
            : template
        ));
      } else {
        const newTemplate = await apiService.createShipmentTemplate(formData);
        setTemplates(prev => [...prev, newTemplate.template]);
      }
      resetForm();
    } catch (err) {
      console.error('Error saving template:', err);
      setError('Failed to save template');
    }
  };

  const handleEdit = (template: ShipmentTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      from: template.from,
      to: template.to,
      pallets: template.pallets,
      adrRequired: template.adrRequired,
      constraints: template.constraints,
      notes: template.notes,
      priceGuidance: template.priceGuidance
    });
    setShowForm(true);
  };

  const handleDelete = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await apiService.deleteShipmentTemplate(templateId);
        setTemplates(prev => prev.filter(template => template.id !== templateId));
      } catch (err) {
        console.error('Error deleting template:', err);
        setError('Failed to delete template');
      }
    }
  };

  const handleDuplicate = async (template: ShipmentTemplate) => {
    try {
      const duplicatedTemplate = {
        ...template,
        name: `${template.name} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      delete duplicatedTemplate.id;
      
      const newTemplate = await apiService.createShipmentTemplate(duplicatedTemplate);
      setTemplates(prev => [...prev, newTemplate.template]);
    } catch (err) {
      console.error('Error duplicating template:', err);
      setError('Failed to duplicate template');
    }
  };

  const handleCreateFromTemplate = async (template: ShipmentTemplate) => {
    try {
      const shipment = await apiService.createShipmentFromTemplate(template.id, {
        pickupDate: new Date().toISOString().split('T')[0],
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      
      // Navigate to shipment creation page or show success message
      console.log('Shipment created from template:', shipment);
      alert('Shipment created successfully!');
    } catch (err) {
      console.error('Error creating shipment from template:', err);
      setError('Failed to create shipment from template');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      from: {
        street: '',
        city: '',
        postalCode: '',
        country: 'Netherlands'
      },
      to: {
        street: '',
        city: '',
        postalCode: '',
        country: 'Netherlands'
      },
      pallets: {
        quantity: 1,
        dimensions: { length: 120, width: 80, height: 144 },
        weight: 1000
      },
      adrRequired: false,
      constraints: {
        tailLiftRequired: false,
        forkliftRequired: false,
        indoorDelivery: false,
        appointmentRequired: false
      },
      notes: '',
      priceGuidance: { min: 0, max: 0, currency: 'EUR' }
    });
    setEditingTemplate(null);
    setShowForm(false);
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
        <p className="text-gray-600 mb-4">Please log in to view and manage your shipment templates.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Templates</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shipment Templates</h2>
          <p className="text-gray-600">Create reusable templates for your common shipments</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </button>
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Yet</h3>
          <p className="text-gray-600 mb-4">Create your first template to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(template)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(template)}
                    className="p-1 text-gray-400 hover:text-green-600"
                    title="Duplicate"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{template.from.city} → {template.to.city}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="h-4 w-4 mr-2" />
                  <span>{template.pallets.quantity} pallets</span>
                </div>
                {template.adrRequired && (
                  <div className="flex items-center text-sm text-orange-600">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span>ADR Required</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleCreateFromTemplate(template)}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                >
                  Create Shipment
                </button>
                <span className="text-xs text-gray-500">
                  Updated {new Date(template.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Template Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">From Address</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={formData.from.street}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        from: { ...prev.from, street: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.from.city}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          from: { ...prev.from, city: e.target.value }
                        }))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Postal Code"
                        value={formData.from.postalCode}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          from: { ...prev.from, postalCode: e.target.value }
                        }))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">To Address</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={formData.to.street}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        to: { ...prev.to, street: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.to.city}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          to: { ...prev.to, city: e.target.value }
                        }))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Postal Code"
                        value={formData.to.postalCode}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          to: { ...prev.to, postalCode: e.target.value }
                        }))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pallet Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Pallet Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.pallets.quantity}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        pallets: { ...prev.pallets, quantity: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.pallets.weight}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        pallets: { ...prev.pallets, weight: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dimensions (cm)
                    </label>
                    <input
                      type="text"
                      placeholder="120x80x144"
                      value={`${formData.pallets.dimensions.length}x${formData.pallets.dimensions.width}x${formData.pallets.dimensions.height}`}
                      onChange={(e) => {
                        const [length, width, height] = e.target.value.split('x').map(Number);
                        if (length && width && height) {
                          setFormData(prev => ({ 
                            ...prev, 
                            pallets: { 
                              ...prev.pallets, 
                              dimensions: { length, width, height }
                            }
                          }));
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Constraints */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Special Requirements</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { key: 'adrRequired', label: 'ADR Required' },
                    { key: 'tailLiftRequired', label: 'Tail Lift' },
                    { key: 'forkliftRequired', label: 'Forklift' },
                    { key: 'indoorDelivery', label: 'Indoor Delivery' },
                    { key: 'appointmentRequired', label: 'Appointment Required' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData[key as keyof typeof formData] as boolean}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          [key]: e.target.checked
                        }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes or special instructions..."
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingTemplate ? 'Update Template' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentTemplates;