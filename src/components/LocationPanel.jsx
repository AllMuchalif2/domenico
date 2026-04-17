import React from 'react';

export default function LocationPanel({ locationName, onAutoDetect, loading, toggleSearch, searchOpen }) {
  // Truncate logic if needed, although textOverflow ellipsis does it via CSS
  return (
    <div className="nerv-panel" style={{ 
      margin: '0', 
      borderLeft: 'none', 
      borderRight: 'none', 
      borderBottom: '1px solid var(--col-gray-dim)',
      padding: '0 0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
      gap: '0.5rem'
    }}>
      {/* Truncated Location Name */}
      <div style={{ 
        flex: 1, 
        minWidth: 0, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center' 
      }}>
         <span style={{ fontSize: '9px', color: 'var(--col-primary)' }}>CURRENT LOCATION</span>
         {loading ? (
          <span className="blink" style={{ color: 'var(--col-primary)', fontSize: '12px', whiteSpace: 'nowrap' }}>[ ACQUIRING... ]</span>
         ) : (
          <span style={{ 
            fontSize: '14px', 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            color: 'var(--col-text-primary)'
          }}>
            {locationName || '[ REQUIRED ]'}
          </span>
         )}
      </div>
      
      {/* Search Toggle Button */}
      <button 
        onClick={toggleSearch}
        style={{ 
          height: '32px', 
          padding: '0 0.75rem', 
          border: `1px solid var(--nerv-${searchOpen ? 'red' : 'orange'})`, 
          color: `var(--nerv-${searchOpen ? 'red' : 'orange'})`, 
          backgroundColor: searchOpen ? 'rgba(204, 0, 0, 0.1)' : 'transparent',
          fontSize: '11px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        {searchOpen ? (
           <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              CLOSE
           </>
        ) : (
           <>
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <circle cx="11" cy="11" r="8"></circle>
               <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
             </svg>
             SEARCH
           </>
        )}
      </button>

      {/* Auto Detect Button */}
      <button 
        onClick={onAutoDetect}
        className="nerv-button clip-card"
        style={{ 
          height: '32px', 
          padding: '0 0.75rem', 
          minHeight: 'auto',
          fontSize: '11px',
          backgroundColor: 'rgba(90, 44, 160, 0.1)',
          margin: 0
        }}
        title="Auto Detect"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </button>

    </div>
  );
}
