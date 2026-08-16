import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function DashboardLayout({ role, title }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <Sidebar role={role} />
      <div className="pl-[260px]">
        <Header role={role} title={title} showSearch={role === 'admin' || role === 'trainer'} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
