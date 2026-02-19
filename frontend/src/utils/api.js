import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('bloomhr_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('bloomhr_token')
      localStorage.removeItem('bloomhr_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──
export const login    = (email, password)   => api.post('/auth/login',    { email, password })
export const register = (name, email, password, role) =>
                         api.post('/auth/register', { name, email, password, role })

// ── Employees ──
export const getEmployees  = ()        => api.get('/employees')
export const getMyProfile  = ()        => api.get('/employees/me')
export const updateMyProfile = data    => api.put('/employees/me', data)
export const updateEmployee  = (id, d) => api.put(`/employees/${id}`, d)
export const deleteEmployee  = id      => api.delete(`/employees/${id}`)

// ── Dashboard ──
export const getDashboardStats = () => api.get('/dashboard/stats')

// ── Contact ──
export const sendContact = data => api.post('/contact/send', data)

export default api
