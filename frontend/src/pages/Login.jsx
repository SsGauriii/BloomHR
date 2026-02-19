import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as api from '../utils/api'

export default function Login() {
  const [tab,    setTab]    = useState('login')  // login | register
  const [role,   setRole]   = useState('EMPLOYEE')
  const [name,   setName]   = useState('')
  const [email,  setEmail]  = useState('')
  const [pass,   setPass]   = useState('')
  const [err,    setErr]    = useState('')
  const [busy,   setBusy]   = useState(false)

  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleLogin = async e => {
    e.preventDefault()
    setErr(''); setBusy(true)
    try {
      await login(email.trim(), pass)
      navigate('/dashboard')
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Login failed. Check your credentials.')
    } finally { setBusy(false) }
  }

  const handleRegister = async e => {
    e.preventDefault()
    if (!name.trim()) { setErr('Name is required'); return }
    setErr(''); setBusy(true)
    try {
      await api.register(name.trim(), email.trim(), pass, role)
      // auto-login after register
      await login(email.trim(), pass)
      navigate('/dashboard')
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Registration failed.')
    } finally { setBusy(false) }
  }

  return (
    <div className="login-page">
      <div className="login-bg-shape" />
      <div className="login-bg-shape2" />

      <div className="login-card">
        <div className="login-logo">
          <div className="logo-leaf">🌿</div>
          <span className="logo-text">Bloom<strong>HR</strong></span>
        </div>

        <div className="tab-row">
          <button className={`tab-btn${tab==='login'?' active':''}`} onClick={()=>{setTab('login');setErr('')}}>Sign In</button>
          <button className={`tab-btn${tab==='register'?' active':''}`} onClick={()=>{setTab('register');setErr('')}}>Register</button>
        </div>

        {err && <div className="alert alert-err">{err}</div>}

        <form onSubmit={tab==='login'?handleLogin:handleRegister}>
          {tab === 'register' && (
            <>
              <div className="field">
                <label>Full Name</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Doe" required />
              </div>
              <div className="field">
                <label>I am joining as</label>
                <select value={role} onChange={e=>setRole(e.target.value)}>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="HR">HR Admin</option>
                </select>
              </div>
            </>
          )}

          <div className="field">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" required minLength={6} />
          </div>

          <button className="btn-primary full" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : tab==='login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        <p className="login-hint">
          {tab==='login'
            ? "Don't have an account? "
            : "Already have an account? "}
          <button className="link-btn" onClick={()=>{setTab(tab==='login'?'register':'login');setErr('')}}>
            {tab==='login' ? 'Register here' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
