export const getAlertLevel = (weatherCode, windSpeedMs, rain1h) => {
  // convert wind speed from m/s to km/h for trigger checking
  const windKmh = windSpeedMs ? windSpeedMs * 3.6 : 0;
  const rain = rain1h || 0;

  // 200–232 → EVANGELION (badai petir)
  // 900–906 → EVANGELION (extreme weather)
  if ((weatherCode >= 200 && weatherCode <= 232) || (weatherCode >= 900 && weatherCode <= 906) || windKmh > 60) {
    return 'EVANGELION';
  }

  // 500–531 → WARNING (hujan)
  if ((weatherCode >= 500 && weatherCode <= 531) || rain > 20) {
    return 'WARNING';
  }

  // 803–804 → CAUTION (mendung)
  // 300–321 → CAUTION (gerimis)
  if ((weatherCode >= 803 && weatherCode <= 804) || (weatherCode >= 300 && weatherCode <= 321)) {
    return 'CAUTION';
  }

  // 800–802 → NORMAL (cerah / sedikit berawan)
  return 'NORMAL';
};
