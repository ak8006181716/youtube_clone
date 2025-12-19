import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Video, Users, User } from 'lucide-react'
import { useAuth } from '../services/Auth.jsx'

const Sidebar = () => {
  const location = useLocation()
  const { user } = useAuth()

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Video, label: 'Shorts', path: '/shorts' },
    { icon: Users, label: 'Subscriptions', path: '/subscriptions' },
    { icon: User, label: 'You', path: user ? '/profile' : '/login' }
  ]

  return (
    <div className="hidden md:block fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-20 bg-[#0f0f0f] text-white overflow-y-auto">
      <div className="flex flex-col py-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center px-2 py-3 hover:bg-[#272727] transition-colors ${
                isActive ? 'bg-[#272727]' : ''
              }`}
              title={item.label}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium text-center leading-tight">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar
