import React from 'react';

const StatusBadge = ({ status, className = '', animated = true }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Operational':
        return {
          class: 'bg-success',
          icon: 'bi-check-circle',
          text: 'Operational',
          glow: 'status-operational'
        };
      case 'Maintenance':
        return {
          class: 'bg-warning',
          icon: 'bi-tools',
          text: 'Maintenance',
          glow: 'status-maintenance'
        };
      case 'Out of Service':
        return {
          class: 'bg-danger',
          icon: 'bi-x-circle',
          text: 'Out of Service',
          glow: 'status-out-of-service'
        };
      case 'Repair':
        return {
          class: 'bg-info',
          icon: 'bi-wrench',
          text: 'Repair',
          glow: 'status-repair'
        };
      case 'Retired':
        return {
          class: 'bg-secondary',
          icon: 'bi-archive',
          text: 'Retired',
          glow: 'status-retired'
        };
      default:
        return {
          class: 'bg-secondary',
          icon: 'bi-question-circle',
          text: status,
          glow: ''
        };
    }
  };

  const config = getStatusConfig(status);
  const badgeClasses = `badge ${config.class} ${config.glow} ${animated ? 'pulse' : ''} ${className}`;

  return (
    <span className={badgeClasses}>
      <i className={`${config.icon} me-1`}></i>
      {config.text}
    </span>
  );
};

export default StatusBadge;
