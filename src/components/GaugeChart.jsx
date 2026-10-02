import React from 'react';

export default function GaugeChart({ score = 90 }) {
  const clamped = Math.max(0, Math.min(100, Number(score) || 0));
  const radius = 70;
  const circumference = Math.PI * radius; // Half-circle circumference
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: '180px', height: '105px', overflow: 'hidden' }}>
        <svg viewBox="0 0 180 110" width="180" height="110">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="60%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Semicircle background track */}
          <path
            d="M 20 95 A 70 70 0 0 1 160 95"
            fill="none"
            stroke="#f0ebe1"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Semicircle filled progress */}
          <path
            d="M 20 95 A 70 70 0 0 1 160 95"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="18"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>

        <div
          style={{
            position: 'absolute',
            bottom: '2px',
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--emerald-main)', fontFamily: 'var(--font-heading)' }}>
            {clamped}%
          </span>
        </div>
      </div>

      <div style={{ marginTop: '0.4rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'center' }}>
          <span>🛡️</span> Government Darpan Score
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>
          {clamped >= 90 ? 'Tier-1 Highest Credibility' : clamped >= 75 ? 'Verified Authentic' : 'Standard Compliance'}
        </span>
      </div>
    </div>
  );
}
