import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('accessToken') || null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      localStorage.setItem('accessToken', token)
    } else {
      delete api.defaults.headers.common['Authorization']
      localStorage.removeItem('accessToken')
    }
  }, [token])

  useEffect(() => {
    if (!user && token) {
      setLoading(true)
      api.get('/api/v1/users/current-user')
        .then(res => setUser(res.data?.data || null))
        .catch(() => { setUser(null); setToken(null) })
        .finally(() => setLoading(false))
    }
  }, [token, user])

  const login = async (payload) => {
    const res = await api.post('/api/v1/users/login', payload)
    const { accessToken, user: u } = res.data.data
    setToken(accessToken)
    setUser(u)
    localStorage.setItem('user', JSON.stringify(u))
    return u
  }

  const register = async (formData) => {
    // expects FormData with avatar and optional coverImages
    const res = await api.post('/api/v1/users/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  }

  const logout = async () => {
    try {
      await api.post('/api/v1/users/logout')
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem('user')
    }
  }

  const value = useMemo(() => ({ user, token, loading, login, logout, register, setUser, setToken }), [user, token, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)