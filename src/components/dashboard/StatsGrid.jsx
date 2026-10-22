import { Activity, CloudRain, Droplets, Wind } from 'lucide-react';
import StatCard from './StatCard';
import { fmt } from '../../utils/format';

export default function StatsGrid({ stats, loading }) {
  return <div className="stats-grid">
    <StatCard icon={<Activity />} label="Suhu rata-rata" value={fmt(stats.temp)} unit="°C" detail="Suhu udara 2 m" color="cyan" loading={loading} />
    <StatCard icon={<Droplets />} label="Kelembapan relatif" value={fmt(stats.humidity)} unit="%" detail="Rata-rata bulanan" color="violet" loading={loading} />
    <StatCard icon={<CloudRain />} label="Rata-rata hujan bulanan" value={fmt(stats.rain, 0)} unit="mm" detail="Rata-rata akumulasi bulanan" color="blue" loading={loading} />
    <StatCard icon={<Wind />} label="Kecepatan angin" value={fmt(stats.wind)} unit="m/s" detail="Rata-rata pada ketinggian 10 meter" color="amber" loading={loading} />
  </div>;
}
