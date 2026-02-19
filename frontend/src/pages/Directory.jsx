import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEmployees, deleteEmployee } from '../utils/api'
import { useAuth } from '../context/AuthContext'

const PALS = ['pal-a','pal-b','pal-c','pal-d','pal-e','pal-f','pal-g','pal-h']
function hsh(s) { let h=0; for(const c of s||'x') h=(h*31+c.charCodeAt(0))&0xffff; return h }
const pal = s => PALS[hsh(s) % PALS.length]
const ini = n => (n||'?').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()
const DEPT_COLORS = ['dp0','dp1','dp2','dp3','dp4','dp5','dp6']
const dc = s => DEPT_COLORS[hsh(s) % DEPT_COLORS.length]

export default function Directory() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error,   setError]       = useState('')
  const [q,       setQ]           = useState('')
  const [dept,    setDept]        = useState('')
  const [modal,   setModal]       = useState(null)

  const isHR = user?.role === 'HR'

  const load = () => {
    setLoading(true)
    getEmployees()
      .then(r => setEmployees(r.data))
      .catch(() => setError('Failed to load employees'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const remove = async (id) => {
    if (!window.confirm('Deactivate this employee?')) return
    try {
      await deleteEmployee(id)
      setModal(null)
      load()
    } catch { alert('Failed to remove employee') }
  }

  const mailEmp = (emp) => {
    navigate('/contact', { state: { target: emp } })
  }

  const depts = [...new Set(employees.map(e => e.department).filter(Boolean))].sort()

  const filtered = employees.filter(e => {
    const hay = [e.name, e.department, e.jobTitle, ...(e.skills || [])].join(' ').toLowerCase()
    return (!q || hay.includes(q.toLowerCase())) && (!dept || e.department === dept)
  })

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Everyone on board</p>
          <h1 className="page-title">The <em>Directory</em></h1>
        </div>
      </div>

      {error   && <div className="alert alert-err">{error}</div>}

      <div className="search-row">
        <input className="search-input" value={q} onChange={e=>setQ(e.target.value)}
          placeholder="🔍  Search name, skill, department…" />
        <select className="dept-sel" value={dept} onChange={e=>setDept(e.target.value)}>
          <option value="">All Departments</option>
          {depts.map(d=><option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {loading
        ? <div className="full-center"><div className="spinner" /></div>
        : filtered.length === 0
          ? <div className="empty-state"><div className="empty-emoji">🔎</div><p>No results found</p></div>
          : <div className="emp-grid">
              {filtered.map(e => (
                <div key={e.id} className="emp-card" onClick={()=>setModal(e)}>
                  <div className="emp-card-top">
                    <div className={`ec-av ${pal(e.name)}`}>{ini(e.name)}</div>
                    <div className="ec-name">{e.name}</div>
                    <div className="ec-role">{e.jobTitle || '—'}</div>
                  </div>
                  <div className="emp-card-body">
                    {e.department && <span className={`dept-pill ${dc(e.department)}`}>{e.department}</span>}
                    <div className="skill-wrap">
                      {(e.skills||[]).slice(0,3).map(s=><span key={s} className="skill-chip">{s}</span>)}
                      {(e.skills||[]).length > 3 && <span className="skill-chip">+{e.skills.length-3}</span>}
                    </div>
                  </div>
                  <div className="emp-card-foot">
                    <div className="exp-txt">
                      <strong>{e.experienceYears ?? '—'}</strong> yrs exp
                    </div>
                    <div className="card-btns" onClick={ev=>ev.stopPropagation()}>
                      <button className="btn-sm mail" onClick={()=>mailEmp(e)}>✉ Mail</button>
                      {isHR && <button className="btn-sm danger" onClick={()=>remove(e.id)}>Remove</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
      }

      {/* Detail Modal */}
      {modal && (
        <div className="modal-overlay" onClick={()=>setModal(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <div className={`modal-av ${pal(modal.name)}`}>{ini(modal.name)}</div>
              <div>
                <div className="modal-nm">{modal.name}</div>
                <div className="modal-tl">{modal.jobTitle}</div>
              </div>
              <button className="modal-x" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-row"><span className="dk">Department</span><span>{modal.department||'—'}</span></div>
              <div className="detail-row"><span className="dk">Experience</span><span>{modal.experienceYears != null ? `${modal.experienceYears} years` : '—'}</span></div>
              <div className="detail-row">
                <span className="dk">Skills</span>
                <div className="skill-wrap">
                  {(modal.skills||[]).map(s=><span key={s} className="skill-chip">{s}</span>)}
                  {!modal.skills?.length && '—'}
                </div>
              </div>
              <div className="detail-row"><span className="dk">About</span><span className="muted-italic">{modal.bio||'—'}</span></div>
              <div className="detail-row"><span className="dk">Email</span><span>{modal.email}</span></div>
            </div>
            <div className="modal-foot">
              <button className="btn-primary" onClick={()=>{setModal(null);mailEmp(modal)}}>✉ Send Mail</button>
              {isHR && <button className="btn-danger" onClick={()=>remove(modal.id)}>Deactivate</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
