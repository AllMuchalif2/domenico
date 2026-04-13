import React, { useEffect } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

export default function EvaAlert({ active, temperature, locationName, onDismiss }) {
  const line1 = useTypewriter('WARNING', 100, active);
  const line2 = useTypewriter('EXTREME WEATHER DETECTED', 60, active);

  useEffect(() => {
    if (active) {
      // Auto dismiss after 30s
      const timer = setTimeout(() => {
        onDismiss();
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [active, onDismiss]);

  if (!active) return null;

  return (
    <div className="eva-overlay">
      <div style={{ zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ color: 'var(--nerv-red)', fontSize: '3rem', margin: 0, lineHeight: 1, letterSpacing: '0.1em' }} className="blink">{line1}</h1>
          <h2 style={{ color: 'var(--nerv-text)', fontSize: '1.125rem', marginTop: '0.5rem', letterSpacing: '0.05em' }}>{line2}</h2>
          
          <div style={{ marginTop: '1.5rem', padding: '0.5rem', border: '1px solid var(--nerv-red)', backgroundColor: 'rgba(204, 0, 0, 0.2)' }}>
            <div style={{ color: 'var(--nerv-orange)', fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              CRITICAL ATMOSPHERIC ANOMALY
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {temperature ? Math.round(temperature) : '--'}°C
            </div>
            <div style={{ color: 'var(--nerv-text)', marginTop: '0.25rem', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              LOC: {locationName || 'UNKNOWN'}
            </div>
          </div>
        </div>

        <button 
          onClick={onDismiss}
          style={{
            marginTop: 'auto',
            backgroundColor: 'transparent',
            border: '2px solid var(--nerv-red)',
            color: 'var(--nerv-red)',
            padding: '0.5rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            minHeight: '44px'
          }}
        >
          DISMISS
        </button>
      </div>
    </div>
  );
}
