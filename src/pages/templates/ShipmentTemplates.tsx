import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ShipmentTemplate } from '../../types';
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
  const [templates, setTemplates] = useState<ShipmentTemplate[]>([
    {
      id: '1',
      shipperId: user?.id || '',
      name: 'Amsterdam-Rotterdam Standard',
      description: 'Regular pallet transport between Amsterdam and Rotterdam',
      from: {
        street: '123 Business Park',
        city: 'Amsterdam',
        postalCode: '1012 AB',
        country: 'Netherlands'
      },
      to: {
        street: '456 Industrial Zone',
        city: 'Rotterdam',
        postalCode: '3011 AA',
        country: 'Netherlands'
      },
      pallets: {
        quantity: 8,
        dimensions: { length: 120, width: 80, height: 144 },
        weight: 1200
      },
      adrRequired: false,
      constraints: {
        tailLiftRequired: true,
        forkliftRequired: false,
        indoorDelivery: false,
        appointmentRequired: true
      },
      notes: 'Standard delivery requirements',
      priceGuidance: { min: 450, max: 650, currency: 'EUR' },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      shipperId: user?.id || '',
      name: 'Utrecht-Eindhoven ADR',
      description: 'ADR shipment for dangerous goods transport',
      from: {
        street: '789 Logistics Center',
        city: 'Utrecht',
        postalCode: '3528 AB',
        country: 'Netherlands'
      },
      to: {
        street: '321 Distribution Hub',
        city: 'Eindhoven',
        postalCode: '5611 AA',
        country: 'Netherlands'
      },
      pallets: {
        quantity: 12,
        dimensions: { length: 120, width: 80, height: 144 },
        weight: 1800
      },
      adrRequired: true,
      constraints: {
        tailLiftRequired: false,
        forkliftRequired: true,
        indoorDelivery: true,
        appointmentRequired: false
      },
      notes: 'ADR Class 3 - Flammable liquids. Special handling required.',
      priceGuidance: { min: 750, max: 950, currency: 'EUR' },
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    }
  ]);

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
      weight: 100
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTemplate: ShipmentTemplate = {
      id: editingTemplate?.id || Date.now().toString(),
      shipperId: user?.id || '',
      ...formData,
      createdAt: editingTemplate?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (editingTemplate) {
      setTemplates(prev => prev.map(template => template.id === editingTemplate.id ? newTemplate : template));
    } else {
      setTemplates(prev => [...prev, newTemplate]);
    }

    resetForm();
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

  const handleDelete = (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(template => template.id !== templateId));
    }
  };

  const handleDuplicate = (template: ShipmentTemplate) => {
    const duplicatedTemplate: ShipmentTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTemplates(prev => [...prev, duplicatedTemplate]);
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
        weight: 100
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

  if (user?.role !== 'shipper') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">Shipment templates are only available for shippers.</p>
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
                <Package className="h-8 w-8 mr-3 text-blue-600" />
                Shipment Templates
              </h1>
              <p className="text-gray-600 mt-2">
                Create reusable templates for your frequent shipments
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Yet</h3>
                <p className="text-gray-600 mb-4">Create your first shipment template to save time on future shipments.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Create First Template
                </button>
              </div>
            ) : (
              templates.map((template) => (
                <div key={template.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {template.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleDuplicate(template)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(template)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-md"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {template.from.city} → {template.to.city}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {template.pallets.quantity} pallets, {template.pallets.weight}kg
                      </span>
                    </div>

                    {template.adrRequired && (
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600">ADR Required</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        Updated: {new Date(template.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm">
                      Use Template
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingTemplate ? 'Edit Template' : 'Create Template'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-gray-100 rounded-md"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Template Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., Amsterdam-Rotterdam Standard"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Brief description of this template"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From Address *
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          required
                          value={formData.from.street}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            from: { ...prev.from, street: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Street address"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            value={formData.from.city}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              from: { ...prev.from, city: e.target.value }
                            }))}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="City"
                          />
                          <input
                            type="text"
                            required
                            value={formData.from.postalCode}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              from: { ...prev.from, postalCode: e.target.value }
                            }))}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Postal code"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Address *
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          required
                          value={formData.to.street}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            to: { ...prev.to, street: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Street address"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            value={formData.to.city}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              to: { ...prev.to, city: e.target.value }
                            }))}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="City"
                          />
                          <input
                            type="text"
                            required
                            value={formData.to.postalCode}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              to: { ...prev.to, postalCode: e.target.value }
                            }))}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Postal code"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pallet Quantity *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.pallets.quantity}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          pallets: { ...prev.pallets, quantity: Number(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (kg) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.pallets.weight}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          pallets: { ...prev.pallets, weight: Number(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="flex items-center space-x-4 pt-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.adrRequired}
                          onChange={(e) => setFormData(prev => ({ ...prev, adrRequired: e.target.checked }))}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">ADR Required</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Price (€)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.priceGuidance.min}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          priceGuidance: { ...prev.priceGuidance, min: Number(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Price (€)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.priceGuidance.max}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          priceGuidance: { ...prev.priceGuidance, max: Number(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Additional notes or special requirements..."
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
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
      </div>
    </div>
  );
};

export default ShipmentTemplates;
