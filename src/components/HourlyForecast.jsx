import React from 'react';

function HourlyForecast({ forecastData }) {
  if (!forecastData?.list) return null;

  const items = forecastData.list.slice(0, 6).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta'
    }),
    temp: Math.round(item.main.temp),
    icon: item.weather[0].icon,
    iconUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
    desc: item.weather[0].description.toUpperCase().slice(0, 10),
    isRain: item.weather[0].id >= 200 && item.weather[0].id <= 622,
  }));

  return (
    <div className="hourly-strip">
      {items.map((item, i) => (
        <div key={i} className={`hourly-card ${item.isRain ? 'rain' : ''}`}>
          <div className="hourly-time">{item.time}</div>
          <img src={item.iconUrl} alt="icon" className="hourly-icon" />
          <div className="hourly-temp">
            {item.temp}<span>°C</span>
          </div>
          <div className="hourly-desc">{item.desc}</div>
        </div>
      ))}
    </div>
  );
}

export default HourlyForecast;
