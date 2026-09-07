import { Outlet } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function DashboardLayout({ role, breadcrumb }) {
  const [sidebarWidth, setSidebarWidth] = useState(260)
  const sidebarRef = useRef(null)

  useEffect(() => {
    if (!sidebarRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        setSidebarWidth(Math.round(width))
      }
    })

    resizeObserver.observe(sidebarRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      <Sidebar 
        role={role} 
        ref={sidebarRef}
      />
      <div className="transition-all duration-300" style={{ paddingLeft: `${sidebarWidth}px` }}>
        <Header role={role} breadcrumb={breadcrumb} showSearch={role === 'admin' || role === 'trainer'} />
        <main className="p-6">
          <div className="max-w-7xl mx-auto page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
