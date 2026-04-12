export const getWeatherInfo = (code) => {
  if (code === 0) return { label: 'CLEAR SKY', alertLevel: 'NORMAL', color: '#FF6600' };
  if (code >= 1 && code <= 3) return { label: 'PARTLY CLOUDY', alertLevel: 'NORMAL', color: '#FF6600' };
  if (code >= 45 && code <= 48) return { label: 'FOGGY', alertLevel: 'CAUTION', color: '#FFCC00' };
  if (code >= 51 && code <= 57) return { label: 'DRIZZLE', alertLevel: 'CAUTION', color: '#FFCC00' };
  if (code >= 61 && code <= 67) return { label: 'RAIN', alertLevel: 'CAUTION', color: '#FFCC00' };
  if (code >= 71 && code <= 77) return { label: 'SNOW / ICE', alertLevel: 'WARNING', color: '#FF3300' };
  if (code >= 80 && code <= 82) return { label: 'HEAVY SHOWERS', alertLevel: 'WARNING', color: '#FF3300' };
  if (code >= 85 && code <= 86) return { label: 'SNOW SHOWERS', alertLevel: 'WARNING', color: '#FF3300' };
  if (code === 95) return { label: 'THUNDERSTORM', alertLevel: 'EVANGELION', color: '#CC0000' };
  if (code >= 96 && code <= 99) return { label: 'SEVERE THUNDERSTORM', alertLevel: 'EVANGELION', color: '#CC0000' };
  return { label: 'UNKNOWN ANOMALY', alertLevel: 'CAUTION', color: '#FFCC00' };
};
