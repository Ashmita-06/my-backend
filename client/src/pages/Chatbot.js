import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { chatbotAPI } from '../services/api';
import { Send, Bot, User, Loader, Lightbulb, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI assistant for carbon emissions reduction. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const { data: suggestions } = useQuery(
    'chatbot-suggestions',
    () => chatbotAPI.getSuggestions('plant-1'),
    {
      staleTime: 300000 // 5 minutes
    }
  );

  const { data: faq } = useQuery(
    'chatbot-faq',
    () => chatbotAPI.getFAQ(),
    {
      staleTime: 600000 // 10 minutes
    }
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatbotAPI.chat({
        message,
        plantId: 'plant-1',
        context: 'carbon_emissions'
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast.error('Failed to get response from AI assistant');
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleFAQClick = (question) => {
    handleSendMessage(question);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            AI Assistant
          </h1>
          <p className="text-secondary-600">
            Get expert advice on carbon emissions reduction and plant optimization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="card h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="card-header">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-success-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">CarbonEmission AI</h3>
                    <p className="text-sm text-secondary-600">Online • Ready to help</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex gap-3 ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.type === 'bot' && (
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary-600" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-secondary-100 text-secondary-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-primary-100' : 'text-secondary-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>

                      {message.type === 'user' && (
                        <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-secondary-600" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="bg-secondary-100 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Loader className="w-4 h-4 animate-spin text-primary-600" />
                        <span className="text-sm text-secondary-600">AI is thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="card-footer">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about emissions reduction, cost optimization, or plant efficiency..."
                    className="flex-1 form-input"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputMessage.trim()}
                    className="btn btn-primary"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Suggestions */}
            {suggestions && (
              <div className="card">
                <div className="card-header">
                  <h3 className="font-semibold text-secondary-900 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Quick Suggestions
                  </h3>
                </div>
                <div className="card-body">
                  <div className="space-y-2">
                    {suggestions.data.suggestions?.slice(0, 5).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.title)}
                        className="w-full text-left p-3 rounded-lg hover:bg-secondary-50 transition-colors text-sm"
                      >
                        <div className="font-medium text-secondary-900">
                          {suggestion.title}
                        </div>
                        <div className="text-xs text-secondary-600 mt-1">
                          {suggestion.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* FAQ */}
            {faq && (
              <div className="card">
                <div className="card-header">
                  <h3 className="font-semibold text-secondary-900 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Frequently Asked
                  </h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    {faq.data.faq?.slice(0, 3).map((category, categoryIndex) => (
                      <div key={categoryIndex}>
                        <h4 className="text-sm font-medium text-secondary-700 mb-2">
                          {category.category}
                        </h4>
                        <div className="space-y-1">
                          {category.questions.slice(0, 2).map((q, qIndex) => (
                            <button
                              key={qIndex}
                              onClick={() => handleFAQClick(q.question)}
                              className="w-full text-left p-2 rounded hover:bg-secondary-50 transition-colors text-xs"
                            >
                              {q.question}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chatbot;
