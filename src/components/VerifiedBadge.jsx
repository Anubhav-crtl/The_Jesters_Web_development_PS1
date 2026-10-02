import React from 'react';

export default function VerifiedBadge({ status = 'ACTIVE', showText = true }) {
  const isVerified = status === 'ACTIVE';

  if (!isVerified) {
    return (
      <span className="verified-badge pending" title="NGO Verification in progress">
        <span>⚠️</span>
        {showText && <span>Pending</span>}
      </span>
    );
  }

  return (
    <span className="verified-badge" title="Government Darpan Verified NGO">
      <span>✅</span>
      {showText && <span>Verified</span>}
    </span>
  );
}
