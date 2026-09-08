import { Component } from 'react'
import { Button } from '../ui/Button'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg p-6">
          <div className="max-w-md w-full rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold text-foreground">Something went wrong</h1>
            <p className="text-sm text-muted mt-2">
              An unexpected error occurred. Please reload the app and try again.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-4 overflow-x-auto rounded-lg bg-subtle p-3 text-left text-xs text-red-500">
                {this.state.error.message}
              </pre>
            )}
            <Button className="mt-6 w-full" onClick={this.handleReset}>
              Return Home
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
