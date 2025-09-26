import React from 'react';

const PriorityBadge = ({ priority, className = '', animated = true }) => {
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'Critical':
        return {
          class: 'bg-danger',
          icon: 'bi-exclamation-triangle-fill',
          text: 'Critical',
          glow: 'priority-critical',
          animated: 'criticalPulse'
        };
      case 'High':
        return {
          class: 'bg-warning',
          icon: 'bi-exclamation-triangle',
          text: 'High',
          glow: 'priority-high'
        };
      case 'Medium':
        return {
          class: 'bg-info',
          icon: 'bi-info-circle',
          text: 'Medium',
          glow: 'priority-medium'
        };
      case 'Low':
        return {
          class: 'bg-success',
          icon: 'bi-check-circle',
          text: 'Low',
          glow: 'priority-low'
        };
      default:
        return {
          class: 'bg-secondary',
          icon: 'bi-question-circle',
          text: priority,
          glow: ''
        };
    }
  };

  const config = getPriorityConfig(priority);
  const badgeClasses = `badge ${config.class} ${config.glow} ${animated && config.animated ? config.animated : ''} ${className}`;

  return (
    <span className={badgeClasses}>
      <i className={`${config.icon} me-1`}></i>
      {config.text}
    </span>
  );
};

export default PriorityBadge;
