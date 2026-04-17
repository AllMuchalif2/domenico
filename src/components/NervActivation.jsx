import React, { useState, useEffect } from "react";
import { initAudio, playBootBeep } from "../utils/nervAudio";
import logoUrl from "../assets/icon.svg";

export default function NervActivation() {
  const [activated, setActivated] = useState(true); // default true before check
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("nerv_activated") !== "true") {
      setActivated(false);
    }
  }, []);

  const handleActivate = () => {
    sessionStorage.setItem("nerv_activated", "true");
    initAudio();
    playBootBeep();

    setFading(true);
    setTimeout(() => {
      setActivated(true);
    }, 600); // 0.6s css transition
  };

  if (activated) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "var(--col-bg)",
        color: "var(--nerv-orange, #ff5500)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.6s ease",
        fontFamily: "monospace", // Or standard app font
      }}
    >
      <img src={logoUrl} alt="DOMENICO LOGO" style={{ width: "120px", marginBottom: "1rem" }} />
      <h1 style={{ fontSize: "3rem", margin: 0, letterSpacing: "0.1em", color: "var(--col-primary)" }}>
        DOMENICO
      </h1>
      <p
        style={{
          fontSize: "1rem",
          letterSpacing: "0.2em",
          color: "var(--col-green)",
          marginBottom: "3rem",
        }}
      >
        Dynamic Operational Meteorological Evangelist Network of Indonesian
        Climate Oracle
      </p>

      <button
        onClick={handleActivate}
        style={{
          border: "2px solid var(--col-primary)",
          backgroundColor: "transparent",
          color: "var(--col-primary)",
          padding: "1rem 3rem",
          fontSize: "1.5rem",
          cursor: "pointer",
          letterSpacing: "0.1em",
          fontWeight: "bold",
          transition: "all 0.2s",
          fontFamily: "monospace",
        }}
        onMouseOver={(e) =>
          (e.target.style.backgroundColor = "var(--col-primary)")
        }
        onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
        onMouseEnter={(e) => (e.target.style.color = "var(--col-bg)")}
        onMouseLeave={(e) =>
          (e.target.style.color = "var(--col-primary)")
        }
      >
        [ ACTIVATE ]
      </button>
    </div>
  );
}
