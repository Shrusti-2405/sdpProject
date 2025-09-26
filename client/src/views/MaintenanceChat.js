import React, { useState, useEffect, useRef } from 'react';
import { chatbotAPI, equipmentAPI, maintenanceAPI } from '../services/api';

const MaintenanceChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedMaintenance, setSelectedMaintenance] = useState('');
  const [equipment, setEquipment] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [chatMode, setChatMode] = useState('general'); // general, troubleshooting, suggestions, safety
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchData();
    addWelcomeMessage();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchData = async () => {
    try {
      const [equipmentResponse, maintenanceResponse] = await Promise.all([
        equipmentAPI.getAllEquipment(),
        maintenanceAPI.getAllMaintenance()
      ]);
      setEquipment(equipmentResponse.data.data);
      setMaintenance(maintenanceResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addWelcomeMessage = () => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'bot',
      content: "Hello! I'm your Hospital Equipment Maintenance Bot. I can help you with:\n\n• Equipment troubleshooting\n• Maintenance scheduling\n• Safety protocols\n• Maintenance recommendations\n• Technical guidance\n\nHow can I assist you today?",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      let response;
      
      switch (chatMode) {
        case 'troubleshooting':
          response = await chatbotAPI.getTroubleshootingGuide({
            equipmentId: selectedEquipment,
            symptoms: inputMessage
          });
          break;
        case 'suggestions':
          response = await chatbotAPI.getMaintenanceSuggestions({
            equipmentId: selectedEquipment,
            equipmentType: equipment.find(eq => eq._id === selectedEquipment)?.category,
            issue: inputMessage
          });
          break;
        case 'safety':
          response = await chatbotAPI.getSafetyProtocols({
            equipmentType: equipment.find(eq => eq._id === selectedEquipment)?.category,
            maintenanceType: inputMessage
          });
          break;
        default:
          response = await chatbotAPI.chatWithBot(inputMessage, selectedEquipment, selectedMaintenance);
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.data.message || response.data.data.suggestions || response.data.data.guide || response.data.data.protocols || response.data.data.recommendations,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = async (action, data) => {
    setInputMessage('');
    setLoading(true);

    try {
      let response;
      
      switch (action) {
        case 'troubleshooting':
          response = await chatbotAPI.getTroubleshootingGuide(data);
          break;
        case 'suggestions':
          response = await chatbotAPI.getMaintenanceSuggestions(data);
          break;
        case 'safety':
          response = await chatbotAPI.getSafetyProtocols(data);
          break;
        case 'schedule':
          response = await chatbotAPI.getMaintenanceScheduleRecommendations(data);
          break;
        default:
          response = await chatbotAPI.chatWithBot(data.message || data, selectedEquipment, selectedMaintenance);
      }

      const botMessage = {
        id: Date.now(),
        type: 'bot',
        content: response.data.data.message || response.data.data.suggestions || response.data.data.guide || response.data.data.protocols || response.data.data.recommendations,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error with quick action:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    addWelcomeMessage();
  };

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2>
              <i className="bi bi-robot me-2"></i>
              Maintenance Bot
            </h2>
            <div className="btn-group">
              <button
                className="btn btn-outline-secondary"
                onClick={clearChat}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {/* Chat Interface */}
          <div className="card" style={{ height: '600px' }}>
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="mb-0">Chat with Maintenance Bot</h5>
                </div>
                <div className="col-md-6">
                  <div className="d-flex gap-2">
                    <select
                      className="form-select form-select-sm"
                      value={chatMode}
                      onChange={(e) => setChatMode(e.target.value)}
                    >
                      <option value="general">General Chat</option>
                      <option value="troubleshooting">Troubleshooting</option>
                      <option value="suggestions">Maintenance Suggestions</option>
                      <option value="safety">Safety Protocols</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-body d-flex flex-column p-0">
              {/* Messages */}
              <div className="flex-grow-1 p-3" style={{ overflowY: 'auto', maxHeight: '450px' }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-3 d-flex ${message.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    <div
                      className={`p-3 rounded-3 ${
                        message.type === 'user'
                          ? 'bg-primary text-white'
                          : message.isError
                          ? 'bg-danger text-white'
                          : 'bg-light text-dark'
                      }`}
                      style={{ maxWidth: '80%' }}
                    >
                      <div className="d-flex align-items-start">
                        {message.type === 'bot' && (
                          <i className="bi bi-robot me-2 mt-1"></i>
                        )}
                        <div>
                          <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
                          <small className={`opacity-75 ${message.type === 'user' ? 'text-white' : 'text-muted'}`}>
                            {message.timestamp.toLocaleTimeString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="d-flex justify-content-start">
                    <div className="p-3 rounded-3 bg-light">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-robot me-2"></i>
                        <div className="spinner-border spinner-border-sm me-2"></div>
                        <span>Bot is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-top p-3">
                <div className="row g-2">
                  <div className="col-12">
                    <textarea
                      className="form-control"
                      placeholder="Type your message here..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      rows="2"
                      disabled={loading}
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-between">
                    <div className="d-flex gap-2">
                      <select
                        className="form-select form-select-sm"
                        value={selectedEquipment}
                        onChange={(e) => setSelectedEquipment(e.target.value)}
                        style={{ width: '200px' }}
                      >
                        <option value="">Select Equipment (Optional)</option>
                        {equipment.map(item => (
                          <option key={item._id} value={item._id}>
                            {item.name} - {item.serialNumber}
                          </option>
                        ))}
                      </select>
                      <select
                        className="form-select form-select-sm"
                        value={selectedMaintenance}
                        onChange={(e) => setSelectedMaintenance(e.target.value)}
                        style={{ width: '200px' }}
                      >
                        <option value="">Select Maintenance (Optional)</option>
                        {maintenance.map(item => (
                          <option key={item._id} value={item._id}>
                            {item.equipmentId?.name} - {item.type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={handleSendMessage}
                      disabled={loading || !inputMessage.trim()}
                    >
                      <i className="bi bi-send me-1"></i>
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Quick Actions */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => handleQuickAction('troubleshooting', { symptoms: 'Equipment not working properly' })}
                >
                  <i className="bi bi-wrench me-2"></i>
                  Troubleshooting Guide
                </button>
                <button
                  className="btn btn-outline-info"
                  onClick={() => handleQuickAction('suggestions', { equipmentType: 'Diagnostic' })}
                >
                  <i className="bi bi-lightbulb me-2"></i>
                  Maintenance Suggestions
                </button>
                <button
                  className="btn btn-outline-warning"
                  onClick={() => handleQuickAction('safety', { equipmentType: 'Life Support' })}
                >
                  <i className="bi bi-shield me-2"></i>
                  Safety Protocols
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={() => handleQuickAction('schedule', { equipmentType: 'Imaging' })}
                >
                  <i className="bi bi-calendar me-2"></i>
                  Schedule Recommendations
                </button>
              </div>
            </div>
          </div>

          {/* Bot Capabilities */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Bot Capabilities</h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Equipment troubleshooting
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Maintenance scheduling
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Safety protocols
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Technical guidance
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Best practices
                </li>
                <li>
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Compliance assistance
                </li>
              </ul>
            </div>
          </div>

          {/* Tips */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">💡 Tips</h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <small>
                    <strong>Be specific:</strong> Provide detailed information about equipment issues
                  </small>
                </li>
                <li className="mb-2">
                  <small>
                    <strong>Select equipment:</strong> Choose equipment for context-aware responses
                  </small>
                </li>
                <li className="mb-2">
                  <small>
                    <strong>Use modes:</strong> Switch between different chat modes for specific help
                  </small>
                </li>
                <li>
                  <small>
                    <strong>Quick actions:</strong> Use quick action buttons for common tasks
                  </small>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceChat;
