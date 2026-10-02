import React from 'react';

export default function StatusBadge({ status = 'COMPLETED' }) {
  const norm = String(status || '').toUpperCase();

  if (norm === 'UPCOMING') {
    return (
      <span className="badge-status upcoming">
        <span>🔵</span> UPCOMING
      </span>
    );
  }

  if (norm === 'ONGOING') {
    return (
      <span className="badge-status ongoing">
        <span>🟡</span> ONGOING
      </span>
    );
  }

  return (
    <span className="badge-status completed">
      <span>🟢</span> COMPLETED
    </span>
  );
}
