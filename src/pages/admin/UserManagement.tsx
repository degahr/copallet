import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, UserRole } from '../../types';
import { 
  Users, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Eye,
  Search,
  Download,
  AlertTriangle
} from 'lucide-react';

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock users data - in a real app, this would come from an API
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'shipper@example.com',
      role: 'shipper',
      company: 'ABC Logistics',
      verificationStatus: 'approved',
      rating: 4.8,
      createdAt: new Date('2024-01-15'),
      profile: {
        firstName: 'John',
        lastName: 'Smith',
        phone: '+31 6 1234 5678',
        address: {
          street: '123 Business St',
          city: 'Amsterdam',
          postalCode: '1012 AB',
          country: 'Netherlands'
        }
      }
    },
    {
      id: '2',
      email: 'carrier@example.com',
      role: 'carrier',
      company: 'Fast Transport BV',
      verificationStatus: 'pending',
      rating: 4.5,
      createdAt: new Date('2024-01-20'),
      profile: {
        firstName: 'Maria',
        lastName: 'Garcia',
        phone: '+31 6 8765 4321',
        address: {
          street: '456 Transport Ave',
          city: 'Rotterdam',
          postalCode: '3011 AA',
          country: 'Netherlands'
        }
      }
    },
    {
      id: '3',
      email: 'dispatcher@example.com',
      role: 'dispatcher',
      company: 'Fleet Management Co',
      verificationStatus: 'approved',
      rating: 4.9,
      createdAt: new Date('2024-01-10'),
      profile: {
        firstName: 'David',
        lastName: 'Johnson',
        phone: '+31 6 5555 1234',
        address: {
          street: '789 Fleet St',
          city: 'Utrecht',
          postalCode: '3528 AB',
          country: 'Netherlands'
        }
      }
    },
    {
      id: '4',
      email: 'shipper2@example.com',
      role: 'shipper',
      company: 'Global Shipping Ltd',
      verificationStatus: 'rejected',
      rating: 3.2,
      createdAt: new Date('2024-01-25'),
      profile: {
        firstName: 'Sarah',
        lastName: 'Wilson',
        phone: '+31 6 9999 8888',
        address: {
          street: '321 Commerce Blvd',
          city: 'The Hague',
          postalCode: '2511 CV',
          country: 'Netherlands'
        }
      }
    },
    {
      id: '5',
      email: 'carrier2@example.com',
      role: 'carrier',
      company: 'Euro Logistics',
      verificationStatus: 'pending',
      rating: 4.7,
      createdAt: new Date('2024-01-28'),
      profile: {
        firstName: 'Ahmed',
        lastName: 'Hassan',
        phone: '+31 6 7777 6666',
        address: {
          street: '654 Freight Way',
          city: 'Eindhoven',
          postalCode: '5611 AB',
          country: 'Netherlands'
        }
      }
    }
  ]);

  const handleVerificationAction = (userId: string, action: 'approve' | 'reject') => {
    // In a real app, this would make an API call
    console.log(`${action} verification for user ${userId}`);
    
    // Update local state
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, verificationStatus: action === 'approve' ? 'approved' : 'rejected' }
        : user
    ));
    
    alert(`Verification ${action}d for user ${userId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'shipper': return 'text-blue-600 bg-blue-100';
      case 'carrier': return 'text-green-600 bg-green-100';
      case 'dispatcher': return 'text-purple-600 bg-purple-100';
      case 'admin': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile?.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const analytics = {
    totalUsers: users.length,
    verifiedUsers: users.filter(u => u.verificationStatus === 'approved').length,
    pendingVerifications: users.filter(u => u.verificationStatus === 'pending').length,
    rejectedUsers: users.filter(u => u.verificationStatus === 'rejected').length,
    averageRating: users.reduce((sum, u) => sum + u.rating, 0) / users.length
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access user management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage platform users and verification status</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export Users
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.verifiedUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Shield className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.pendingVerifications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.rejectedUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.profile?.firstName} {user.profile?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.company}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.verificationStatus)}`}>
                      {user.verificationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.rating}/5.0
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900" title="View Details">
                      <Eye className="h-4 w-4" />
                    </button>
                    {user.verificationStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => handleVerificationAction(user.id, 'approve')}
                          className="text-green-600 hover:text-green-900"
                          title="Approve Verification"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleVerificationAction(user.id, 'reject')}
                          className="text-red-600 hover:text-red-900"
                          title="Reject Verification"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No users found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
