import React, { useState, useEffect, useRef } from 'react';
import { recipeAPI, inventoryAPI } from '../services/api';
import ChatMessage from '../components/Chat/ChatMessage';
import ChatInput from '../components/Chat/ChatInput';

const RecipeChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchInventory();
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchInventory = async () => {
    try {
      const response = await inventoryAPI.getAllItems();
      setInventory(response.data.data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  };

  const initializeChat = () => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'bot',
      content: `Hello! I'm your kitchen assistant. I can help you with recipes, cooking tips, and suggestions based on your current inventory. 

What would you like to cook today?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      // Send message to API
      const response = await recipeAPI.chatAboutRecipes(messageText);
      
      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    initializeChat();
  };

  const quickQuestions = [
    "What can I cook with my current ingredients?",
    "Suggest a quick 30-minute recipe",
    "What's a healthy breakfast option?",
    "How do I use leftover vegetables?",
    "Give me a vegetarian dinner idea"
  ];

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        {/* Chat Area */}
        <div className="col-md-8">
          <div className="card h-100 d-flex flex-column">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Recipe Chat Assistant</h5>
                <small className="text-muted">
                  Ask me anything about cooking and recipes!
                </small>
              </div>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={clearChat}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Clear Chat
              </button>
            </div>

            {/* Messages Area */}
            <div className="card-body flex-grow-1 overflow-auto" style={{ height: '60vh' }}>
              <div className="messages-container">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                
                {loading && (
                  <div className="d-flex justify-content-start mb-3">
                    <div className="bg-light rounded p-3">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
              <div className="card-body border-top">
                <h6 className="text-muted mb-2">Quick Questions:</h6>
                <div className="d-flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleSendMessage(question)}
                      disabled={loading}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="card-footer">
              <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-md-4">
          {/* Current Inventory */}
          <div className="card mb-3">
            <div className="card-header">
              <h6 className="mb-0">Current Inventory</h6>
            </div>
            <div className="card-body">
              {inventory.length > 0 ? (
                <div className="row">
                  {inventory.slice(0, 6).map((item) => (
                    <div key={item.id} className="col-6 mb-2">
                      <div className="border rounded p-2 text-center">
                        <div className="fw-bold small">{item.name}</div>
                        <small className="text-muted">
                          {item.quantity} {item.unit}
                        </small>
                      </div>
                    </div>
                  ))}
                  {inventory.length > 6 && (
                    <div className="col-12 text-center">
                      <small className="text-muted">
                        +{inventory.length - 6} more items
                      </small>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted small">
                  No items in inventory. Add some ingredients to get better recipe suggestions!
                </p>
              )}
            </div>
          </div>

          {/* Chat Tips */}
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">💡 Chat Tips</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0 small">
                <li className="mb-2">
                  <i className="bi bi-check text-success me-2"></i>
                  Ask about specific recipes or cuisines
                </li>
                <li className="mb-2">
                  <i className="bi bi-check text-success me-2"></i>
                  Request cooking tips and techniques
                </li>
                <li className="mb-2">
                  <i className="bi bi-check text-success me-2"></i>
                  Get ingredient substitution ideas
                </li>
                <li className="mb-2">
                  <i className="bi bi-check text-success me-2"></i>
                  Ask about dietary restrictions
                </li>
                <li>
                  <i className="bi bi-check text-success me-2"></i>
                  Get meal planning suggestions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeChat;