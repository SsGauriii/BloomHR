import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { sendContact } from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function Contact() {
  const { user }   = useAuth()
  const location   = useLocation()
  const target     = location.state?.target

  const [category, setCategory] = useState('General')
  const [form, setForm] = useState({
    senderName:  user?.name  || '',
    senderEmail: user?.email || '',
    subject:     target ? `Hello ${target.name?.split(' ')[0]}` : '',
    message:     target ? `Hi ${target.name?.split(' ')[0]},\n\n` : '',
  })
  const [sending, setSending] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const CATEGORIES = ['General', 'Leave Request', 'Payroll', 'Feedback', 'Other']

  const submit = async e => {
    e.preventDefault()
    if (!form.message.trim()) { setError('Please write a message'); return }
    setError(''); setSending(true)
    try {
      await sendContact({ ...form, category })
      setSent(true)
    } catch (ex) {
      setError(ex.response?.data?.error || 'Failed to send. Please try again.')
    } finally { setSending(false) }
  }

  const reset = () => {
    setSent(false)
    setForm(p => ({ ...p, subject: '', message: '' }))
    setCategory('General')
  }

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Reach out</p>
          <h1 className="page-title">Contact <em>HR</em></h1>
        </div>
      </div>

      <div className="contact-layout">
        {/* Info Panel */}
        <div className="contact-info">
          <div className="ci-badge">HR Team</div>
          <h2 className="ci-heading">We're here<br/>for you</h2>
          <p className="ci-sub">Questions, leave requests, feedback or a quick chat — we respond within 24 hours.</p>

          {[
            { icon:'✉️', label:'General',  val:'hr@yourcompany.com' },
            { icon:'📋', label:'Benefits', val:'benefits@yourcompany.com' },
            { icon:'📞', label:'Hotline',  val:'+1 800 555 0199' },
            { icon:'⏱️', label:'Response', val:'Within 24 business hours' },
          ].map(m => (
            <div className="contact-row" key={m.label}>
              <div className="cr-icon">{m.icon}</div>
              <div>
                <div className="cr-label">{m.label}</div>
                <div className="cr-value">{m.val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Panel */}
        <div className="card">
          <div className="card-head"><span className="card-title">Send a Message</span></div>
          <div className="card-body">
            {!sent ? (
              <form onSubmit={submit}>
                {error && <div className="alert alert-err" style={{marginBottom:16}}>{error}</div>}

                <div className="cat-row">
                  {CATEGORIES.map(c => (
                    <button key={c} type="button"
                      className={`cat-btn${category===c?' active':''}`}
                      onClick={() => { setCategory(c); if(c!=='General') set('subject',`[${c}] `) }}>
                      {c}
                    </button>
                  ))}
                </div>

                <div className="form-row">
                  <div className="field">
                    <label>Your Name</label>
                    <input value={form.senderName} onChange={e=>set('senderName',e.target.value)} placeholder="Jane Doe" required />
                  </div>
                  <div className="field">
                    <label>Your Email</label>
                    <input type="email" value={form.senderEmail} onChange={e=>set('senderEmail',e.target.value)} placeholder="jane@company.com" required />
                  </div>
                </div>
                <div className="field">
                  <label>Subject</label>
                  <input value={form.subject} onChange={e=>set('subject',e.target.value)} placeholder="Brief subject line…" required />
                </div>
                <div className="field">
                  <label>Message</label>
                  <textarea value={form.message} onChange={e=>set('message',e.target.value)}
                    placeholder="Write your message here…" rows={6} required />
                </div>
                <button className="btn-primary" type="submit" disabled={sending}>
                  {sending ? 'Sending…' : 'Send Message →'}
                </button>
              </form>
            ) : (
              <div className="sent-state">
                <div className="sent-icon">📬</div>
                <h3>Message Sent!</h3>
                <p>HR has received your message and will reply within 24 hours.<br/>Check your inbox for a confirmation.</p>
                <button className="btn-outline" onClick={reset}>Send another message</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
