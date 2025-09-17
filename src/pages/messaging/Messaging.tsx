import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShipment } from '../../contexts/ShipmentContext';
import { useAuth } from '../../contexts/AuthContext';
import { Message } from '../../types';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Image, 
  User,
  Clock,
  ArrowLeft
} from 'lucide-react';

const Messaging: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { messages, sendMessage } = useShipment();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const shipmentMessages = messages.filter(msg => msg.shipmentId === id);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    try {
      await sendMessage({
        shipmentId: id!,
        senderId: user?.id || '',
        content: newMessage,
        attachments: attachments.map(file => file.name) // In real app, upload files
      });
      
      setNewMessage('');
      setAttachments([]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Shipment Messages
                </h1>
                <p className="text-sm text-gray-600">Shipment #{id?.slice(-8)}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {shipmentMessages.length} messages
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {shipmentMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600">Start a conversation about this shipment</p>
            </div>
          ) : (
            shipmentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === user?.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        message.senderId === user?.id
                          ? 'bg-primary-700'
                          : 'bg-gray-200'
                      }`}>
                        <User className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((attachment, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 text-xs opacity-75"
                            >
                              <Paperclip className="h-3 w-3" />
                              <span>{attachment}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-75">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-6">
          <form onSubmit={handleSendMessage} className="space-y-4">
            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg text-sm"
                  >
                    <Paperclip className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex space-x-3">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  rows={3}
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <Paperclip className="h-5 w-5 text-gray-600" />
                </label>
                
                <button
                  type="submit"
                  disabled={!newMessage.trim() && attachments.length === 0}
                  className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
