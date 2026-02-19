import { createContext, useContext, useState, useEffect } from 'react'
import * as api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on page refresh
  useEffect(() => {
    const stored = localStorage.getItem('bloomhr_user')
    const token  = localStorage.getItem('bloomhr_token')
    if (stored && token) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    setLoading(false)
  }, [])

  const loginFn = async (email, password) => {
    const res = await api.login(email, password)
    const { token, user } = res.data
    localStorage.setItem('bloomhr_token', token)
    localStorage.setItem('bloomhr_user',  JSON.stringify(user))
    setUser(user)
    return user
  }

  const logoutFn = () => {
    localStorage.removeItem('bloomhr_token')
    localStorage.removeItem('bloomhr_user')
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const res = await api.getMyProfile()
      const updated = res.data
      localStorage.setItem('bloomhr_user', JSON.stringify(updated))
      setUser(updated)
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, loading, login: loginFn, logout: logoutFn, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
