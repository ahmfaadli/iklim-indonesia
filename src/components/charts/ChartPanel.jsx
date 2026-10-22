export default function ChartPanel({ title, subtitle, children }) {
  return <section className="panel chart-panel"><div className="panel-heading"><div><h3>{title}</h3><p>{subtitle}</p></div></div>{children}</section>;
}
