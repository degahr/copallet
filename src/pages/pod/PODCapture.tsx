import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShipment } from '../../contexts/ShipmentContext';
import { POD } from '../../types';
import { 
  Camera, 
  Upload, 
  CheckCircle, 
  X, 
  User, 
  FileText,
  ArrowLeft,
  Save
} from 'lucide-react';

const PODCapture: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { createPOD } = useShipment();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [signature, setSignature] = useState<string>('');
  const [recipientName, setRecipientName] = useState('');
  const [notes, setNotes] = useState('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos(prev => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSignatureCapture = () => {
    // In a real app, this would open a signature pad component
    // For now, we'll simulate a signature
    setSignature('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjY2NjIi8+PHRleHQgeD0iMTAwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzMzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TaWduYXR1cmU8L3RleHQ+PC9zdmc+');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) return;

    setLoading(true);
    try {
      await createPOD({
        shipmentId: id!,
        photos,
        signature,
        recipientName,
        timestamp: new Date(),
        notes
      });
      
      // Reset form
      setPhotos([]);
      setSignature('');
      setRecipientName('');
      setNotes('');
      
      alert('POD captured successfully!');
    } catch (error) {
      console.error('Failed to capture POD:', error);
      alert('Failed to capture POD. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <Link 
              to={`/app/shipments/${id}`}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                Proof of Delivery
              </h1>
              <p className="text-gray-600">Shipment #{id?.slice(-8)}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Recipient Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Recipient Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter recipient name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Time
                </label>
                <input
                  type="datetime-local"
                  value={new Date().toISOString().slice(0, 16)}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Photo Capture */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Delivery Photos
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> delivery photos
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Delivery photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Digital Signature */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Digital Signature
            </h2>
            
            <div className="space-y-4">
              <div className="border-2 border-gray-300 border-dashed rounded-lg p-8 text-center">
                {signature ? (
                  <div className="space-y-4">
                    <img
                      src={signature}
                      alt="Digital signature"
                      className="mx-auto border border-gray-300 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setSignature('')}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Clear Signature
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-lg font-medium">No signature captured</p>
                      <p className="text-sm">Click below to capture recipient signature</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSignatureCapture}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      Capture Signature
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Any additional delivery notes or comments..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={loading || !recipientName.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Capturing POD...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Complete Delivery
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PODCapture;
