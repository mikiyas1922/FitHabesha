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
    <div className={`min-h-screen bg-bg ${role === 'member' ? 'member-app' : ''}`}>
      <Sidebar 
        role={role} 
        isMinimized={isSidebarMinimized} 
        onToggle={() => setIsSidebarMinimized(!isSidebarMinimized)}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={handleMobileMenuClose}
      />
      <div 
        className={`transition-all duration-300 relative z-10 ${isSidebarMinimized ? 'md:pl-[80px]' : 'md:pl-[260px]'}`}
      >
        <Header 
          role={role} 
          title={title} 
          showSearch={role === 'admin' || role === 'trainer'}
          onMobileMenuToggle={handleMobileMenuToggle}
        />
        <main className="min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 lg:px-8 max-w-[1440px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
