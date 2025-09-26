import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'spinner-border-sm',
    medium: '',
    large: 'spinner-border-lg'
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="mt-3">
        <p className="text-muted">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
