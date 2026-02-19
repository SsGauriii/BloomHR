import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ini(name = '') {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }
  const isHR = user?.role === 'HR'

  const navItems = [
    { to: '/dashboard', icon: '📊', label: 'Overview' },
    { to: '/directory', icon: '👥', label: 'Directory' },
    ...(!isHR ? [{ to: '/profile', icon: '✏️', label: 'My Profile' }] : []),
    { to: '/contact',   icon: '✉️', label: 'Contact HR' },
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sb-top">
          <div className="sb-brand">
            <div className="sb-leaf">🌿</div>
            <span className="sb-name">BloomHR</span>
          </div>

          <nav className="sb-nav">
            <p className="sb-section-label">Menu</p>
            {navItems.map(n => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
                <span className="sb-icon">{n.icon}</span>
                <span>{n.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sb-bottom">
          <div className="sb-user-card">
            <div className="sb-av">{ini(user?.name)}</div>
            <div className="sb-user-info">
              <p className="sb-user-name">{user?.name}</p>
              <p className="sb-user-role">{isHR ? 'HR Admin' : 'Employee'}</p>
            </div>
          </div>
          <button className="sb-logout" onClick={handleLogout}>Sign out</button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
