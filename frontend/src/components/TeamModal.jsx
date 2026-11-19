import { useState } from 'react'

function TeamModal({ saving, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'MEMBER' })

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal-card modal-card-small" role="dialog" aria-modal="true" aria-labelledby="team-modal-title">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">WORK TOGETHER</p>
            <h2 id="team-modal-title">Add a team member</h2>
          </div>
          <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Close dialog">×</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input name="name" value={form.name} onChange={updateField} placeholder="e.g. Alex Morgan" required maxLength={100} autoFocus />
          </label>
          <label>
            Email address
            <input name="email" type="email" value={form.email} onChange={updateField} placeholder="alex@company.com" required />
          </label>
          <label>
            Role
            <select name="role" value={form.role} onChange={updateField}>
              <option value="MEMBER">Member</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>
          <div className="modal-actions">
            <button className="button button-secondary" type="button" onClick={onClose} disabled={saving}>Cancel</button>
            <button className="button button-primary" type="submit" disabled={saving}>
              {saving ? 'Adding…' : 'Add member'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default TeamModal
