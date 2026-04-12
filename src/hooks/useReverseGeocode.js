import { useState, useCallback } from 'react';

export const useReverseGeocode = () => {
  const [placeName, setPlaceName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPlaceName = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=14`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'DOMENICO-WeatherApp/1.0'
        }
      });
      if (!response.ok) throw new Error('OSM Reverse Geocode Failed');
      const data = await response.json();
      setPlaceName(data.display_name);
      return data.display_name;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { placeName, loading, error, getPlaceName, setPlaceName };
};
