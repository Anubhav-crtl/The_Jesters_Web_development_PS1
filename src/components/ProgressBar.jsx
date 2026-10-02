import React from 'react';

export default function ProgressBar({ funds_raised = 0, funds_goal = 0 }) {
  if (!funds_goal || funds_goal <= 0) return null;

  const percentage = Math.min(Math.round((funds_raised / funds_goal) * 100), 100);

  const formatRupees = (amt) => {
    return '₹' + Number(amt || 0).toLocaleString('en-IN');
  };

  return (
    <div className="progress-box">
      <div className="progress-header">
        <span>{formatRupees(funds_raised)} raised of {formatRupees(funds_goal)}</span>
        <span className="pct">{percentage}%</span>
      </div>
      <div className="progress-bar-track" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
