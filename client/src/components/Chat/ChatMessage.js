import React from 'react';

const ChatMessage = ({ message }) => {
  const isUser = message.type === 'user';
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMessageContent = (content) => {
    // Simple formatting for better readability
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`d-flex mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
      <div className={`max-width-75 ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Bot Message */}
        {!isUser && (
          <div className="d-flex align-items-start">
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2 flex-shrink-0" 
                 style={{ width: '32px', height: '32px' }}>
              <i className="bi bi-robot text-white small"></i>
            </div>
            <div className="flex-grow-1">
              <div className={`rounded-3 p-3 ${
                message.isError ? 'bg-danger text-white' : 'bg-light'
              }`}>
                <div className="message-content">
                  {formatMessageContent(message.content)}
                </div>
              </div>
              <small className="text-muted ms-2">
                {formatTime(message.timestamp)}
              </small>
            </div>
          </div>
        )}

        {/* User Message */}
        {isUser && (
          <div className="d-flex align-items-start justify-content-end">
            <div className="flex-grow-1 text-end">
              <div className="bg-primary text-white rounded-3 p-3 d-inline-block text-start">
                <div className="message-content">
                  {formatMessageContent(message.content)}
                </div>
              </div>
              <div>
                <small className="text-muted me-2">
                  {formatTime(message.timestamp)}
                </small>
              </div>
            </div>
            <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center ms-2 flex-shrink-0" 
                 style={{ width: '32px', height: '32px' }}>
              <i className="bi bi-person text-white small"></i>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;