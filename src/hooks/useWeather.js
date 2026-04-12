import { useState, useEffect } from 'react';

export const useWeather = (lat, lon) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lon) return;
    setLoading(true);
    const key = import.meta.env.VITE_OWM_KEY;
    const base = 'https://api.openweathermap.org/data/2.5';

    Promise.all([
      fetch(`${base}/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=id`),
      fetch(`${base}/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=id&cnt=8`),
      fetch(`${base}/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`)
    ])
    .then(([r1, r2, r3]) => Promise.all([r1.json(), r2.json(), r3.json()]))
    .then(([current, forecast, aqi]) => {
      // Check if there was an API error like invalid key
      if (current.cod !== 200) {
        throw new Error(current.message || 'API Error');
      }
      setData({ current, forecast, aqi });
      setLoading(false);
    })
    .catch(err => { 
      setError(err.message); 
      setLoading(false); 
    });
  }, [lat, lon]);

  return { data, loading, error };
};
