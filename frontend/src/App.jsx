import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Directory from './pages/Directory'
import Profile from './pages/Profile'
import Contact from './pages/Contact'
import Layout from './components/Layout'
import './styles.css'

function ProtectedRoute({ children, hrOnly = false }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="full-center"><div className="spinner" /></div>
  if (!user)   return <Navigate to="/login" replace />
  if (hrOnly && user.role !== 'HR') return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/contact"   element={<Contact />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
