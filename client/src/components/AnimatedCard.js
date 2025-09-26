import React from 'react';

const AnimatedCard = ({ children, className = '', delay = 0, ...props }) => {
  return (
    <div 
      className={`card equipment-card ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
