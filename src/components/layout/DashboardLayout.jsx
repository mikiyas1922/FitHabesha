import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function DashboardLayout({ role, title }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar 
        role={role} 
        isMinimized={isSidebarMinimized} 
        onToggle={() => setIsSidebarMinimized(!isSidebarMinimized)}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={handleMobileMenuClose}
      />
      <div 
        className={`transition-all duration-300 ${isSidebarMinimized ? 'md:pl-[80px]' : 'md:pl-[260px]'}`}
      >
        <Header 
          role={role} 
          title={title} 
          showSearch={role === 'admin' || role === 'trainer'}
          onMobileMenuToggle={handleMobileMenuToggle}
        />
        <main className="p-4 md:p-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
