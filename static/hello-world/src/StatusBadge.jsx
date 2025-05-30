import React from 'react';

const STATUS_COLORS = {
  success: '#36B37E', // green
  failed: '#FF5630', // red
  running: '#FFAB00', // yellow
  unknown: '#A5ADBA', // gray
};

const STATUS_LABELS = {
  success: 'Success',
  failed: 'Failed',
  running: 'Running',
  unknown: 'Unknown',
};

export default function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || STATUS_COLORS.unknown;
  const label = STATUS_LABELS[status] || STATUS_LABELS.unknown;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 12,
      background: color,
      color: '#fff',
      fontWeight: 600,
      fontSize: 13,
      marginRight: 8,
      minWidth: 70,
      textAlign: 'center',
      letterSpacing: 1,
    }}>
      {label}
    </span>
  );
} 