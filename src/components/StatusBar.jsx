import React from 'react';

export default function StatusBar({ level }) {
  let borderColor = 'var(--col-primary)';
  let textColor = 'var(--col-primary)';
  let levelIndex = 0;
  
  if (level === 'NORMAL') {
    borderColor = '#00FF00';
    textColor = '#00FF00';
    levelIndex = 1;
  } else if (level === 'CAUTION') {
    borderColor = 'var(--col-alert-caution)';
    textColor = 'var(--col-alert-caution)';
    levelIndex = 2;
  } else if (level === 'WARNING') {
    borderColor = 'var(--col-primary-bright)';
    textColor = 'var(--col-primary-bright)';
    levelIndex = 3;
  } else if (level === 'EVANGELION') {
    borderColor = '#CC0000';
    textColor = '#CC0000';
    levelIndex = 4;
  }

  const animationClass = level === 'WARNING' || level === 'EVANGELION' ? 'blink' : '';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid var(--col-gray-dim)`,
      height: '100%',
      padding: '0 0.5rem',
      backgroundColor: 'rgba(10, 10, 10, 0.5)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className={animationClass} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: textColor }} />
        <div style={{ color: textColor, fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.1em' }} className={animationClass}>
          STATUS: {level}
        </div>
      </div>
      
      {/* 4 segment bar indicator */}
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4].map(i => (
          <div 
            key={i} 
            style={{ 
              width: '12px', 
              height: '8px', 
              backgroundColor: i <= levelIndex ? borderColor : 'var(--col-gray-dim)',
              opacity: i <= levelIndex ? 1 : 0.3
            }} 
          />
        ))}
      </div>
    </div>
  );
}
