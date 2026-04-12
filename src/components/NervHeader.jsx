import React, { useState, useEffect } from 'react';

export default function NervHeader() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      const wibOptions = { timeZone: 'Asia/Jakarta', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
      setTime(date.toLocaleTimeString('en-GB', wibOptions) + ' WIB');
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      height: '100%', 
      borderBottom: '1px solid var(--nerv-muted)',
      padding: '0 0.5rem',
      backgroundColor: 'var(--nerv-bg)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '18px', lineHeight: '1', color: 'var(--nerv-orange)' }}>DOMENICO</h1>
        <span style={{ fontSize: '9px', color: 'var(--nerv-muted)', letterSpacing: '0.05em' }}>
          NERV WEATHER DIVISION
        </span>
      </div>
      <div style={{ fontSize: '14px', color: 'var(--nerv-orange)', fontWeight: 'bold' }}>
        {time}
      </div>
    </header>
  );
}
