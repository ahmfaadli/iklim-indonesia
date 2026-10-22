import {
  ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, BarChart, Bar,
} from 'recharts';

const axis = { stroke: '#9ca6ae', fontSize: 10 };
const grid = { stroke: '#1678ed', strokeOpacity: 0.25, strokeDasharray: '3 3' };
const tipStyle = { background: '#101820', border: '1px solid #1678ed', color: '#fff', borderRadius: 4 };

export function TrendChart({ data = [] }) {
  return <div className="chart-canvas"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 12, right: 14, left: -12, bottom: 4 }}><CartesianGrid {...grid} /><XAxis dataKey="label" tick={axis} /><YAxis tick={axis} /><Tooltip contentStyle={tipStyle} /><Legend /><Line type="monotone" dataKey="tempMin" name="Minimum" stroke="#5ba8ff" dot={false} connectNulls /><Line type="monotone" dataKey="temp" name="Rata-rata" stroke="#00bfd0" strokeWidth={2} dot={false} connectNulls /><Line type="monotone" dataKey="tempMax" name="Maksimum" stroke="#ffad5c" dot={false} connectNulls /></LineChart></ResponsiveContainer></div>;
}

export function RainChart({ data = [] }) {
  return <div className="chart-canvas"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 12, right: 14, left: -12, bottom: 4 }}><CartesianGrid {...grid} /><XAxis dataKey="label" tick={axis} /><YAxis tick={axis} /><Tooltip contentStyle={tipStyle} /><Bar dataKey="rain" name="Curah hujan (mm)" fill="#1678ed" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div>;
}

export function YearChart({ data = [] }) {
  return <div className="chart-canvas"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 12, right: 18, left: -12, bottom: 4 }}><CartesianGrid {...grid} /><XAxis dataKey="year" tick={axis} /><YAxis yAxisId="temp" tick={axis} /><YAxis yAxisId="humidity" orientation="right" tick={axis} /><Tooltip contentStyle={tipStyle} /><Legend /><Line yAxisId="temp" type="monotone" dataKey="temp" name="Suhu (°C)" stroke="#00bfd0" strokeWidth={2} dot={false} connectNulls /><Line yAxisId="humidity" type="monotone" dataKey="humidity" name="Kelembapan (%)" stroke="#b69aff" strokeWidth={2} dot={false} connectNulls /></LineChart></ResponsiveContainer></div>;
}

export function ProvinceChart({ data = [] }) {
  const rows = [...data].sort((a, b) => a.temp - b.temp);
  return <div className="province-chart"><ResponsiveContainer width="100%" height={Math.max(250, rows.length * 30)}><BarChart data={rows} layout="vertical" margin={{ top: 8, right: 22, left: 8, bottom: 8 }}><CartesianGrid {...grid} horizontal={false} /><XAxis type="number" tick={axis} /><YAxis type="category" dataKey="name" width={145} tick={{ fill: '#e1e5e8', fontSize: 10 }} /><Tooltip contentStyle={tipStyle} /><Bar dataKey="temp" name="Suhu rata-rata (°C)" fill="#00bfd0" radius={[0, 3, 3, 0]} /></BarChart></ResponsiveContainer></div>;
}
