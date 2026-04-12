import React, { useState, useEffect, useRef } from 'react';

export default function FreeSearch({ onLocationSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=id&addressdetails=1&limit=5`;
        const resp = await fetch(url, { headers: { 'User-Agent': 'DOMENICO-WeatherApp/1.0' } });
        if (resp.ok) {
          const data = await resp.json();
          setResults(data);
        }
      } catch (err) {
        // ignore errors
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div>
      <input 
        type="text" 
        className="nerv-input" 
        placeholder="ENTER LOCATION..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      
      {loading && <div style={{ color: 'var(--nerv-orange)' }} className="blink">[ SEARCHING SECURE DATABASE... ]</div>}
      
      {results.length > 0 && (
        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {results.map((res) => (
            <button 
              key={res.place_id} 
              className="nerv-button"
              style={{ padding: '0.5rem', textAlign: 'left', minHeight: 'auto', justifyContent: 'flex-start', fontSize: '0.875rem' }}
              onClick={() => onLocationSelect({ lat: parseFloat(res.lat), lon: parseFloat(res.lon), name: res.display_name })}
            >
              {res.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
