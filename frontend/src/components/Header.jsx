function Header({ title, search, onSearch, onCreateTask }) {
  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span>Workspace</span>
        <span className="breadcrumb-divider">/</span>
        <strong>{title}</strong>
      </div>
      <div className="topbar-actions">
        <label className="search-box">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <span className="visually-hidden">Search tasks</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search tasks..."
          />
          <kbd>⌘ K</kbd>
        </label>
        <button className="topbar-add" type="button" onClick={onCreateTask} aria-label="Create a task">＋</button>
        <div className="topbar-avatar" aria-label="Workspace profile">L</div>
      </div>
    </header>
  )
}

export default Header
