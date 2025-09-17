import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Phone, Mail, MessageSquare, Clock } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  carrier: {
    id: string;
    name: string;
    company: string;
    rating: number;
    phone?: string;
    email?: string;
  };
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system';
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  carrier
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = 'current-user'; // In a real app, this would come from auth context

  useEffect(() => {
    if (isOpen) {
      // Initialize with a welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        senderId: 'system',
        senderName: 'System',
        content: `You're now connected with ${carrier.name} from ${carrier.company}. How can we help you today?`,
        timestamp: new Date(),
        type: 'system'
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, carrier]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: 'You',
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate carrier response
    setTimeout(() => {
      const responses = [
        "Thank you for your message. I'll get back to you shortly.",
        "I understand your requirements. Let me check our availability.",
        "That sounds good. I can provide you with a quote for this shipment.",
        "I'll need to verify some details. Can you provide more information about the pickup location?",
        "Our team will review your request and get back to you within 2 hours.",
        "I can help you with that. What's your preferred pickup time?",
        "Thank you for considering our services. I'll prepare a detailed quote for you."
      ];

      const carrierMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: carrier.id,
        senderName: carrier.name,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, carrierMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {carrier.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{carrier.name}</h3>
              <p className="text-sm text-gray-600">{carrier.company}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {carrier.phone && (
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                <Phone className="h-4 w-4" />
              </button>
            )}
            {carrier.email && (
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                <Mail className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'system'
                  ? 'bg-yellow-100 text-yellow-800 mx-auto text-center'
                  : message.senderId === currentUserId
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900'
              }`}>
                {message.type !== 'system' && (
                  <div className="text-xs font-medium mb-1 opacity-75">
                    {message.senderName}
                  </div>
                )}
                <div className="text-sm">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.senderId === currentUserId ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-1">
                  <span className="text-sm">{carrier.name} is typing</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
