import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
      padding: '0 0.5rem',
      backgroundColor: 'rgba(10, 10, 10, 0.9)',
      borderTop: '1px solid var(--nerv-muted)',
      color: 'var(--nerv-muted)',
      fontSize: '11px',
      margin: 0
    }}>
      <span>OWM · OSM · EMSIFA</span>
      <span>UPD {year}</span>
    </footer>
  );
}
