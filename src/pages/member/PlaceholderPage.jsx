import { Card } from '../../components/ui/Card'

export function PlaceholderPage({ title, description }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted mt-1">{description}</p>
      </div>
      <Card className="text-center py-12">
        <p className="text-muted">This section is coming soon.</p>
      </Card>
    </div>
  )
}
