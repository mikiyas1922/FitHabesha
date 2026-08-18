import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { BrandMark } from '../../components/brand/BrandMark'
import { ThemeToggle } from '../../components/ui/ThemeToggle'
import { useAuth } from '../../contexts/AuthContext'
import { getDashboardPath } from '../../utils/auth'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectTo = location.state?.from?.pathname || getDashboardPath(user.role)
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, user, navigate, location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const loggedInUser = await login({ email, password })
      const redirectTo = location.state?.from?.pathname || getDashboardPath(loggedInUser.role)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-bg">
      <div className="hidden lg:flex lg:w-1/2 bg-dark items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark/95 to-dark/80" />
        <div className="relative max-w-md">
          <BrandMark theme="dark" className="mb-8" />
          <h2 className="text-3xl font-bold text-foreground mb-4">Welcome back</h2>
          <p className="text-muted leading-relaxed">
            Sign in to access your dashboard. Manage members, track workouts, and grow your gym business with Fit Habesha.
          </p>
        </div>
      </div>

      <div className="relative flex w-full lg:w-1/2 items-center justify-center p-6">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <BrandMark />
          </div>

          <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
          <p className="mt-2 text-sm text-muted">Enter your credentials to continue</p>

          {location.state?.message && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-amber-800 dark:text-amber-200 text-sm">
              {location.state.message}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <Input
              label="EMAIL ADDRESS"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="PASSWORD"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                Remember me
              </label>

              <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
