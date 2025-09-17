import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AutoBidRule } from '../../types';
import { 
  Plus, 
  Trash2, 
  Edit, 
  MapPin, 
  Euro, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings,
  Save,
  X
} from 'lucide-react';

const AutoBidRules: React.FC = () => {
  const { user } = useAuth();
  const [rules, setRules] = useState<AutoBidRule[]>([
    {
      id: '1',
      carrierId: user?.id || '',
      name: 'Amsterdam-Rotterdam Route',
      fromCity: 'Amsterdam',
      toCity: 'Rotterdam',
      maxRadius: 50,
      minMarginPercent: 15,
      adrAllowed: false,
      maxBidAmount: 500,
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      carrierId: user?.id || '',
      name: 'Utrecht-Eindhoven ADR',
      fromCity: 'Utrecht',
      toCity: 'Eindhoven',
      maxRadius: 75,
      minMarginPercent: 20,
      adrAllowed: true,
      maxBidAmount: 800,
      isActive: false,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoBidRule | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    fromCity: '',
    toCity: '',
    maxRadius: 50,
    minMarginPercent: 15,
    adrAllowed: false,
    maxBidAmount: 500,
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRule: AutoBidRule = {
      id: editingRule?.id || Date.now().toString(),
      carrierId: user?.id || '',
      ...formData,
      createdAt: editingRule?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (editingRule) {
      setRules(prev => prev.map(rule => rule.id === editingRule.id ? newRule : rule));
    } else {
      setRules(prev => [...prev, newRule]);
    }

    resetForm();
  };

  const handleEdit = (rule: AutoBidRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      fromCity: rule.fromCity,
      toCity: rule.toCity,
      maxRadius: rule.maxRadius,
      minMarginPercent: rule.minMarginPercent,
      adrAllowed: rule.adrAllowed,
      maxBidAmount: rule.maxBidAmount,
      isActive: rule.isActive
    });
    setShowForm(true);
  };

  const handleDelete = (ruleId: string) => {
    if (window.confirm('Are you sure you want to delete this auto-bid rule?')) {
      setRules(prev => prev.filter(rule => rule.id !== ruleId));
    }
  };

  const toggleRuleStatus = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      fromCity: '',
      toCity: '',
      maxRadius: 50,
      minMarginPercent: 15,
      adrAllowed: false,
      maxBidAmount: 500,
      isActive: true
    });
    setEditingRule(null);
    setShowForm(false);
  };

  if (user?.role !== 'carrier' && user?.role !== 'dispatcher') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">Auto-bid rules are only available for carriers and dispatchers.</p>
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
                <Settings className="h-8 w-8 mr-3 text-blue-600" />
                Auto-Bid Rules
              </h1>
              <p className="text-gray-600 mt-2">
                Set up automatic bidding rules for your preferred routes
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Rule
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Rules List */}
          <div className="space-y-4">
            {rules.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Auto-Bid Rules</h3>
                <p className="text-gray-600 mb-4">Create your first auto-bid rule to start automatically bidding on shipments.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Create First Rule
                </button>
              </div>
            ) : (
              rules.map((rule) => (
                <div key={rule.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        rule.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleRuleStatus(rule.id)}
                        className={`p-2 rounded-md ${
                          rule.isActive 
                            ? 'text-yellow-600 hover:bg-yellow-100' 
                            : 'text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {rule.isActive ? <Clock className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(rule)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(rule.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Route</p>
                        <p className="text-sm font-medium">{rule.fromCity} → {rule.toCity}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Euro className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Max Bid</p>
                        <p className="text-sm font-medium">€{rule.maxBidAmount}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Min Margin</p>
                        <p className="text-sm font-medium">{rule.minMarginPercent}%</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">ADR Allowed</p>
                        <p className="text-sm font-medium">{rule.adrAllowed ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Radius: {rule.maxRadius}km</span>
                      <span>Updated: {new Date(rule.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingRule ? 'Edit Auto-Bid Rule' : 'Create Auto-Bid Rule'}
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
                        Rule Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., Amsterdam-Rotterdam Route"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Bid Amount (€) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="10"
                        value={formData.maxBidAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxBidAmount: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From City *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fromCity}
                        onChange={(e) => setFormData(prev => ({ ...prev, fromCity: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., Amsterdam"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To City *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.toCity}
                        onChange={(e) => setFormData(prev => ({ ...prev, toCity: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., Rotterdam"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Radius (km) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="200"
                        value={formData.maxRadius}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxRadius: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Margin (%) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        max="50"
                        step="0.1"
                        value={formData.minMarginPercent}
                        onChange={(e) => setFormData(prev => ({ ...prev, minMarginPercent: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.adrAllowed}
                        onChange={(e) => setFormData(prev => ({ ...prev, adrAllowed: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">ADR shipments allowed</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Rule is active</span>
                    </label>
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
                      {editingRule ? 'Update Rule' : 'Create Rule'}
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

export default AutoBidRules;
