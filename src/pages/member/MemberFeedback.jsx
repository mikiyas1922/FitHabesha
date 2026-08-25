import { useState } from 'react'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'

export function MemberFeedback() {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    category: 'Trainer',
    rating: '5',
    comment: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.comment.trim()) return

    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setForm({ category: 'Trainer', rating: '5', comment: '' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Feedback</h2>
        <p className="text-sm text-muted mt-1">Share your experience and rate gym services.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit Feedback</CardTitle>
        </CardHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={[
                { value: 'Trainer', label: 'Trainer' },
                { value: 'Equipment', label: 'Equipment' },
                { value: 'Cleanliness', label: 'Cleanliness' },
                { value: 'Classes', label: 'Classes' },
                { value: 'General', label: 'General' },
              ]}
            />
            <Select
              label="Rating"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              options={[
                { value: '5', label: '5 - Excellent' },
                { value: '4', label: '4 - Good' },
                { value: '3', label: '3 - Average' },
                { value: '2', label: '2 - Poor' },
                { value: '1', label: '1 - Very Poor' },
              ]}
            />
          </div>
          <Input
            label="Your Feedback"
            placeholder="Tell us about your experience..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            required
          />
          <Button type="submit">Submit Feedback</Button>
          {submitted && (
            <p className="text-sm text-green-600">Thank you! Your feedback has been submitted.</p>
          )}
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Past Feedback</CardTitle>
        </CardHeader>
        <div className="p-4">
          {loading ? (
            <p className="text-sm text-muted">Loading your feedback history...</p>
          ) : feedback.length === 0 ? (
            <p className="text-sm text-muted">No feedback history available yet.</p>
          ) : (
            <div className="space-y-3">
              {feedback.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <Badge variant="default">{entry.category}</Badge>
                    <span className="text-sm font-medium text-primary">{entry.rating}/5</span>
                  </div>
                  <p className="text-sm text-foreground">{entry.comment}</p>
                  <p className="text-xs text-muted mt-2">{entry.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
