import { useState, useEffect } from 'react'
import { getDashboardStats } from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]  = useState('')

  useEffect(() => {
    getDashboardStats()
      .then(r => setStats(r.data))
      .catch(() => setError('Could not load stats'))
      .finally(() => setLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const cards = stats ? [
    { num: stats.totalEmployees,   label: 'Team Members',    color: 'var(--green)', emoji: '👥' },
    { num: stats.totalDepartments, label: 'Departments',     color: 'var(--rust)',  emoji: '🏢' },
    { num: stats.totalSkills,      label: 'Unique Skills',   color: 'var(--gold)',  emoji: '⚡' },
    { num: stats.avgExperience,    label: 'Avg. Exp. (yrs)', color: 'var(--sky)',   emoji: '📅' },
  ] : []

  const maxCount = stats?.departmentStats?.length
    ? Math.max(...stats.departmentStats.map(d => d.count))
    : 1

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">{greeting}, {user?.name?.split(' ')[0]} ☀️</p>
          <h1 className="page-title">Workforce <em>Overview</em></h1>
        </div>
      </div>

      {loading && <div className="full-center"><div className="spinner" /></div>}
      {error   && <div className="alert alert-err">{error}</div>}

      {stats && (
        <>
          <div className="stat-grid">
            {cards.map((c, i) => (
              <div className="stat-card" key={i} data-emoji={c.emoji}>
                <div className="stat-accent" style={{ background: c.color }} />
                <div className="stat-num" style={{ color: c.color }}>{c.num}</div>
                <div className="stat-label">{c.label}</div>
              </div>
            ))}
          </div>

          <div className="two-col">
            <div className="card">
              <div className="card-head"><span className="card-title">Department Distribution</span></div>
              <div className="card-body">
                {stats.departmentStats.length === 0
                  ? <p className="muted-text">No department data yet.</p>
                  : stats.departmentStats.map((d, i) => (
                    <div className="dept-item" key={d.department}>
                      <div className="dept-name">{d.department}</div>
                      <div className="dept-track">
                        <div className="dept-fill"
                          style={{ width: `${(d.count / maxCount * 100).toFixed(0)}%`, background: ['var(--green)','var(--rust)','var(--sky)','var(--gold)','#8a5aaa','#3a8a78'][i % 6] }} />
                      </div>
                      <div className="dept-count">{d.count}</div>
                    </div>
                  ))
                }
              </div>
            </div>

            <div className="card">
              <div className="card-head"><span className="card-title">Quick Stats</span></div>
              <div className="card-body">
                <div className="quick-stat-list">
                  <div className="qs-row"><span>Total Active</span><strong>{stats.totalEmployees}</strong></div>
                  <div className="qs-row"><span>Departments</span><strong>{stats.totalDepartments}</strong></div>
                  <div className="qs-row"><span>Skills Pool</span><strong>{stats.totalSkills}</strong></div>
                  <div className="qs-row"><span>Avg. Experience</span><strong>{stats.avgExperience} yrs</strong></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
