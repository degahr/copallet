import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useShipment } from '../../contexts/ShipmentContext';
import { Rating, Review } from '../../types';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  Truck, 
  Package,
  User,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Send
} from 'lucide-react';

const RatingSystem: React.FC = () => {
  const { user } = useAuth();
  const { shipments } = useShipment();
  const [selectedShipment, setSelectedShipment] = useState<string>('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [categories, setCategories] = useState({
    communication: 0,
    punctuality: 0,
    care: 0,
    professionalism: 0
  });

  // Mock reviews data
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      shipmentId: '1',
      reviewerId: 'shipper-1',
      revieweeId: 'carrier-1',
      rating: 5,
      categories: {
        communication: 5,
        punctuality: 4,
        care: 5,
        professionalism: 5
      },
      comment: 'Excellent service! Very professional and delivered on time.',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      shipmentId: '2',
      reviewerId: 'shipper-2',
      revieweeId: 'carrier-1',
      rating: 4,
      categories: {
        communication: 4,
        punctuality: 5,
        care: 4,
        professionalism: 4
      },
      comment: 'Good delivery, minor communication issues but overall satisfied.',
      createdAt: new Date('2024-01-20')
    }
  ]);

  // Mock ratings data
  const [ratings] = useState<Rating[]>([
    {
      id: '1',
      carrierId: 'carrier-1',
      averageRating: 4.5,
      totalReviews: 12,
      categoryRatings: {
        communication: 4.3,
        punctuality: 4.7,
        care: 4.4,
        professionalism: 4.6
      },
      lastUpdated: new Date('2024-01-20')
    }
  ]);

  const completedShipments = shipments.filter(s => s.status === 'delivered');
  const userRatings = ratings.find(r => r.carrierId === user?.id);
  const userReviews = reviews.filter(r => r.revieweeId === user?.id);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment || rating === 0) return;

    const newReview: Review = {
      id: Date.now().toString(),
      shipmentId: selectedShipment,
      reviewerId: user?.id || '',
      revieweeId: 'carrier-1', // In real app, get from shipment
      rating,
      categories,
      comment: review,
      createdAt: new Date()
    };

    console.log('Submitting review:', newReview);
    alert('Review submitted successfully!');
    
    // Reset form
    setSelectedShipment('');
    setRating(0);
    setReview('');
    setCategories({
      communication: 0,
      punctuality: 0,
      care: 0,
      professionalism: 0
    });
  };

  const renderStars = (value: number, onChange?: (value: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            className={`h-5 w-5 ${
              star <= value ? 'text-yellow-400' : 'text-gray-300'
            } ${onChange ? 'hover:text-yellow-400' : ''}`}
          >
            <Star className="h-full w-full fill-current" />
          </button>
        ))}
      </div>
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-100';
    if (rating >= 3.5) return 'text-yellow-600 bg-yellow-100';
    if (rating >= 2.5) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Star className="h-8 w-8 mr-3 text-yellow-600" />
            Rating & Review System
          </h1>
          <p className="text-gray-600 mt-2">
            Rate carriers and view performance feedback
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Overall Rating */}
          {userRatings && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Rating</h2>
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl font-bold text-gray-900">
                      {userRatings.averageRating.toFixed(1)}
                    </div>
                    <div>
                      {renderStars(Math.round(userRatings.averageRating))}
                      <p className="text-sm text-gray-600 mt-1">
                        Based on {userRatings.totalReviews} reviews
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getRatingColor(userRatings.averageRating)}`}>
                    {userRatings.averageRating >= 4.5 ? 'Excellent' :
                     userRatings.averageRating >= 3.5 ? 'Good' :
                     userRatings.averageRating >= 2.5 ? 'Average' : 'Needs Improvement'}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Last updated: {new Date(userRatings.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Category Breakdown */}
          {userRatings && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(userRatings.categoryRatings).map(([category, score]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {category === 'communication' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                        {category === 'punctuality' && <Clock className="h-4 w-4 text-green-600" />}
                        {category === 'care' && <Package className="h-4 w-4 text-purple-600" />}
                        {category === 'professionalism' && <User className="h-4 w-4 text-orange-600" />}
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderStars(Math.round(score))}
                      <span className="text-sm font-medium text-gray-900 w-8">
                        {score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Review Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Shipment *
                </label>
                <select
                  value={selectedShipment}
                  onChange={(e) => setSelectedShipment(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choose a completed shipment</option>
                  {completedShipments.map((shipment) => (
                    <option key={shipment.id} value={shipment.id}>
                      #{shipment.id.slice(-8)} - {shipment.from.city} → {shipment.to.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating *
                </label>
                {renderStars(rating, setRating)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Category Ratings
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(categories).map(([category, score]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {category}
                      </span>
                      {renderStars(score, (value) => 
                        setCategories(prev => ({ ...prev, [category]: value }))
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Comment
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Share your experience with this carrier..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!selectedShipment || rating === 0}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Review
                </button>
              </div>
            </form>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h3>
            <div className="space-y-4">
              {userReviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h4>
                  <p className="text-gray-600">Complete deliveries to start receiving reviews.</p>
                </div>
              ) : (
                userReviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Shipment #{review.shipmentId.slice(-8)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {renderStars(review.rating)}
                        <span className="text-sm font-medium text-gray-900">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                    
                    {review.comment && (
                      <p className="text-sm text-gray-700 mb-3">{review.comment}</p>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(review.categories).map(([category, score]) => (
                        <div key={category} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 capitalize">{category}</span>
                          <div className="flex items-center space-x-1">
                            {renderStars(score)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingSystem;
