export default function StatCard({ icon, label, value, unit, detail, color = 'cyan', loading = false }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-top"><span className="stat-icon">{icon}</span><span className="stat-label">{label}</span></div>
      <div className="stat-value">{loading ? '…' : value}<small>{unit}</small></div>
      <div className="stat-detail">{detail}</div>
    </div>
  );
}
