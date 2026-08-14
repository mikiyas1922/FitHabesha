import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        } else {
          authService.clearSession()
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    const response = await authService.login(credentials)
    setUser(response.user)
    return response.user
  }

  const register = async (data, profileExtra = {}) => {
    const response = await authService.register(data, profileExtra)
    return response
  }

  const updateProfile = (updates) => {
    const updatedUser = authService.updateProfile(updates)
    if (updatedUser) {
      setUser(updatedUser)
    }
    return updatedUser
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
    }
  }

  const forgotPassword = async (email) => {
    return await authService.forgotPassword(email)
  }

  const resetPassword = async (data) => {
    return await authService.resetPassword(data)
  }

  const refreshUser = () => {
    if (authService.isAuthenticated()) {
      setUser(authService.getCurrentUser())
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateProfile,
        refreshUser,
        logout,
        forgotPassword,
        resetPassword,
        isAuthenticated: !!user && authService.isAuthenticated(),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
