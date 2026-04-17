import React from 'react';

export default function GaugeCard({ label, value, unit }) {
  return (
    <div className="nerv-panel clip-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 0.5rem' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--col-primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        {value} <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: 'var(--col-gray-dim)' }}>{unit}</span>
      </div>
    </div>
  );
}
