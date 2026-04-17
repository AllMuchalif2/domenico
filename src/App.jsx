import React, { useState, useEffect, useRef } from "react";
import SearchPanel from "./components/SearchPanel";
import EvaAlert from "./components/EvaAlert";
import NervActivation from "./components/NervActivation";
import HourlyForecast from "./components/HourlyForecast";

import { useGeolocation } from "./hooks/useGeolocation";
import { useScramble } from "./hooks/useScramble";

function LiveClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("id-ID", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setDate(
        now.toLocaleDateString("id-ID", {
          timeZone: "Asia/Jakarta",
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).replace(/\//g, ".")
      );
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="live-clock">
      <span className="clock-label">WIB</span>
      <span className="clock-time">{time}</span>
      <span className="clock-date">{date}</span>
    </div>
  );
}

import { useReverseGeocode } from "./hooks/useReverseGeocode";
import { useWeather } from "./hooks/useWeather";
import { getAlertLevel } from "./utils/alertLevel";
import {
  playWarningBeep,
  playSiren,
  stopSiren,
  playDismissBeep,
} from "./utils/nervAudio";

// SVG Icons
const IconLocation = () => (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);
const IconCrosshair = () => (
  <svg width="12" height="12" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="22" y1="12" x2="18" y2="12"></line>
    <line x1="6" y1="12" x2="2" y2="12"></line>
    <line x1="12" y1="6" x2="12" y2="2"></line>
    <line x1="12" y1="22" x2="12" y2="18"></line>
  </svg>
);
const IconSearch = () => (
  <svg width="12" height="12" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const IconClose = () => (
  <svg width="12" height="12" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
const IconHeartbeat = () => (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
  </svg>
);
const IconDroplet = () => (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
  </svg>
);
const IconWind = () => (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
  </svg>
);
const IconPressure = () => (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default function App() {
  const { location, getLocation, loading: geoLoading } = useGeolocation();
  const {
    placeName,
    getPlaceName,
    setPlaceName,
    loading: placeLoading,
  } = useReverseGeocode();

  const [coords, setCoords] = useState(null);
  const [init, setInit] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  const {
    data: weatherData,
    loading: weatherLoading,
    error: weatherError,
  } = useWeather(coords?.lat, coords?.lon);

  const [locateState, setLocateState] = useState('idle');
  const handleLocate = () => {
    setLocateState('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocateState('success');
        setTimeout(() => setLocateState('idle'), 2000);
        const newLoc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setCoords(newLoc);
        getPlaceName(newLoc.lat, newLoc.lon).then((name) => {
          if (name) {
            localStorage.setItem(
              "domenico_location",
              JSON.stringify({ ...newLoc, name })
            );
          }
        });
        setSearchOpen(false);
      },
      (err) => {
        setLocateState('error');
        setTimeout(() => setLocateState('idle'), 3000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const locateLabel = {
    idle:     '⊙ LOCATE',
    locating: '◌ ACQUIRING...',
    success:  '● LOCATED',
    error:    '✕ DENIED',
  };

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

  const displayTemp = useScramble(weatherData?.current ? Math.round(weatherData.current.main.temp) : "  --  ", 600);
  const displayHumid = useScramble(weatherData?.current ? weatherData.current.main.humidity : "  --  ", 500);
  const displayWind = useScramble(weatherData?.current ? (weatherData.current.wind.speed * 3.6).toFixed(1) : "  --  ", 550);
  const displayPress = useScramble(weatherData?.current ? weatherData.current.main.pressure : "  --  ", 480);

  useEffect(() => {
    const cached = localStorage.getItem("domenico_location");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setCoords({ lat: parsed.lat, lon: parsed.lon });
        setPlaceName(parsed.name);
      } catch (e) {}
    }
    setInit(false);
  }, [setPlaceName]);

  useEffect(() => {
    if (location && location.lat && location.lon) {
      setCoords(location);
      getPlaceName(location.lat, location.lon).then((name) => {
        if (name) {
          localStorage.setItem(
            "domenico_location",
            JSON.stringify({ lat: location.lat, lon: location.lon, name }),
          );
        }
      });
      setSearchOpen(false);
    }
  }, [location, getPlaceName]);

  const handleLocationSelect = (loc) => {
    setCoords({ lat: loc.lat, lon: loc.lon });
    setPlaceName(loc.name);
    localStorage.setItem("domenico_location", JSON.stringify(loc));
    setSearchOpen(false);
  };

  let alertLevel = "NORMAL";
  if (weatherData && weatherData.current) {
    const w = weatherData.current;
    alertLevel = getAlertLevel(
      w.weather[0].id,
      w.wind.speed,
      w.rain ? w.rain["1h"] : 0,
    );
  }

  const [dismissAlert, setDismissAlert] = useState(false);
  useEffect(() => {
    setDismissAlert(false);
  }, [weatherData]);

  const [muted, setMuted] = useState(
    () => localStorage.getItem("nerv_muted") === "true",
  );

  const toggleMute = () => {
    setMuted((m) => {
      localStorage.setItem("nerv_muted", !m);
      return !m;
    });
  };

  const prevAlertRef = useRef("NORMAL");

  useEffect(() => {
    const prev = prevAlertRef.current;
    const curr = alertLevel;

    if (curr === prev) return;

    const grid = document.querySelector(".app-grid");
    if (grid) {
      grid.classList.remove(
        "alert-caution",
        "alert-warning",
        "alert-evangelion",
      );
      if (curr === "CAUTION") grid.classList.add("alert-caution");
      if (curr === "WARNING") {
        grid.classList.add("alert-warning");
        if (!muted) playWarningBeep();
      }
      if (curr === "EVANGELION") {
        grid.classList.add("alert-evangelion");
        if (!muted) playSiren();
      }
    }

    if (prev === "EVANGELION" && curr !== "EVANGELION") stopSiren();

    prevAlertRef.current = curr;
  }, [alertLevel, muted]);

  function handleDismiss() {
    stopSiren();
    if (!muted) playDismissBeep();
    setDismissAlert(true);
    setTimeout(() => setDismissAlert(false), 30000);
  }

  if (init) {
    return (
      <div
        style={{
          height: "100dvh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="blink"
          style={{ color: "var(--col-primary)", fontSize: "1.5rem" }}
        >
          [ SYSTEM INITIALIZING... ]
        </div>
      </div>
    );
  }

  const formatLocationName = (name) => {
    if (!name) return "AWAITING UPLINK";
    // Clean up display for massive text
    const parts = name.split(", ");
    if (parts.length > 2) {
      return `${parts[0]}, \n${parts[1]}`;
    }
    return name;
  };

  const getAlertColor = () => {
    if (alertLevel === "NORMAL") return "var(--col-green)";
    if (alertLevel === "CAUTION") return "var(--col-alert-caution)";
    if (alertLevel === "WARNING") return "var(--col-primary-bright)";
    return "#CC0000";
  };

  return (
    <>
      <NervActivation />
      <div className="scanline-bg" />
      <div className="app-container app-grid">
        {/* ROW 1: HEADER */}
        <header className="master-header">
          <div className="header-left">
            <h1 className="nerv-title">
              <span className="nerv-title-full">D.O.M.E.N.I.C.O</span>
              <span className="nerv-title-short">DOMENICO</span>
            </h1>
            <div className="header-sub">
              <span className="live-dot"></span>BMKG MEWS / REGION:{" "}
              {placeName ? placeName.split(",").pop().trim() : "UNKNOWN"}
            </div>
          </div>
          <div
            className="header-right"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <button
              onClick={toggleMute}
              style={{
                background: "transparent",
                border: "1px solid var(--col-primary)",
                color: "var(--col-primary)",
                padding: "2px 6px",
                fontSize: "10px",
                cursor: "pointer",
                fontFamily: "monospace",
              }}
            >
              {muted ? "[ UNMUTE ]" : "[ MUTE ]"}
            </button>
            <LiveClock />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginLeft: '10px' }}>
              <div className="status-label">STATUS:</div>
              <div
                className="status-value blink"
                style={{ color: getAlertColor() }}
              >
                {alertLevel}
              </div>
            </div>
          </div>
        </header>

        {/* ROW 2: MAIN DASHBOARD */}
        {searchOpen ? (
          <main className="dashboard-main" style={{ margin: "0 16px" }}>
            <div
              style={{
                flex: 1,
                border: "1px solid var(--col-primary)",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="target-loc-header"
                style={{ marginBottom: "1rem" }}
              >
                <span>
                  <IconSearch /> TARGET ACQUISITION OVERRIDE
                </span>
                <div className="action-buttons">
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="warning"
                  >
                    <IconClose /> CANCEL
                  </button>
                </div>
              </div>
              <SearchPanel onLocationSelect={handleLocationSelect} />
            </div>
          </main>
        ) : (
          <>
            <main className="panels-row">
              {/* LEFT COLUMN */}
              <div className="main-panel-left dash-left nerv-panel">
                <div className="target-loc-header location-row">
                  <span>
                    <IconLocation /> TARGET LOCATION
                  </span>
                  <div className="action-buttons">
                    <button 
                      onClick={handleLocate} 
                      className={`btn-locate ${locateState === 'locating' ? 'locating' : ''}`}
                      title="Gunakan lokasi GPS kamu"
                    >
                      <span className="locate-icon">
                        {locateState === 'success' ? '●' : locateState === 'error' ? '✕' : locateState === 'locating' ? '◌' : '⊙'}
                      </span>
                      {locateLabel[locateState]}
                    </button>
                    <button onClick={() => setSearchOpen(true)}>
                      <IconSearch /> SEARCH
                    </button>
                  </div>
                </div>

                <div className="location-name">
                  {formatLocationName(placeName)}
                  {weatherError && (
                    <div style={{ fontSize: "1rem", color: "#CC0000" }}>
                      [ LINK ERROR: {weatherError} ]
                    </div>
                  )}
                </div>

                <div className="weather-center">
                  {weatherLoading ? (
                    <>
                      <div className="acquiring-data">ACQUIRING DATA...</div>
                      <div className="temp-main" style={{ opacity: 0 }}>0<span className="temp-unit">°C</span></div>
                    </>
                  ) : weatherData?.current ? (
                    <>
                      <img
                        src={`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@4x.png`}
                        alt="icon"
                        className={`weather-icon-large ${isChanging ? 'changing' : ''}`}
                      />
                      <div className="temp-main">
                        {displayTemp}
                        <span className="temp-unit">°C</span>
                      </div>
                      <div className={`condition-main ${isChanging ? 'changing' : ''}`}>
                        {weatherData.current.weather[0].description}
                      </div>
                      <div className="weather-meta">
                        <span className="weather-meta-item">
                          FEELS LIKE{" "}
                          {Math.round(weatherData.current.main.feels_like)}°C
                        </span>
                        <span className="weather-meta-item">·</span>
                        <span className="weather-meta-item">
                          VISIBILITY{" "}
                          {(weatherData.current.visibility / 1000).toFixed(1)}KM
                        </span>
                      </div>
                      <div className="last-update">
                        LAST UPDATE:{" "}
                        {new Date(
                          weatherData.current.dt * 1000,
                        ).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}{" "}
                        WIB
                      </div>
                    </>
                  ) : (
                    <div
                      className="blink condition-main"
                      style={{ color: "var(--col-gray-dim)" }}
                    >
                      NO DATA
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="panel-right metrics-row">
                {weatherData?.current ? (
                  <>
                    <div className="metric-card nerv-panel">
                      <div className="metric-label">
                        <span className="label-code">SYS-01 //</span> CORE TEMP
                      </div>
                      <div className="metric-value">
                        {displayTemp}
                        <span className="metric-unit">°C</span>
                      </div>
                      <div className="metric-bar-track">
                        <div
                          className="metric-bar-fill normal"
                          style={{
                            width: `${weatherLoading ? 0 : Math.min((weatherData.current.main.temp / 50) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="metric-card nerv-panel">
                      <div className="metric-label">
                        <span className="label-code">SYS-02 //</span> HUMIDITY
                      </div>
                      <div className="metric-value">
                        {displayHumid}
                        <span className="metric-unit">%</span>
                      </div>
                      <div className="metric-bar-track">
                        <div
                          className={`metric-bar-fill ${weatherData.current.main.humidity > 90 ? "high" : "normal"}`}
                          style={{
                            width: `${weatherLoading ? 0 : weatherData.current.main.humidity}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="metric-card nerv-panel">
                      <div className="metric-label">
                        <span className="label-code">SYS-03 //</span> WIND VEL
                      </div>
                      <div className="metric-value">
                        {displayWind}
                        <span className="metric-unit">KPH</span>
                      </div>
                      <div className="metric-bar-track">
                        <div
                          className="metric-bar-fill normal"
                          style={{
                            width: `${weatherLoading ? 0 : Math.min(((weatherData.current.wind.speed * 3.6) / 100) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="metric-card nerv-panel">
                      <div className="metric-label">
                        <span className="label-code">SYS-04 //</span> PRESSURE
                      </div>
                      <div className="metric-value">
                        {displayPress}
                        <span className="metric-unit">HPA</span>
                      </div>
                      <div className="metric-bar-track">
                        <div
                          className="metric-bar-fill normal"
                          style={{
                            width: `${weatherLoading ? 0 : Math.max(Math.min(((weatherData.current.main.pressure - 970) / 60) * 100, 100), 0)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      border: "1px solid var(--col-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--col-primary)",
                    }}
                    className="blink nerv-panel"
                  >
                    [ AWAITING TELEMETRY ]
                  </div>
                )}
              </div>
            </main>

            {/* ROW 3: HOURLY STRIP */}
            {weatherData?.forecast && (
              <div className="hourly-section nerv-panel">
                <div className="nerv-separator"></div>
                <HourlyForecast forecastData={weatherData.forecast} />
              </div>
            )}
          </>
        )}

        {/* ROW 3: FOOTER */}
        <footer className="master-footer nerv-footer">
          <div className="footer-left footer-text">
            <span className="footer-text-full">
              Dynamic Operational Meteorological Evangelist Network of
              Indonesian Climate Oracle
            </span>
            <span className="footer-text-short">
              D.O.M.E.N.I.C.O WEATHER SYS
            </span>
            <a href="https://github.com/AllMuchalif2/domenico" target="_blank" rel="noopener noreferrer" className="btn-credit" title="Source Code">
              [ ⌥ SOURCE ]
            </a>
          </div>
          <div className="footer-right">
            <span className="uplink-box"></span> UPLINK ESTABLISHED
          </div>
        </footer>

        {/* EVANGELION OVERLAY */}
        <div style={{ position: "relative" }}>
          <EvaAlert
            active={alertLevel === "EVANGELION" && !dismissAlert}
            temperature={weatherData?.current?.main?.temp}
            locationName={placeName}
            onDismiss={handleDismiss}
          />
        </div>
      </div>
    </>
  );
}
