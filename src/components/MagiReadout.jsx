import React, { useState, useEffect, useRef } from 'react';
import { useScramble } from '../hooks/useScramble';

export default function MagiReadout({ weatherData }) {
  const [isChanging, setIsChanging] = useState(false);
  const prevDataRef = useRef(null);

  useEffect(() => {
    if (!weatherData?.current) return;
    if (!prevDataRef.current) {
      prevDataRef.current = weatherData;
      return;
    }
    if (weatherData.current.dt !== prevDataRef.current.current?.dt) {
      setIsChanging(true);
      const timer = setTimeout(() => {
        setIsChanging(false);
        prevDataRef.current = weatherData;
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [weatherData]);

  if (!weatherData || !weatherData.current) {
    return <div style={{ textAlign: 'center', color: 'var(--col-gray-dim)' }}>[ NO SIGNAL ]</div>;
  }

  const { current, aqi } = weatherData;
  const temp = current.main.temp;
  const feelsLike = current.main.feels_like;
  const humidity = current.main.humidity;
  const icon = current.weather[0].icon;
  const desc = current.weather[0].description;
  const windKmh = (current.wind.speed * 3.6).toFixed(1);
  const rain1h = current.rain ? current.rain["1h"] || 0 : 0;
  
  // AQI Map
  const aqiVal = aqi?.list[0]?.main?.aqi;
  const aqiLabels = { 1: 'GOOD', 2: 'FAIR', 3: 'MODERATE', 4: 'POOR', 5: 'V.POOR' };
  const aqiLabel = aqiVal ? aqiLabels[aqiVal] : 'UNKNOWN';

  const displayTemp = useScramble(Math.round(temp), 600);
  const displayFeelsLike = useScramble(Math.round(feelsLike), 500);
  const displayHumidity = useScramble(humidity, 500);
  const displayWind = useScramble(windKmh, 550);
  const displayRain = useScramble(rain1h, 480);


  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      
      {/* Sub-baris A (50%) */}
      <div className="nerv-panel clip-card" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Temperature and Icon */}
          <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={desc} style={{ width: '80px', height: '80px', margin: '-10px 0' }} className={`weather-icon-large ${isChanging ? 'changing' : ''}`} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', lineHeight: 1, color: 'var(--col-primary)' }}>
              {displayTemp}°<span style={{ fontSize: '24px' }}>C</span>
            </div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--col-text-primary)', letterSpacing: '0.05em' }}>
              FEELS LIKE {displayFeelsLike}°C
            </div>
            <div className={`condition-main ${isChanging ? 'changing' : ''}`} style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--col-primary-bright)' }}>
              {desc}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-baris B (50%) - 2x2 Grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '0.5rem' }}>
        <div className="nerv-panel" style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--col-green)' }}>HUMIDITY</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{displayHumidity}%</div>
          <div style={{ height: '2px', background: 'var(--col-green)', marginTop: '4px', opacity: 0.5, width: `${humidity}%` }} />
        </div>
        
        <div className="nerv-panel" style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--col-green)' }}>WIND</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{displayWind} <span style={{ fontSize: '11px' }}>km/h</span></div>
          <div style={{ height: '2px', background: 'var(--col-green)', marginTop: '4px', opacity: 0.5, width: `${Math.min((current.wind.speed / 20) * 100, 100)}%` }} />
        </div>

        <div className="nerv-panel" style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--col-green)' }}>RAIN (1H)</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{displayRain} <span style={{ fontSize: '11px' }}>mm</span></div>
          <div style={{ height: '2px', background: 'var(--col-green)', marginTop: '4px', opacity: 0.5, width: `${Math.min((rain1h / 50) * 100, 100)}%` }} />
        </div>

        <div className="nerv-panel" style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--col-green)' }}>AQI</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{aqiLabel}</div>
          <div style={{ height: '2px', background: 'var(--col-green)', marginTop: '4px', opacity: 0.5, width: `${(aqiVal / 5) * 100}%` }} />
        </div>
      </div>
      
    </div>
  );
}
