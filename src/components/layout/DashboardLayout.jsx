import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function DashboardLayout({ role, title }) {
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar role={role} />
      <div className="min-h-screen lg:pl-[260px]">
        <Header role={role} title={title} showSearch={role === 'admin' || role === 'trainer'} />
        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
