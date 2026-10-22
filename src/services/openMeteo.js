const ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

async function getJson(url, signal) {
  let response;

  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }

    throw new Error(
      'Tidak dapat terhubung ke Open-Meteo. Periksa koneksi internet Anda.'
    );
  }

  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');

    throw new Error(
      `Open-Meteo membatasi jumlah permintaan (HTTP 429). ${
        retryAfter
          ? `Coba kembali sekitar ${retryAfter} detik lagi.`
          : 'Tunggu beberapa saat sebelum mencoba kembali.'
      }`
    );
  }

  if (!response.ok) {
    throw new Error(
      `Permintaan Open-Meteo gagal (HTTP ${response.status}).`
    );
  }

  try {
    return await response.json();
  } catch {
    throw new Error('Respons data dari Open-Meteo tidak valid.');
  }
}

function average(values) {
  const validValues = values.filter(Number.isFinite);

  if (validValues.length === 0) {
    return null;
  }

  return (
    validValues.reduce((total, value) => total + value, 0) /
    validValues.length
  );
}

function sum(values) {
  const validValues = values.filter(Number.isFinite);

  if (validValues.length === 0) {
    return null;
  }

  return validValues.reduce((total, value) => total + value, 0);
}

export async function fetchOpenMeteoHistory(
  place,
  startYear = 2015,
  endYear = 2025,
  signal
) {
  if (!place || !Number.isFinite(Number(place.lat)) ||
      !Number.isFinite(Number(place.lon))) {
    throw new Error('Koordinat lokasi tidak valid.');
  }

  const params = new URLSearchParams({
    latitude: String(place.lat),
    longitude: String(place.lon),
    start_date: `${startYear}-01-01`,
    end_date: `${endYear}-12-31`,
    daily: [
      'temperature_2m_mean',
      'temperature_2m_min',
      'temperature_2m_max',
      'precipitation_sum',
      'wind_speed_10m_mean',
      'sunshine_duration',
      'relative_humidity_2m_mean',
    ].join(','),
    timezone: 'Asia/Jakarta',
  });

  const data = await getJson(`${ARCHIVE_URL}?${params}`, signal);

  if (!data.daily || !Array.isArray(data.daily.time)) {
    throw new Error(
      `Data historis ${place.name} tidak tersedia dari Open-Meteo.`
    );
  }

  const daily = data.daily;
  const monthly = new Map();

  daily.time.forEach((date, index) => {
    const month = date.slice(0, 7);

    if (!monthly.has(month)) {
      monthly.set(month, {
        location: place.name,
        month,
        tempValues: [],
        tempMinValues: [],
        tempMaxValues: [],
        humidityValues: [],
        rainValues: [],
        windValues: [],
        sunshineValues: [],
      });
    }

    const item = monthly.get(month);

    const addValue = (key, value) => {
      if (Number.isFinite(value)) {
        item[key].push(value);
      }
    };

    addValue('tempValues', daily.temperature_2m_mean?.[index]);
    addValue('tempMinValues', daily.temperature_2m_min?.[index]);
    addValue('tempMaxValues', daily.temperature_2m_max?.[index]);
    addValue('humidityValues', daily.relative_humidity_2m_mean?.[index]);
    addValue('rainValues', daily.precipitation_sum?.[index]);
    addValue('windValues', daily.wind_speed_10m_mean?.[index]);
    addValue('sunshineValues', daily.sunshine_duration?.[index]);
  });

  return [...monthly.values()].map((item) => ({
    location: item.location,
    month: item.month,
    temp: average(item.tempValues),
    tempMin: average(item.tempMinValues),
    tempMax: average(item.tempMaxValues),
    humidity: average(item.humidityValues),
    rain: sum(item.rainValues),
    wind: average(item.windValues),
    sunshine:
      average(item.sunshineValues) === null
        ? null
        : average(item.sunshineValues) / 3600,
  }));
}

export async function fetchOpenMeteoForecast(place, signal) {
  if (!place || !Number.isFinite(Number(place.lat)) ||
      !Number.isFinite(Number(place.lon))) {
    throw new Error('Koordinat lokasi untuk prakiraan tidak valid.');
  }

  const params = new URLSearchParams({
    latitude: String(place.lat),
    longitude: String(place.lon),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
    ].join(','),
    timezone: 'Asia/Jakarta',
    forecast_days: '7',
  });

  return getJson(`${FORECAST_URL}?${params}`, signal);
}