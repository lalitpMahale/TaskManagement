function StatCard({ label, value, icon, tone }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`} aria-hidden="true">{icon}</div>
      <p>{label}</p>
      <strong>{value}</strong>
      <span className="stat-caption">in your workspace</span>
    </article>
  )
}

export default StatCard
