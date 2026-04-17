import React, { useState, useEffect } from 'react';

export default function NervHeader() {
  const [time, setTime] = useState('');
  const [muted, setMuted] = useState(
    () => localStorage.getItem('nerv_muted') === 'true'
  );

  const toggleMute = () => {
    setMuted(m => {
      localStorage.setItem('nerv_muted', !m);
      return !m;
    });
  };

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
      borderBottom: '1px solid var(--col-gray-dim)',
      padding: '0 0.5rem',
      backgroundColor: 'var(--col-bg)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '18px', lineHeight: '1', color: 'var(--col-primary)' }}>DOMENICO</h1>
        <span style={{ fontSize: '9px', color: 'var(--col-gray-dim)', letterSpacing: '0.05em' }}>
          NERV WEATHER DIVISION
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={toggleMute} style={{ background: 'transparent', border: '1px solid var(--col-primary)', color: 'var(--col-primary)', padding: '2px 6px', fontSize: '10px', cursor: 'pointer', fontFamily: 'monospace' }}>
          {muted ? 'UNMUTE' : 'MUTE'}
        </button>
        <div style={{ fontSize: '14px', color: 'var(--col-primary)', fontWeight: 'bold' }}>
          {time}
        </div>
      </div>
    </header>
  );
}
