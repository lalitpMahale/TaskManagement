const navigation = [
  { label: 'Overview', icon: '⌂' },
  { label: 'Tasks', icon: '▤' },
  { label: 'Team', icon: '♙' },
]

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#" onClick={(event) => event.preventDefault()}>
        <span className="brand-mark">t</span>
        <span>task<span className="brand-light">flow</span></span>
      </a>

      <p className="nav-caption">WORKSPACE</p>
      <nav className="main-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <button
            className={`nav-item${activePage === item.label ? ' active' : ''}`}
            key={item.label}
            type="button"
            onClick={() => onNavigate(item.label)}
            aria-current={activePage === item.label ? 'page' : undefined}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            {item.label}
            {item.label === 'Tasks' && <span className="nav-count">↗</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <span className="note-spark">✦</span>
          <strong>Make progress<br />every day.</strong>
          <span>Small steps add up.</span>
        </div>
        <div className="profile">
          <div className="profile-avatar">L</div>
          <div className="profile-copy">
            <strong>Workspace</strong>
            <span>Task manager</span>
          </div>
          <span className="profile-menu" aria-hidden="true">···</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
