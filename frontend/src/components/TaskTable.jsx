const statusLabels = {
  PENDING: 'To do',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
}

const priorityLabels = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
}

function formatDueDate(dateValue) {
  if (!dateValue) return 'No due date'
  const date = new Date(dateValue)
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date)
}

function TaskTable({ tasks, onStatusChange, onDelete, onCreateTask }) {
  if (!tasks.length) {
    return (
      <div className="empty-state">
        <span className="empty-icon">✳</span>
        <h2>Nothing on your list yet</h2>
        <p>Create a task to get your workspace moving.</p>
        <button className="button button-primary" type="button" onClick={onCreateTask}>Create your first task</button>
      </div>
    )
  }

  return (
    <div className="task-table-wrap">
      <table className="task-table">
        <thead>
          <tr>
            <th scope="col">Task</th>
            <th scope="col">Assignee</th>
            <th scope="col">Due date</th>
            <th scope="col">Priority</th>
            <th scope="col">Status</th>
            <th scope="col"><span className="visually-hidden">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td className="task-name-cell">
                <span className={`task-check ${task.status === 'COMPLETED' ? 'checked' : ''}`} aria-hidden="true">
                  {task.status === 'COMPLETED' ? '✓' : ''}
                </span>
                <span>
                  <strong>{task.title}</strong>
                  {task.description && <small>{task.description}</small>}
                </span>
              </td>
              <td>
                <div className="assignee">
                  <span className="assignee-avatar">{task.assignedTo?.name?.slice(0, 1).toUpperCase() || '—'}</span>
                  {task.assignedTo?.name || 'Unassigned'}
                </div>
              </td>
              <td className="due-date">{formatDueDate(task.dueDate)}</td>
              <td>
                <span className={`priority priority-${task.priority?.toLowerCase() || 'medium'}`}>
                  <i />{priorityLabels[task.priority] || 'Medium'}
                </span>
              </td>
              <td>
                <label className="status-select-label">
                  <span className="visually-hidden">Status for {task.title}</span>
                  <select
                    className={`status-select status-${task.status?.toLowerCase()}`}
                    value={task.status}
                    onChange={(event) => onStatusChange(task._id, event.target.value)}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
              </td>
              <td className="task-actions-cell">
                <button
                  className="icon-button delete-button"
                  type="button"
                  onClick={() => onDelete(task._id)}
                  aria-label={`Delete ${task.title}`}
                  title="Delete task"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TaskTable
