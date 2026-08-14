import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function DashboardLayout({ role, title }) {
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar role={role} />
      <div className="pl-64">
        <Header role={role} title={title} showSearch={role === 'admin' || role === 'trainer'} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
