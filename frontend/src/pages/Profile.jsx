import { useState, useEffect } from 'react'
import { getMyProfile, updateMyProfile } from '../utils/api'
import { useAuth } from '../context/AuthContext'

const ini = n => (n||'?').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()

export default function Profile() {
  const { user, refreshUser } = useAuth()
  const [form,  setForm]  = useState({ name:'', jobTitle:'', department:'', experienceYears:'', skills:'', bio:'' })
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    getMyProfile()
      .then(r => {
        const u = r.data
        setForm({
          name:            u.name            || '',
          jobTitle:        u.jobTitle        || '',
          department:      u.department      || '',
          experienceYears: u.experienceYears != null ? String(u.experienceYears) : '',
          skills:          (u.skills||[]).join(', '),
          bio:             u.bio             || '',
        })
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }))

  const save = async e => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required'); return }
    setError(''); setSaving(true)
    try {
      const payload = {
        name:            form.name.trim(),
        jobTitle:        form.jobTitle.trim(),
        department:      form.department.trim(),
        experienceYears: form.experienceYears ? parseInt(form.experienceYears) : null,
        skills:          form.skills.split(',').map(s=>s.trim()).filter(Boolean),
        bio:             form.bio.trim(),
      }
      await updateMyProfile(payload)
      await refreshUser()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (ex) {
      setError(ex.response?.data?.error || 'Failed to save profile')
    } finally { setSaving(false) }
  }

  const previewSkills = form.skills.split(',').map(s=>s.trim()).filter(Boolean)

  if (loading) return <div className="full-center"><div className="spinner" /></div>

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Keep it current</p>
          <h1 className="page-title">My <em>Profile</em></h1>
        </div>
      </div>

      {error && <div className="alert alert-err">{error}</div>}
      {saved && <div className="alert alert-ok">✅ Profile saved successfully!</div>}

      <div className="profile-layout">
        {/* Live Preview Card */}
        <div className="preview-card">
          <div className="preview-top">
            <div className="preview-av" style={{background:'var(--green-lt)',color:'var(--green)'}}>
              {ini(form.name || user?.name)}
            </div>
            <div className="preview-nm">{form.name || 'Your Name'}</div>
            <div className="preview-tl">{form.jobTitle || 'Your Role'}</div>
          </div>
          <div className="preview-divider" />
          <div className="preview-info">
            <div className="pi-row"><span className="pi-k">Department</span><span className="pi-v">{form.department || '—'}</span></div>
            <div className="pi-row"><span className="pi-k">Experience</span><span className="pi-v">{form.experienceYears ? `${form.experienceYears} yrs` : '—'}</span></div>
            <div className="pi-row"><span className="pi-k">Skills</span><span className="pi-v">{previewSkills.slice(0,3).join(', ') || '—'}</span></div>
          </div>
          <div className="preview-email">{user?.email}</div>
        </div>

        {/* Form */}
        <div className="card">
          <div className="card-head"><span className="card-title">Edit Your Details</span></div>
          <div className="card-body">
            <form onSubmit={save}>
              <div className="form-row">
                <div className="field">
                  <label>Full Name *</label>
                  <input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Jane Doe" required />
                </div>
                <div className="field">
                  <label>Job Title</label>
                  <input value={form.jobTitle} onChange={e=>set('jobTitle',e.target.value)} placeholder="Senior Developer" />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Department</label>
                  <input value={form.department} onChange={e=>set('department',e.target.value)} placeholder="Engineering" />
                </div>
                <div className="field">
                  <label>Years of Experience</label>
                  <input type="number" value={form.experienceYears} onChange={e=>set('experienceYears',e.target.value)} placeholder="5" min="0" max="60" />
                </div>
              </div>
              <div className="field">
                <label>Skills <small>(comma-separated)</small></label>
                <input value={form.skills} onChange={e=>set('skills',e.target.value)} placeholder="React, Python, Figma, SQL…" />
              </div>
              <div className="field">
                <label>About Me</label>
                <textarea value={form.bio} onChange={e=>set('bio',e.target.value)}
                  placeholder="A short note about your work and interests…" rows={4} />
              </div>
              <div className="save-row">
                <button className="btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Profile'}
                </button>
                <span className="muted-text">Changes are visible to your whole team</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
