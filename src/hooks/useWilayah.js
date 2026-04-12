import { useState, useCallback } from 'react';

// Use Vite proxy during development to bypass CORS, and emsifa for production.
const BASE = import.meta.env.DEV ? '/wilayah/api' : 'https://emsifa.github.io/api-wilayah-indonesia/api';

export const useWilayah = () => {
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const normalizeData = (data) => {
    const arr = Array.isArray(data) ? data : (data.data || []);
    return arr.map(item => ({
      code: item.id || item.code,
      name: item.name
    }));
  };

  const fetchProvinces = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASE}/provinces.json`);
      if (!resp.ok) throw new Error('Failed to fetch provinces');
      const data = await resp.json();
      setProvinces(normalizeData(data));
      setRegencies([]);
      setDistricts([]);
      setVillages([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRegencies = useCallback(async (provCode) => {
    if (!provCode) return;
    setLoading(true);
    try {
      const resp = await fetch(`${BASE}/regencies/${provCode}.json`);
      if (!resp.ok) throw new Error('Failed to fetch regencies');
      const data = await resp.json();
      setRegencies(normalizeData(data));
      setDistricts([]);
      setVillages([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDistricts = useCallback(async (regCode) => {
    if (!regCode) return;
    setLoading(true);
    try {
      const resp = await fetch(`${BASE}/districts/${regCode}.json`);
      if (!resp.ok) throw new Error('Failed to fetch districts');
      const data = await resp.json();
      setDistricts(normalizeData(data));
      setVillages([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVillages = useCallback(async (distCode) => {
    if (!distCode) return;
    setLoading(true);
    try {
      const resp = await fetch(`${BASE}/villages/${distCode}.json`);
      if (!resp.ok) throw new Error('Failed to fetch villages');
      const data = await resp.json();
      setVillages(normalizeData(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    provinces, regencies, districts, villages,
    fetchProvinces, fetchRegencies, fetchDistricts, fetchVillages,
    loading, error
  };
};
