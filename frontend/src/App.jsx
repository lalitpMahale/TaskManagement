import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from './api.js'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import StatCard from './components/StatCard.jsx'
import TaskModal from './components/TaskModal.jsx'
import TaskTable from './components/TaskTable.jsx'
import TeamModal from './components/TeamModal.jsx'
import './App.css'

const EMPTY_STATS = {
  totalTasks: 0,
  pendingTasks: 0,
  inProgressTasks: 0,
  completedTasks: 0,
}

async function fetchWorkspaceData() {
  const [taskResponse, userResponse, statsResponse] = await Promise.all([
    apiRequest('/tasks'),
    apiRequest('/users'),
    apiRequest('/dashboard'),
  ])
  return {
    tasks: taskResponse.data ?? [],
    users: userResponse.data ?? [],
    stats: { ...EMPTY_STATS, ...statsResponse.data },
  }
}

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(EMPTY_STATS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [modal, setModal] = useState(null)

  useEffect(() => {
    let active = true
    fetchWorkspaceData()
      .then((data) => {
        if (!active) return
        setTasks(data.tasks)
        setUsers(data.users)
        setStats(data.stats)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const loadData = async () => {
    try {
      const data = await fetchWorkspaceData()
      setTasks(data.tasks)
      setUsers(data.users)
      setStats(data.stats)
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const retryLoading = async () => {
    setLoading(true)
    await loadData()
    setLoading(false)
  }

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return tasks.filter((task) => {
      const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter
      const matchesSearch = !query
        || task.title?.toLowerCase().includes(query)
        || task.description?.toLowerCase().includes(query)
        || task.assignedTo?.name?.toLowerCase().includes(query)
      return matchesStatus && matchesSearch
    })
  }, [search, statusFilter, tasks])

  const saveTask = async (taskData) => {
    setSaving(true)
    setError('')
    try {
      await apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      })
      setModal(null)
      setNotice('Your task has been created.')
      await loadData()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const saveTeamMember = async (memberData) => {
    setSaving(true)
    setError('')
    try {
      await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(memberData),
      })
      setModal(null)
      setNotice('Team member added.')
      await loadData()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const updateTaskStatus = async (taskId, status) => {
    setError('')
    try {
      await apiRequest(`/tasks/${taskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      await loadData()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const deleteTask = async (taskId) => {
    if (!window.confirm('Delete this task? This action cannot be undone.')) return
    setError('')
    try {
      await apiRequest(`/tasks/${taskId}`, { method: 'DELETE' })
      setNotice('Task deleted.')
      await loadData()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const openNewTask = () => {
    setError('')
    setModal('task')
  }

  const openNewMember = () => {
    setError('')
    setModal('team')
  }

  const pageTitle = activePage === 'Overview'
    ? 'Overview'
    : activePage === 'Tasks'
      ? 'Tasks'
      : 'Team'

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="main-panel">
        <Header
          title={pageTitle}
          search={search}
          onSearch={setSearch}
          onCreateTask={openNewTask}
        />

        <div className="page-content">
          {error && (
            <div className="alert alert-error" role="alert">
              <span>{error}</span>
              <button type="button" onClick={retryLoading}>Try again</button>
            </div>
          )}
          {notice && (
            <div className="alert alert-success" role="status">
              <span>{notice}</span>
              <button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')}>×</button>
            </div>
          )}

          {activePage === 'Team' ? (
            <section className="team-page">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">PEOPLE</p>
                  <h1>Your team</h1>
                  <p className="muted">Manage the people working on your projects.</p>
                </div>
                <button className="button button-primary" type="button" onClick={openNewMember}>
                  <span aria-hidden="true">＋</span> Add team member
                </button>
              </div>
              {loading ? (
                <div className="empty-state">Loading your team…</div>
              ) : users.length ? (
                <div className="team-grid">
                  {users.map((user) => (
                    <article className="team-card" key={user._id}>
                      <div className="avatar">{user.name?.slice(0, 1).toUpperCase()}</div>
                      <div className="team-card-copy">
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                      </div>
                      <span className="role-pill">{user.role?.toLowerCase()}</span>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">♙</span>
                  <h2>No team members yet</h2>
                  <p>Add people to assign them to tasks.</p>
                  <button className="button button-primary" type="button" onClick={openNewMember}>Add a member</button>
                </div>
              )}
            </section>
          ) : (
            <>
              {activePage === 'Overview' && (
                <>
                  <section className="welcome-row">
                    <div>
                      <p className="eyebrow">YOUR WORKSPACE</p>
                      <h1>Good work starts with a plan.</h1>
                      <p className="muted">Keep your projects moving, one task at a time.</p>
                    </div>
                    <div className="welcome-mark" aria-hidden="true">
                      <span>✦</span>
                      <i />
                      <b />
                    </div>
                  </section>

                  <section className="stats-grid" aria-label="Task summary">
                    <StatCard label="Total tasks" value={stats.totalTasks} icon="▤" tone="blue" />
                    <StatCard label="In progress" value={stats.inProgressTasks} icon="◷" tone="violet" />
                    <StatCard label="Completed" value={stats.completedTasks} icon="✓" tone="green" />
                    <StatCard label="To do" value={stats.pendingTasks} icon="○" tone="orange" />
                  </section>
                </>
              )}

              <section className="tasks-section">
                <div className="section-heading tasks-heading">
                  <div>
                    <p className="eyebrow">{activePage === 'Overview' ? 'STAY ON TRACK' : 'WORKSPACE'}</p>
                    <h2>{activePage === 'Overview' ? 'Recent tasks' : 'All tasks'}</h2>
                  </div>
                  <div className="task-controls">
                    <label className="filter-control">
                      <span className="visually-hidden">Filter tasks by status</span>
                      <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                        <option value="ALL">All statuses</option>
                        <option value="PENDING">To do</option>
                        <option value="IN_PROGRESS">In progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </label>
                    <button className="button button-secondary" type="button" onClick={openNewTask}>
                      <span aria-hidden="true">＋</span> New task
                    </button>
                  </div>
                </div>
                {loading ? (
                  <div className="empty-state">Loading tasks…</div>
                ) : (
                  <TaskTable
                    tasks={activePage === 'Overview' ? filteredTasks.slice(0, 5) : filteredTasks}
                    onStatusChange={updateTaskStatus}
                    onDelete={deleteTask}
                    onCreateTask={openNewTask}
                  />
                )}
              </section>
            </>
          )}
        </div>
      </main>

      {modal === 'task' && (
        <TaskModal
          users={users}
          saving={saving}
          onClose={() => setModal(null)}
          onSubmit={saveTask}
        />
      )}
      {modal === 'team' && (
        <TeamModal
          saving={saving}
          onClose={() => setModal(null)}
          onSubmit={saveTeamMember}
        />
      )}
    </div>
  )
}

export default App
