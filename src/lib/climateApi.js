// Re-export kompatibilitas agar impor lama dari lib/climateApi tetap bekerja.
export {
  aggregateMonthly,
  aggregateProvince,
  aggregateYearly,
  fetchClimateData,
  fetchBmkgForecast,
} from '../services/climateApi';
