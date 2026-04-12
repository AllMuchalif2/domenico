import React, { useEffect, useState } from 'react';
import { useWilayah } from '../hooks/useWilayah';

export default function CascadingDropdown({ onLocationSelect }) {
  const { 
    provinces, regencies, districts, villages,
    fetchProvinces, fetchRegencies, fetchDistricts, fetchVillages,
    loading 
  } = useWilayah();

  const [provCode, setProvCode] = useState('');
  const [regCode, setRegCode] = useState('');
  const [distCode, setDistCode] = useState('');
  const [villCode, setVillCode] = useState('');

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  const handleProvChange = (e) => {
    const val = e.target.value;
    setProvCode(val);
    setRegCode('');
    setDistCode('');
    setVillCode('');
    fetchRegencies(val);
  };

  const handleRegChange = (e) => {
    const val = e.target.value;
    setRegCode(val);
    setDistCode('');
    setVillCode('');
    fetchDistricts(val);
  };

  const handleDistChange = (e) => {
    const val = e.target.value;
    setDistCode(val);
    setVillCode('');
    fetchVillages(val);
  };

  const handleVillChange = async (e) => {
    const val = e.target.value;
    setVillCode(val);
    
    if (val) {
      const village = villages.find(v => v.code === val);
      const dist = districts.find(d => d.code === distCode);
      const reg = regencies.find(r => r.code === regCode);
      const prov = provinces.find(p => p.code === provCode);
      
      const queryStr = `${village.name}, ${dist.name}, ${reg.name}, ${prov.name}`;
      
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryStr)}&format=json&countrycodes=id&limit=1`;
        const resp = await fetch(url, { headers: { 'User-Agent': 'DOMENICO-WeatherApp/1.0' } });
        const data = await resp.json();
        if (data && data.length > 0) {
          onLocationSelect({
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
            name: data[0].display_name
          });
        } else {
          alert('Coordinates for this precise region not found in OSM.');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <select className="nerv-input" value={provCode} onChange={handleProvChange}>
        <option value="">SELECT PROVINCE</option>
        {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
      </select>

      <select className="nerv-input" value={regCode} onChange={handleRegChange} disabled={!provCode}>
        <option value="">SELECT REGENCY/CITY</option>
        {regencies.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
      </select>

      <select className="nerv-input" value={distCode} onChange={handleDistChange} disabled={!regCode}>
        <option value="">SELECT DISTRICT</option>
        {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
      </select>

      <select className="nerv-input" value={villCode} onChange={handleVillChange} disabled={!distCode}>
        <option value="">SELECT VILLAGE / KELURAHAN</option>
        {villages.map(v => <option key={v.code} value={v.code}>{v.name}</option>)}
      </select>
      
      {loading && <div style={{ color: 'var(--nerv-orange)' }} className="blink">[ DOWNLOADING WILAYAH DATA... ]</div>}
    </div>
  );
}
