import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Upload, 
  FileText, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Save,
  Eye,
  Download,
  X,
  Camera,
  File
} from 'lucide-react';

const CarrierVerification: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState({
    license: null as File | null,
    vat: null as File | null,
    insurance: null as File | null,
    adr: null as File | null
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const documentTypes = [
    {
      key: 'license' as keyof typeof documents,
      title: 'Driver License',
      description: 'Valid driver license for commercial vehicles',
      required: true,
      acceptedTypes: '.pdf,.jpg,.png',
      icon: File
    },
    {
      key: 'vat' as keyof typeof documents,
      title: 'VAT Registration',
      description: 'VAT registration certificate',
      required: true,
      acceptedTypes: '.pdf,.jpg,.png',
      icon: FileText
    },
    {
      key: 'insurance' as keyof typeof documents,
      title: 'Insurance Certificate',
      description: 'Commercial vehicle insurance certificate',
      required: true,
      acceptedTypes: '.pdf,.jpg,.png',
      icon: Shield
    },
    {
      key: 'adr' as keyof typeof documents,
      title: 'ADR Certificate',
      description: 'Dangerous goods transport certificate (if applicable)',
      required: false,
      acceptedTypes: '.pdf,.jpg,.png',
      icon: AlertCircle
    }
  ];

  const handleFileUpload = async (type: keyof typeof documents, file: File) => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate file upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setDocuments(prev => ({
              ...prev,
              [type]: file
            }));
            setUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // In a real app, upload files to server and submit for verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Documents uploaded successfully! Your verification is under review.');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeDocument = (type: keyof typeof documents) => {
    setDocuments(prev => ({
      ...prev,
      [type]: null
    }));
  };

  const getVerificationStatus = () => {
    if (user?.verificationStatus === 'approved') {
      return { status: 'approved', color: 'green', icon: CheckCircle };
    } else if (user?.verificationStatus === 'rejected') {
      return { status: 'rejected', color: 'red', icon: AlertCircle };
    } else {
      return { status: 'pending', color: 'yellow', icon: AlertCircle };
    }
  };

  const verificationStatus = getVerificationStatus();
  const StatusIcon = verificationStatus.icon;

  const requiredDocumentsUploaded = documentTypes
    .filter(doc => doc.required)
    .every(doc => documents[doc.key] !== null);

  if (user?.role !== 'carrier' && user?.role !== 'dispatcher') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">Carrier verification is only available for carriers and dispatchers.</p>
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
                <Shield className="h-8 w-8 mr-3 text-blue-600" />
                Carrier Verification
              </h1>
              <p className="text-gray-600 mt-2">
                Upload your documents to get verified as a carrier
              </p>
            </div>
            
            <div className={`flex items-center px-4 py-2 rounded-lg ${
              verificationStatus.color === 'green' ? 'bg-green-100 text-green-800' :
              verificationStatus.color === 'red' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              <StatusIcon className="h-5 w-5 mr-2" />
              <span className="font-medium capitalize">{verificationStatus.status}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Verification Status */}
          {user?.verificationStatus === 'approved' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-green-900">Verification Complete</h3>
                  <p className="text-green-700">
                    Your carrier account has been verified. You can now bid on shipments and access all platform features.
                  </p>
                </div>
              </div>
            </div>
          )}

          {user?.verificationStatus === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center">
                <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-red-900">Verification Rejected</h3>
                  <p className="text-red-700">
                    Your verification was rejected. Please review your documents and resubmit.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Document Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Required Documents
            </h2>

            <div className="space-y-6">
              {documentTypes.map((doc) => {
                const Icon = doc.icon;
                const isUploaded = documents[doc.key] !== null;
                
                return (
                  <div key={doc.key} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          isUploaded ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            isUploaded ? 'text-green-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 flex items-center">
                            {doc.title}
                            {doc.required && <span className="text-red-500 ml-1">*</span>}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Accepted formats: {doc.acceptedTypes}
                          </p>
                        </div>
                      </div>
                      
                      {isUploaded && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-green-600 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Uploaded
                          </span>
                          <button
                            type="button"
                            onClick={() => removeDocument(doc.key)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        id={doc.key}
                        accept={doc.acceptedTypes}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(doc.key, file);
                        }}
                        className="hidden"
                        disabled={uploading}
                      />
                      
                      <label
                        htmlFor={doc.key}
                        className={`flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                          isUploaded 
                            ? 'border-green-300 bg-green-50 hover:bg-green-100' 
                            : 'border-gray-300 hover:bg-gray-50'
                        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="text-center">
                          {uploading && uploadProgress > 0 ? (
                            <div className="space-y-2">
                              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                              <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">
                                {isUploaded ? 'Replace file' : 'Click to upload'}
                              </p>
                              {isUploaded && documents[doc.key] && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {documents[doc.key]?.name}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  * Required documents must be uploaded before submission
                </div>
                
                <button
                  type="submit"
                  disabled={uploading || !requiredDocumentsUploaded}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Submit for Verification
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Help Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Ensure all documents are clear and legible</p>
              <p>• Documents must be valid and not expired</p>
              <p>• ADR certificate is only required if you plan to transport dangerous goods</p>
              <p>• Verification typically takes 1-2 business days</p>
              <p>• Contact support if you have questions about document requirements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarrierVerification;