import React from 'react';

const PALETTE = ['#D9531E', '#0D8A56', '#D97706', '#2563EB', '#8B5CF6', '#EC4899'];

export default function DonutChart({ data = {} }) {
  const entries = Object.entries(data || {});
  if (entries.length === 0) {
    return <div style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>No breakdown data available.</div>;
  }

  const total = entries.reduce((sum, [, val]) => sum + Number(val || 0), 0) || 100;
  
  let accumulatedAngle = 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const slices = entries.map(([key, val], index) => {
    const num = Number(val || 0);
    const percentage = Math.round((num / total) * 100);
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedAngle / 100) * circumference);
    accumulatedAngle += percentage;
    const color = PALETTE[index % PALETTE.length];

    // Format key name nicely (e.g. 'raw_grain' -> 'Raw Grain')
    const label = key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return {
      key,
      label,
      percentage,
      strokeDasharray,
      strokeDashoffset,
      color,
    };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: '160px', height: '160px' }}>
        <svg viewBox="0 0 160 160" width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="#f0ebe1"
            strokeWidth="24"
          />
          {slices.map((slice) => (
            <circle
              key={slice.key}
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke={slice.color}
              strokeWidth="24"
              strokeDasharray={slice.strokeDasharray}
              strokeDashoffset={slice.strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          ))}
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
            100%
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 600 }}>Direct Seva</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: '180px' }}>
        {slices.map((slice) => (
          <div key={slice.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: slice.color }}></span>
              <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>{slice.label}</span>
            </div>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{slice.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
