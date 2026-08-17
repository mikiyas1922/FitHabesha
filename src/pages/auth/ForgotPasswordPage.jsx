import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { BrandMark } from '../../components/brand/BrandMark'
import { ThemeToggle } from '../../components/ui/ThemeToggle'
import { useAuth } from '../../contexts/AuthContext'

export function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [message, setMessage] = useState('')

  const resetPageLink = useMemo(
    () => `/reset-password?email=${encodeURIComponent(email.trim())}`,
    [email]
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await forgotPassword(email.trim())
      setMessage(
        response.message ||
          'If an account exists for this email, a password reset link has been sent.'
      )
      setSent(true)
    } catch (err) {
      setError(err.message || 'Unable to send reset link. Please try again.')
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
          <h2 className="text-3xl font-bold text-foreground mb-4">Reset your password</h2>
          <p className="text-muted leading-relaxed">
            Enter the email linked to your Fit Habesha account and we&apos;ll send a password reset link.
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

          {sent ? (
            <div className="rounded-2xl border border-border bg-surface p-8 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail className="size-7" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
              <p className="mt-3 text-sm text-muted leading-relaxed">{message}</p>
              <p className="mt-4 text-sm text-muted">
                Sent to <span className="font-medium text-foreground">{email}</span>
              </p>

              <div className="mt-6 rounded-lg border border-border bg-subtle p-4 text-left text-sm text-muted">
                <p className="font-medium text-foreground mb-1">Next steps</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Open the reset email from Brevo.</li>
                  <li>Click the reset link or copy the token from the email.</li>
                  <li>On the reset page, enter the same email, paste the token, and set a new password.</li>
                </ol>
              </div>

              <Link to={resetPageLink} className="block mt-6">
                <Button className="w-full" size="lg">
                  Continue to Reset Password
                </Button>
              </Link>
              <Link to="/login" className="block mt-3">
                <Button variant="secondary" className="w-full" size="lg">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-foreground">Forgot password?</h1>
              <p className="mt-2 text-sm text-muted">
                Enter your email address and we&apos;ll send a password reset link.
              </p>

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

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted">
                Remember your password?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
