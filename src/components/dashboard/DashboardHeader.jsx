import { RefreshCw } from 'lucide-react';

export default function DashboardHeader({ year, setYear, loading, onReload }) {
  return <div className="section-heading">
    <div><h2>Rekapan data iklim</h2><p>Eksplorasi data historis iklim Indonesia periode 2015–2025</p></div>
    <div className="heading-controls"><label>Tahun data<select value={year} onChange={(event) => setYear(Number(event.target.value))}>{Array.from({ length: 11 }, (_, index) => 2015 + index).map((value) => <option key={value} value={value}>{value}</option>)}</select></label><button className="icon-button" onClick={onReload} title="Muat ulang data" disabled={loading}><RefreshCw size={16} className={loading ? 'spin' : ''} /></button></div>
  </div>;
}
