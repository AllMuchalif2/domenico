import React, { useState, useEffect } from 'react';
import SearchPanel from './components/SearchPanel';
import EvaAlert from './components/EvaAlert';

import { useGeolocation } from './hooks/useGeolocation';
import { useReverseGeocode } from './hooks/useReverseGeocode';
import { useWeather } from './hooks/useWeather';
import { getAlertLevel } from './utils/alertLevel';

// SVG Icons
const IconLocation = () => <svg width="14" height="14" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconCrosshair = () => <svg width="12" height="12" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>;
const IconSearch = () => <svg width="12" height="12" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconClose = () => <svg width="12" height="12" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconHeartbeat = () => <svg width="14" height="14" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>;
const IconDroplet = () => <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>;
const IconWind = () => <svg width="14" height="14" viewBox="0 0 24 24"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>;

export default function App() {
  const { location, getLocation, loading: geoLoading } = useGeolocation();
  const { placeName, getPlaceName, setPlaceName, loading: placeLoading } = useReverseGeocode();
  
  const [coords, setCoords] = useState(null);
  const [init, setInit] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  const { data: weatherData, loading: weatherLoading, error: weatherError } = useWeather(coords?.lat, coords?.lon);

  useEffect(() => {
    const cached = localStorage.getItem('domenico_location');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setCoords({ lat: parsed.lat, lon: parsed.lon });
        setPlaceName(parsed.name);
      } catch(e) {}
    }
    setInit(false);
  }, [setPlaceName]);

  useEffect(() => {
    if (location && location.lat && location.lon) {
      setCoords(location);
      getPlaceName(location.lat, location.lon).then((name) => {
        if (name) {
          localStorage.setItem('domenico_location', JSON.stringify({ lat: location.lat, lon: location.lon, name }));
        }
      });
      setSearchOpen(false);
    }
  }, [location, getPlaceName]);

  const handleLocationSelect = (loc) => {
    setCoords({ lat: loc.lat, lon: loc.lon });
    setPlaceName(loc.name);
    localStorage.setItem('domenico_location', JSON.stringify(loc));
    setSearchOpen(false);
  };

  let alertLevel = 'NORMAL';
  if (weatherData && weatherData.current) {
    const w = weatherData.current;
    alertLevel = getAlertLevel(w.weather[0].id, w.wind.speed, w.rain ? w.rain["1h"] : 0);
  }

  const [dismissAlert, setDismissAlert] = useState(false);
  useEffect(() => { setDismissAlert(false); }, [weatherData]);

  if (init) {
    return <div style={{ height: '100dvh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="blink" style={{ color: 'var(--nerv-orange)', fontSize: '1.5rem' }}>[ SYSTEM INITIALIZING... ]</div>
    </div>;
  }

  const formatLocationName = (name) => {
    if (!name) return 'AWAITING UPLINK';
    // Clean up display for massive text
    const parts = name.split(', ');
    if (parts.length > 2) {
      return `${parts[0]}, \n${parts[1]}`;
    }
    return name;
  };

  const getAlertColor = () => {
    if (alertLevel === 'NORMAL') return 'var(--nerv-green)';
    if (alertLevel === 'CAUTION') return '#FFCC00';
    if (alertLevel === 'WARNING') return 'var(--nerv-highlight)';
    return 'var(--nerv-red)';
  };

  return (
    <>
      <div className="scanline-bg" />
      <div className="app-grid">
        
        {/* ROW 1: HEADER */}
        <header className="master-header">
           <div className="header-left">
             <h1>D.O.M.E.N.I.C.O</h1>
             <div className="header-sub">
                BMKG MEWS / REGION: {placeName ? placeName.split(',').pop().trim() : 'UNKNOWN'}
             </div>
           </div>
           <div className="header-right">
             <div className="status-label">STATUS:</div>
             <div className="status-value blink" style={{ color: getAlertColor() }}>{alertLevel}</div>
           </div>
        </header>

        {/* ROW 2: MAIN DASHBOARD */}
        <main className="dashboard-main">
          {searchOpen ? (
            <div style={{ flex: 1, border: '1px solid var(--nerv-orange)', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
               <div className="target-loc-header" style={{ marginBottom: '1rem' }}>
                 <span><IconSearch /> TARGET ACQUISITION OVERRIDE</span>
                 <div className="action-buttons">
                    <button onClick={() => setSearchOpen(false)} className="warning"><IconClose /> CANCEL</button>
                 </div>
               </div>
               <SearchPanel onLocationSelect={handleLocationSelect} />
            </div>
          ) : (
            <div className="dashboard-grid">
               
               {/* LEFT COLUMN */}
               <div className="dash-left">
                  <div className="target-loc-header">
                     <span><IconLocation /> TARGET LOCATION</span>
                     <div className="action-buttons">
                        <button onClick={getLocation} title="Auto Detect">{geoLoading || placeLoading ? <span className="blink">...</span> : <IconCrosshair />}</button>
                        <button onClick={() => setSearchOpen(true)}><IconSearch /> SEARCH</button>
                     </div>
                  </div>
                  
                  <div className="huge-location">
                     {formatLocationName(placeName)}
                     {weatherError && <div style={{fontSize: '1rem', color: 'var(--nerv-red)'}}>[ LINK ERROR: {weatherError} ]</div>}
                  </div>

                  <div className="conditions-header">CURRENT CONDITIONS</div>
                  <div className="huge-conditions">
                     <span className="condition-text" style={{color: 'var(--nerv-green)'}}>
                       {weatherData?.current ? weatherData.current.weather[0].description : (weatherLoading ? 'SCANNING...' : 'NO DATA')}
                     </span>
                     {weatherData?.current && (
                       <img src={`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`} alt="icon" style={{ width: '80px', height: '80px', filter: 'hue-rotate(90deg) brightness(1.5)' }} />
                     )}
                  </div>
               </div>

               {/* RIGHT COLUMN */}
               <div className="dash-right">
                  {weatherData?.current ? (
                     <>
                        <div className="metric-card">
                           <div className="metric-header"><IconHeartbeat /> CORE TEMP</div>
                           <div className="metric-value">{Math.round(weatherData.current.main.temp)} <span className="metric-unit">°C</span></div>
                           <div className="metric-bar-bg"><div className="metric-bar-fill" style={{ width: `${(weatherData.current.main.temp / 50) * 100}%` }}></div></div>
                        </div>
                        <div className="metric-card">
                           <div className="metric-header"><IconDroplet /> HUMIDITY</div>
                           <div className="metric-value">{weatherData.current.main.humidity} <span className="metric-unit">%</span></div>
                           <div className="metric-bar-bg"><div className="metric-bar-fill" style={{ width: `${weatherData.current.main.humidity}%` }}></div></div>
                        </div>
                        <div className="metric-card">
                           <div className="metric-header"><IconWind /> WIND VELOCITY</div>
                           <div className="metric-value">{(weatherData.current.wind.speed * 3.6).toFixed(1)} <span className="metric-unit">KPH</span></div>
                           <div className="metric-bar-bg"><div className="metric-bar-fill" style={{ width: `${Math.min((weatherData.current.wind.speed * 3.6) / 100 * 100, 100)}%` }}></div></div>
                        </div>
                     </>
                  ) : (
                     <div style={{ flex: 1, border: '1px solid var(--nerv-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--nerv-orange)' }} className="blink">
                        [ AWAITING TELEMETRY ]
                     </div>
                  )}
               </div>

            </div>
          )}
        </main>

        {/* ROW 3: FOOTER */}
        <footer className="master-footer">
          <div className="footer-left">DYNAMIC OPERATIONAL METEOROLOGICAL ENVIRONMENT & NOTIFICATION INTELLIGENCE COMMAND OVERLAY</div>
          <div className="footer-right"><span className="uplink-box"></span> UPLINK ESTABLISHED</div>
        </footer>

        {/* EVANGELION OVERLAY */}
        <div style={{ position: 'relative' }}>
          <EvaAlert 
            active={alertLevel === 'EVANGELION' && !dismissAlert} 
            temperature={weatherData?.current?.main?.temp}
            locationName={placeName}
            onDismiss={() => setDismissAlert(true)}
          />
        </div>
      </div>
    </>
  );
}
