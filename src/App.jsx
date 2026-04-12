import React, { useState, useEffect } from 'react';
import NervHeader from './components/NervHeader';
import Footer from './components/Footer';
import StatusBar from './components/StatusBar';
import LocationPanel from './components/LocationPanel';
import SearchPanel from './components/SearchPanel';
import MagiReadout from './components/MagiReadout';
import EvaAlert from './components/EvaAlert';

import { useGeolocation } from './hooks/useGeolocation';
import { useReverseGeocode } from './hooks/useReverseGeocode';
import { useWeather } from './hooks/useWeather';
import { getAlertLevel } from './utils/alertLevel';

export default function App() {
  const { location, getLocation, loading: geoLoading } = useGeolocation();
  const { placeName, getPlaceName, setPlaceName, loading: placeLoading } = useReverseGeocode();
  
  const [coords, setCoords] = useState(null);
  const [init, setInit] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  // Weather Hook uses new lat/lon directly
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
    }
  }, [location, getPlaceName]);

  const handleLocationSelect = (loc) => {
    setCoords({ lat: loc.lat, lon: loc.lon });
    setPlaceName(loc.name);
    localStorage.setItem('domenico_location', JSON.stringify(loc));
    setSearchOpen(false); // Auto close search panel on select
  };

  const isGlobalLoading = weatherLoading && !weatherData;

  let alertLevel = 'NORMAL';
  if (weatherData && weatherData.current) {
    const w = weatherData.current;
    alertLevel = getAlertLevel(
      w.weather[0].id,
      w.wind.speed,
      w.rain ? w.rain["1h"] : 0
    );
  }

  const [dismissAlert, setDismissAlert] = useState(false);
  useEffect(() => { setDismissAlert(false); }, [weatherData]);

  if (init) {
    return <div style={{ height: '100dvh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="blink" style={{ color: 'var(--nerv-orange)', fontSize: '1.5rem' }}>[ SYSTEM INITIALIZING... ]</div>
    </div>;
  }

  return (
    <>
      <div className="scanline-bg" />
      <div className="app-grid" style={{ gridTemplateRows: searchOpen ? '44px 28px 56px 160px auto 32px' : '44px 28px 56px 0px auto 32px' }}>
        
        {/* ROW 1: HEADER */}
        <NervHeader />

        {/* ROW 2: STATUS BAR */}
        <StatusBar level={alertLevel} />

        {/* ROW 3: LOCATION PANEL */}
        <LocationPanel 
          locationName={placeName} 
          loading={geoLoading || placeLoading} 
          onAutoDetect={getLocation}
          toggleSearch={() => setSearchOpen(!searchOpen)} 
        />

        {/* ROW 4: SEARCH PANEL (Collapsible inside container) */}
        <div className={`search-panel-container ${searchOpen ? 'open' : ''}`}>
           <SearchPanel onLocationSelect={handleLocationSelect} />
        </div>

        {/* ROW 5: MAGI READOUT */}
        <div style={{ padding: '0.5rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {weatherError ? (
            <div style={{ color: 'var(--nerv-red)', padding: '1rem', border: '1px solid var(--nerv-red)' }}>[ {weatherError} ]</div>
          ) : isGlobalLoading ? (
            <div className="blink" style={{ textAlign: 'center', color: 'var(--nerv-orange)', marginTop: '2rem' }}>[ RECEIVING DATA LINK... ]</div>
          ) : (
            <MagiReadout weatherData={weatherData} />
          )}
        </div>

        {/* ROW 6: FOOTER */}
        <Footer />
        
        {/* EVANGELION OVERLAY */}
        <EvaAlert 
          active={alertLevel === 'EVANGELION' && !dismissAlert} 
          temperature={weatherData?.current?.main?.temp}
          locationName={placeName}
          onDismiss={() => setDismissAlert(true)}
        />
      </div>
    </>
  );
}
