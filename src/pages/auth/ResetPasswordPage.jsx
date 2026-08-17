import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { BrandMark } from '../../components/brand/BrandMark'
import { ThemeToggle } from '../../components/ui/ThemeToggle'
import { useAuth } from '../../contexts/AuthContext'
import {
  buildResetPasswordPayload,
  getResetPasswordErrorMessage,
  parseResetPasswordParams,
} from '../../utils/resetPasswordParams'

export function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const { token: routeToken } = useParams()
  const [searchParams] = useSearchParams()

  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const parsed = parseResetPasswordParams(searchParams, window.location.hash, routeToken)
    if (parsed.email) setEmail(parsed.email)
    if (parsed.token) setToken(parsed.token)
  }, [searchParams, routeToken])

  const tokenFromUrl = useMemo(
    () => parseResetPasswordParams(searchParams, window.location.hash, routeToken).token,
    [searchParams, routeToken]
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!token.trim()) {
      setError('Reset token is missing. Copy the token from your email and paste it below.')
      return
    }

    if (!email.trim()) {
      setError('Email is required.')
      return
    }

    setLoading(true)

    try {
      const payload = buildResetPasswordPayload({
        email,
        token,
        newPassword,
      })
      const response = await resetPassword(payload)
      setMessage(response.message || 'Password updated successfully.')
      setSuccess(true)
    } catch (err) {
      setError(getResetPasswordErrorMessage(err))
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
          <h2 className="text-3xl font-bold text-foreground mb-4">Create a new password</h2>
          <p className="text-muted leading-relaxed">
            Use the reset token from your email together with your account email address.
          </p>
        </div>
      </div>

      <div className="relative flex w-full lg:w-1/2 items-center justify-center p-6">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="size-4" />
            Back to sign in
          </Link>

          <div className="lg:hidden mb-8">
            <BrandMark />
          </div>

          {success ? (
            <div className="rounded-2xl border border-border bg-surface p-8 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                <CheckCircle2 className="size-7" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Password updated</h1>
              <p className="mt-3 text-sm text-muted leading-relaxed">{message}</p>
              <Button className="w-full mt-8" size="lg" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-foreground">Reset password</h1>
              <p className="mt-2 text-sm text-muted">
                Paste the token from your reset email, then choose a new password.
              </p>

              {tokenFromUrl && (
                <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm text-foreground">
                  Reset token detected from your email link.
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
                  label="RESET TOKEN"
                  type="text"
                  placeholder="Paste token from your email"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  autoComplete="one-time-code"
                />

                <Input
                  label="NEW PASSWORD"
                  type="password"
                  placeholder="Minimum 8 characters"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  label="CONFIRM PASSWORD"
                  type="password"
                  placeholder="Re-enter password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted">
                Need a new link?{' '}
                <Link to="/forgot-password" className="text-primary font-medium hover:underline">
                  Request reset again
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
