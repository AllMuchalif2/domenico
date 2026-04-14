import React, { useState, useEffect } from "react";
import { initAudio, playBootBeep } from "../utils/nervAudio";

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
        backgroundColor: "#0a0a0a",
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
      <h1 style={{ fontSize: "3rem", margin: 0, letterSpacing: "0.1em" }}>
        DOMENICO
      </h1>
      <p
        style={{
          fontSize: "1rem",
          letterSpacing: "0.2em",
          color: "var(--nerv-muted, #777)",
          marginBottom: "3rem",
        }}
      >
        Dynamic Operational Meteorological Evangelist Network of Indonesian
        Climate Oracle
      </p>

      <button
        onClick={handleActivate}
        style={{
          border: "2px solid var(--nerv-orange, #ff5500)",
          backgroundColor: "transparent",
          color: "var(--nerv-orange, #ff5500)",
          padding: "1rem 3rem",
          fontSize: "1.5rem",
          cursor: "pointer",
          letterSpacing: "0.1em",
          fontWeight: "bold",
          transition: "all 0.2s",
          fontFamily: "monospace",
        }}
        onMouseOver={(e) =>
          (e.target.style.backgroundColor = "var(--nerv-orange, #ff5500)")
        }
        onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
        onMouseEnter={(e) => (e.target.style.color = "#000")}
        onMouseLeave={(e) =>
          (e.target.style.color = "var(--nerv-orange, #ff5500)")
        }
      >
        [ ACTIVATE ]
      </button>
    </div>
  );
}
