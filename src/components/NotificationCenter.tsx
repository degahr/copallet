import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Notification, NotificationType } from '../types';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  MessageSquare,
  Truck,
  Package,
  Euro,
  Clock
} from 'lucide-react';

const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([
    // Sample notifications
    {
      id: '1',
      userId: user?.id || '',
      type: 'new_bid',
      title: 'New Bid Received',
      message: 'You received a bid of €450 for Shipment #12345678',
      shipmentId: '1',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      userId: user?.id || '',
      type: 'bid_accepted',
      title: 'Bid Accepted',
      message: 'Your bid for Shipment #87654321 has been accepted',
      shipmentId: '2',
      read: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: '3',
      userId: user?.id || '',
      type: 'eta_update',
      title: 'ETA Update',
      message: 'Shipment #12345678 is running 30 minutes ahead of schedule',
      shipmentId: '1',
      read: true,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      id: '4',
      userId: user?.id || '',
      type: 'delivery_complete',
      title: 'Delivery Complete',
      message: 'Shipment #87654321 has been successfully delivered',
      shipmentId: '2',
      read: true,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'new_bid':
        return <Euro className="h-5 w-5 text-green-600" />;
      case 'bid_accepted':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'bid_declined':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'shipment_assigned':
        return <Truck className="h-5 w-5 text-purple-600" />;
      case 'eta_update':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'delivery_complete':
        return <Package className="h-5 w-5 text-green-600" />;
      case 'message_received':
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'new_bid':
        return 'border-l-green-500';
      case 'bid_accepted':
        return 'border-l-blue-500';
      case 'bid_declined':
        return 'border-l-red-500';
      case 'shipment_assigned':
        return 'border-l-purple-500';
      case 'eta_update':
        return 'border-l-yellow-500';
      case 'delivery_complete':
        return 'border-l-green-500';
      case 'message_received':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No notifications</h4>
                <p className="text-gray-600">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${getNotificationColor(notification.type)} ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.createdAt)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100"
                            >
                              <X className="h-3 w-3 text-gray-400" />
                            </button>
                          </div>
                        </div>
                        
                        <p className={`text-sm mt-1 ${
                          !notification.read ? 'text-gray-800' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        
                        {notification.shipmentId && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Shipment #{notification.shipmentId.slice(-8)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 bg-primary-600 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationCenter;
