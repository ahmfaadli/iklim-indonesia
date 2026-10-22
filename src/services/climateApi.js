import {
  fetchOpenMeteoHistory,
  fetchOpenMeteoForecast,
} from './openMeteo';

import { locations } from '../data/locations';

import {
  aggregateMonthly,
  aggregateProvince,
  aggregateYearly,
} from '../utils/climate';

export {
  aggregateMonthly,
  aggregateProvince,
  aggregateYearly,
};

// Cache hanya menyimpan data yang berhasil diperoleh.
const historyCache = new Map();
const historyRequests = new Map();

const forecastCache = new Map();
const forecastRequests = new Map();

function getHistoryKey(place, startYear, endYear) {
  return `${place.lat},${place.lon}:${startYear}-${endYear}`;
}

function getForecastKey(place) {
  return `${place.lat},${place.lon}`;
}

// Memungkinkan satu pemanggil membatalkan penantiannya
// tanpa membatalkan request yang mungkin digunakan pemanggil lain.
function waitWithSignal(promise, signal) {
  if (!signal) return promise;

  if (signal.aborted) {
    return Promise.reject(
      new DOMException('Permintaan dibatalkan.', 'AbortError')
    );
  }

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      signal.removeEventListener('abort', onAbort);
    };

    const onAbort = () => {
      cleanup();
      reject(
        new DOMException('Permintaan dibatalkan.', 'AbortError')
      );
    };

    signal.addEventListener('abort', onAbort, { once: true });

    promise.then(
      (result) => {
        cleanup();
        resolve(result);
      },
      (error) => {
        cleanup();
        reject(error);
      }
    );
  });
}

function getCachedHistory(place, startYear, endYear, signal) {
  const key = getHistoryKey(place, startYear, endYear);

  if (historyCache.has(key)) {
    return waitWithSignal(
      Promise.resolve(historyCache.get(key)),
      signal
    );
  }

  let request = historyRequests.get(key);

  if (!request) {
    request = fetchOpenMeteoHistory(
      place,
      startYear,
      endYear
    )
      .then((rows) => {
        historyCache.set(key, rows);
        return rows;
      })
      .finally(() => {
        if (historyRequests.get(key) === request) {
          historyRequests.delete(key);
        }
      });

    historyRequests.set(key, request);
  }

  return waitWithSignal(request, signal);
}

function getCachedForecast(place, signal) {
  const key = getForecastKey(place);

  if (forecastCache.has(key)) {
    return waitWithSignal(
      Promise.resolve(forecastCache.get(key)),
      signal
    );
  }

  let request = forecastRequests.get(key);

  if (!request) {
    request = fetchOpenMeteoForecast(place)
      .then((data) => {
        forecastCache.set(key, data);
        return data;
      })
      .finally(() => {
        if (forecastRequests.get(key) === request) {
          forecastRequests.delete(key);
        }
      });

    forecastRequests.set(key, request);
  }

  return waitWithSignal(request, signal);
}

export async function fetchClimateData({
  startYear = 2015,
  endYear = 2025,
  places = [],
  signal,
  onProgress = () => {},
}) {
  const results = [];
  const total = places.length;
  let done = 0;

  for (const place of places) {
    if (signal?.aborted) {
      throw new DOMException(
        'Permintaan dibatalkan.',
        'AbortError'
      );
    }

    const rows = await getCachedHistory(
      place,
      startYear,
      endYear,
      signal
    );

    if (signal?.aborted) {
      throw new DOMException(
        'Permintaan dibatalkan.',
        'AbortError'
      );
    }

    results.push({
      location: place.name,
      rows,
    });

    done += 1;
    onProgress({ done, total });
  }

  return results;
}

export async function fetchBmkgForecast(provinceName, signal) {
  const place = locations.find(
    (item) => item.name === provinceName
  );

  if (!place) return null;

  return getCachedForecast(place, signal);
}