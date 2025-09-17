import React, { useState } from 'react';

const ChatInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex gap-2">
      <div className="flex-grow-1">
        <textarea
          className="form-control"
          rows="2"
          placeholder={disabled ? "Processing..." : "Ask me about recipes, cooking tips, or anything kitchen-related..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          style={{ resize: 'none' }}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={disabled || !message.trim()}
        style={{ height: 'fit-content', alignSelf: 'end' }}
      >
        {disabled ? (
          <span className="spinner-border spinner-border-sm"></span>
        ) : (
          <i className="bi bi-send"></i>
        )}
      </button>
    </form>
  );
};

export default ChatInput;