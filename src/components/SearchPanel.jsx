import React, { useState } from 'react';
import FreeSearch from './FreeSearch';
import CascadingDropdown from './CascadingDropdown';

export default function SearchPanel({ onLocationSelect }) {
  const [activeTab, setActiveTab] = useState('free');

  return (
    <div style={{
      borderLeft: '1px solid var(--nerv-orange)',
      borderRight: '1px solid var(--nerv-orange)',
      borderBottom: '1px solid var(--nerv-orange)',
      padding: '0.5rem',
      backgroundColor: 'rgba(10, 10, 10, 0.95)',
      height: '100%',
      // We assume display is none entirely when hidden, but transition on height shrinks it.
      // We overflow: hidden upstream in .search-panel-container
    }}>
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'free' ? 'active' : ''}`}
          onClick={() => setActiveTab('free')}
        >
          OSM SEARCH
        </button>
        <button 
          className={`tab ${activeTab === 'cascade' ? 'active' : ''}`}
          onClick={() => setActiveTab('cascade')}
        >
          WILAYAH DB
        </button>
      </div>

      <div>
        {activeTab === 'free' ? (
          <FreeSearch onLocationSelect={onLocationSelect} />
        ) : (
          <CascadingDropdown onLocationSelect={onLocationSelect} />
        )}
      </div>
    </div>
  );
}
