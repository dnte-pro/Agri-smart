// Open-Meteo client — no API key required.

export type Forecast = {
  current: { temperature: number; windspeed: number; weathercode: number; time: string };
  daily: { date: string; tMax: number; tMin: number; rainMm: number; code: number }[];
  location: { lat: number; lon: number; name: string };
};

const codeMap: Record<number, string> = {
  0: "Clear sky", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Rime fog",
  51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain",
  71: "Light snow", 73: "Snow", 75: "Heavy snow",
  80: "Rain showers", 81: "Heavy showers", 82: "Violent showers",
  95: "Thunderstorm", 96: "Thunderstorm w/ hail", 99: "Severe thunderstorm",
};

export const describe = (code: number) => codeMap[code] ?? "—";

export const emojiFor = (code: number) => {
  if (code === 0 || code === 1) return "☀️";
  if (code === 2) return "⛅";
  if (code === 3) return "☁️";
  if (code >= 45 && code <= 48) return "🌫️";
  if (code >= 51 && code <= 65) return "🌧️";
  if (code >= 71 && code <= 75) return "❄️";
  if (code >= 80 && code <= 82) return "🌦️";
  if (code >= 95) return "⛈️";
  return "🌤️";
};

export async function fetchForecast(lat = -1.286389, lon = 36.817223, name = "Nairobi"): Promise<Forecast> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto&forecast_days=7`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather fetch failed");
  const data = await res.json();
  return {
    current: {
      temperature: data.current_weather.temperature,
      windspeed: data.current_weather.windspeed,
      weathercode: data.current_weather.weathercode,
      time: data.current_weather.time,
    },
    daily: data.daily.time.map((d: string, i: number) => ({
      date: d,
      tMax: data.daily.temperature_2m_max[i],
      tMin: data.daily.temperature_2m_min[i],
      rainMm: data.daily.precipitation_sum[i],
      code: data.daily.weathercode[i],
    })),
    location: { lat, lon, name },
  };
}

export function recommendationsFor(forecast: Forecast): { tone: "info" | "warn" | "alert"; text: string }[] {
  const recs: { tone: "info" | "warn" | "alert"; text: string }[] = [];
  const next3Rain = forecast.daily.slice(0, 3).reduce((s, d) => s + d.rainMm, 0);
  if (next3Rain < 2) {
    recs.push({ tone: "warn", text: "Dry spell ahead — schedule irrigation for the next 3 days." });
  }
  if (next3Rain > 30) {
    recs.push({ tone: "alert", text: "Heavy rain expected — delay fertilizer applications and scout for fungal disease." });
  }
  const hot = forecast.daily.slice(0, 3).some((d) => d.tMax > 30);
  if (hot) recs.push({ tone: "warn", text: "High temperatures — mulch beds and irrigate early morning to reduce stress." });
  const cool = forecast.daily.slice(0, 3).some((d) => d.tMin < 10);
  if (cool) recs.push({ tone: "info", text: "Cool nights — frost-sensitive crops may need covers." });
  if (recs.length === 0) recs.push({ tone: "info", text: "Conditions look favourable. Stay on schedule." });
  return recs;
}
