import { useEffect, useMemo, useState } from 'react';
import { locations } from './data/locations';
import { aggregateMonthly, aggregateProvince, aggregateYearly, fetchClimateData, fetchBmkgForecast } from './lib/climateApi';
import ClimateMap from './components/ClimateMap';
import { TrendChart, RainChart, YearChart, ProvinceChart } from './components/Charts';
import Hero from './components/layout/Hero';
import Footer from './components/layout/Footer';
import DashboardHeader from './components/dashboard/DashboardHeader';
import StatsGrid from './components/dashboard/StatsGrid';
import LocationFilter from './components/filters/LocationFilter';
import ChartPanel from './components/charts/ChartPanel';

function App() {
  const [year, setYear] = useState(2025);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(['DKI Jakarta']);
  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ done: 0, total: 1 });
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const load = () => setReloadKey((key) => key + 1);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const places = locations.filter((place) => selected.includes(place.name));
    setLoading(places.length > 0);
    setError('');
    setProgress({ done: 0, total: places.length });
    if (!places.length) {
      setLoading(false);
      return () => controller.abort();
    }
    fetchClimateData({ startYear: 2015, endYear: 2025, places, signal: controller.signal, onProgress: (value) => { if (active) setProgress(value); } })
      .then((results) => {
        if (!active) return;
        setDataset((previous) => {
          const merged = new Map(previous.map((row) => [`${row.location}:${row.month}`, row]));
          results.flatMap((result) => result.rows).forEach((row) => merged.set(`${row.location}:${row.month}`, row));
          return [...merged.values()];
        });
        setLastUpdated(new Date());
      })
      .catch((err) => { if (active && err.name !== 'AbortError') setError(err.message || 'Data historis tidak dapat dimuat.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [reloadKey, selected]);

  const forecastProvince = selected[0] || '';
  useEffect(() => {
    const controller = new AbortController();
    if (!forecastProvince) return () => controller.abort();
    fetchBmkgForecast(forecastProvince, controller.signal).catch((err) => {
      if (err.name !== 'AbortError') console.error('Gagal mengambil prakiraan:', err);
    });
    return () => controller.abort();
  }, [forecastProvince]);

  const monthly = useMemo(() => aggregateMonthly(dataset, selected, year), [dataset, selected, year]);
  const yearly = useMemo(() => aggregateYearly(dataset, selected), [dataset, selected]);
  const province = useMemo(() => aggregateProvince(dataset, year).filter((row) => selected.includes(row.name)), [dataset, year, selected]);
  const stats = useMemo(() => {
    const rows = dataset.filter((row) => selected.includes(row.location) && row.month.startsWith(`${year}-`));
    const avg = (key) => {
      const values = rows.map((row) => row[key]).filter(Number.isFinite);
      return values.length ? values.reduce((total, value) => total + value, 0) / values.length : null;
    };
    return { temp: avg('temp'), humidity: avg('humidity'), rain: avg('rain'), wind: avg('wind'), sun: avg('sunshine') };
  }, [dataset, selected, year]);
  const toggle = (name) => setSelected((previous) => {
    if (previous.includes(name)) return previous.filter((item) => item !== name);
    if (previous.length >= 3) return previous;
    return [...previous, name];
  });

  return <div className="app-shell">
    <Hero locations={locations} province={province} selected={selected} />
    <main className="dashboard" id="dashboard-content">
      <DashboardHeader year={year} setYear={setYear} loading={loading} onReload={load} />
      {error && <div className="alert"><strong>Data gagal dimuat.</strong> {error}<button onClick={load}>Coba lagi</button></div>}
      {loading && <div className="loading-line"><span /><div><strong>Mengambil data historis dari Open-Meteo…</strong><small>{progress.done} dari {progress.total} lokasi selesai. Pertama kali dapat memerlukan beberapa saat.</small></div></div>}
      <StatsGrid stats={stats} loading={loading} />
      <div className="main-grid">
        <section className="panel map-panel">
          <div className="panel-heading"><div><h3>Jelajahi Indonesia</h3><p>Pilih titik untuk memfilter data wilayah.</p></div><span className="count-pill">{selected.length} wilayah</span></div>
          <ClimateMap places={locations} provinceRows={province} selected={selected} onSelect={toggle} />
          <div className="map-foot"><span><i className="dot cyan" />Data suhu {year}</span><span>Basemap © OpenStreetMap</span></div>
        </section>
        <LocationFilter locations={locations} selected={selected} setSelected={setSelected} query={query} setQuery={setQuery} onToggle={toggle} />
      </div>
      <div className="charts-grid">
        <ChartPanel title="Rentang suhu bulanan" subtitle="Minimum, rata-rata, dan maksimum · °C"><TrendChart data={monthly} /></ChartPanel>
        <ChartPanel title="Pola curah hujan" subtitle="Akumulasi curah hujan per bulan · mm"><RainChart data={monthly} /></ChartPanel>
      </div>
      <div className="lower-grid"><ChartPanel title="Perubahan antartahun" subtitle="Suhu dan kelembapan rata-rata tahunan"><YearChart data={yearly} /></ChartPanel></div>
      <section className="panel province-panel">
        <div className="panel-heading"><div><h3>Suhu rata-rata per provinsi</h3><p>Perbandingan pada titik ibu kota untuk tahun {year}.</p></div><span className="count-pill">{province.length} titik</span></div>
        {province.length > 0 ? <ProvinceChart data={province} /> : <div className="empty large">{loading ? 'Menunggu data API…' : 'Pilih setidaknya satu wilayah untuk melihat perbandingan.'}</div>}
      </section>
      <Footer lastUpdated={lastUpdated} />
    </main>
  </div>;
}

export default App;
