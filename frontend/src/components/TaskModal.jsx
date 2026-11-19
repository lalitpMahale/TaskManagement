import { useState } from 'react'

const today = new Date().toISOString().slice(0, 10)

function TaskModal({ users, saving, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    assignedTo: '',
  })

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      ...form,
      assignedTo: form.assignedTo || null,
    })
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">NEW TASK</p>
            <h2 id="task-modal-title">Add a task</h2>
          </div>
          <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Close dialog">×</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Task name
            <input name="title" value={form.title} onChange={updateField} placeholder="What needs to get done?" required maxLength={120} autoFocus />
          </label>
          <label>
            Description <span className="optional-label">Optional</span>
            <textarea name="description" value={form.description} onChange={updateField} placeholder="Add a few details..." rows="3" />
          </label>
          <div className="form-row">
            <label>
              Due date
              <input name="dueDate" type="date" min={today} value={form.dueDate} onChange={updateField} required />
            </label>
            <label>
              Priority
              <select name="priority" value={form.priority} onChange={updateField}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </label>
          </div>
          <label>
            Assign to <span className="optional-label">Optional</span>
            <select name="assignedTo" value={form.assignedTo} onChange={updateField}>
              <option value="">Unassigned</option>
              {users.map((user) => <option key={user._id} value={user._id}>{user.name}</option>)}
            </select>
          </label>
          <div className="modal-actions">
            <button className="button button-secondary" type="button" onClick={onClose} disabled={saving}>Cancel</button>
            <button className="button button-primary" type="submit" disabled={saving}>
              {saving ? 'Creating…' : 'Create task'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default TaskModal
