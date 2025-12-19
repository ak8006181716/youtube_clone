import React, { useState } from 'react'
import { 
  Menu, 
  X, 
  Search, 
  Mic, 
  Bell, 
  Plus, 
  Home, 
  Video, 
  Users, 
  User, 
  Clock, 
  List, 
  Heart, 
  PlaySquare, 
  Download, 
  ChevronDown, 
  ChevronRight 
} from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../services/Auth.jsx'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    setIsOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results or handle search
      console.log('Searching for:', searchQuery)
    }
  }

  const mainMenuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Video, label: 'Shorts', path: '/shorts' },
    { icon: Users, label: 'Subscriptions', path: '/subscriptions' },
    { icon: User, label: 'You', path: user ? '/profile' : '/login' }
  ]

  const youMenuItems = [
    { icon: Clock, label: 'History', path: user ? '/profile?tab=history' : '/login' },
    { icon: List, label: 'Playlists', path: user ? '/profile?tab=playlists' : '/login' },
    { icon: Clock, label: 'Watch later', path: user ? '/profile?tab=history' : '/login' },
    { icon: Heart, label: 'Liked videos', path: user ? '/profile?tab=liked' : '/login' },
    { icon: PlaySquare, label: 'Your videos', path: user ? '/profile?tab=uploaded' : '/login' },
    { icon: Download, label: 'Downloads', path: user ? '/profile?tab=uploaded' : '/login' }
  ]

  const isActive = (path) => {
    if (path.includes('?')) {
      const [pathname, query] = path.split('?')
      const tab = query.split('=')[1]
      return location.pathname === pathname && location.search.includes(`tab=${tab}`)
    }
    return location.pathname === path
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 justify-between h-14 bg-[#0f0f0f] text-white z-50 flex items-center px-4">
      {/* Left Section */}
      <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
          <button
            className="p-2 hover:bg-[#272727] rounded-full"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="flex items-center space-x-1">
            <h1 className='hidden sm:block text-xl sm:text-2xl md:text-4xl text-shadow-red-700 font-bold m-2'>video<span className='text-red-600'>Tube</span></h1>
          </Link>
        </div>

      {/* Center Section - Search */}
      <div className="flex-1 flex items-center justify-center max-w-2xl mx-1 sm:mx-2 md:mx-4">
        <form onSubmit={handleSearch} className="flex-1 flex items-center min-w-0 max-w-full">
          <div className="flex-1 flex items-center bg-[#121212] border border-[#303030] rounded-l-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 focus-within:border-blue-500 min-w-0 max-w-[200px] sm:max-w-none">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-xs sm:text-sm min-w-0 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-[#222222] border border-l-0 border-[#303030] rounded-r-full px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 hover:bg-[#303030] shrink-0"
          >
            <Search size={16} className="sm:w-5 sm:h-5" />
          </button>
        </form>
        <button className="hidden sm:block ml-1 sm:ml-2 p-2 bg-[#222222] rounded-full hover:bg-[#303030] shrink-0">
          <Mic size={20} />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
        {user ? (
          <>
            <Link
              to="/upload"
              className="p-2 hover:bg-[#272727] rounded-full flex items-center space-x-1 shrink-0"
            >
              <Plus size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden lg:inline text-sm">Create</span>
            </Link>
            <button className="hidden sm:block relative p-2 hover:bg-[#272727] rounded-full shrink-0">
              <Bell size={20} />
              <span className="absolute top-1 right-1 bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                9+
              </span>
            </button>
            <Link
              to="/profile"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-600 flex items-center justify-center hover:ring-2 hover:ring-white shrink-0"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xs sm:text-sm font-semibold">
                  {user.fullName?.charAt(0) || 'U'}
                </span>
              )}
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-2 sm:px-4 py-2 text-xs sm:text-sm hover:bg-[#272727] rounded-full"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-2 sm:px-4 py-2 bg-blue-600 text-xs sm:text-sm hover:bg-blue-700 rounded-full"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>

    {/* Mobile Sidebar Menu */}
    {isOpen && (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Sidebar */}
        <div className="fixed top-0 left-0 h-full w-64 bg-[#0f0f0f] text-white z-50 overflow-y-auto animate-slide-in">
          <div className="flex flex-col h-full">
            {/* Close Button */}
            <div className="flex justify-end p-4 border-b border-[#303030]">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-[#272727] rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Main Menu Items */}
            <div className="py-2">
              {mainMenuItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-4 px-6 py-3 hover:bg-[#272727] transition-colors ${
                      active ? 'bg-[#272727]' : ''
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-[#303030] my-2" />

            {/* You Section */}
            <div className="py-2">
              <div className="px-6 py-3 flex items-center justify-between">
                <span className="text-sm font-semibold">You</span>
                <ChevronRight className="w-5 h-5" />
              </div>

              {/* You Menu Items */}
              {youMenuItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-4 px-6 py-3 hover:bg-[#272727] transition-colors ${
                      active ? 'bg-[#272727]' : ''
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                )
              })}

              {/* Show more */}
              <button
                onClick={() => setShowMore(!showMore)}
                className="flex items-center space-x-4 px-6 py-3 hover:bg-[#272727] transition-colors w-full"
              >
                <ChevronDown className={`w-6 h-6 transition-transform ${showMore ? 'rotate-180' : ''}`} />
                <span className="text-sm">Show more</span>
              </button>
            </div>

            {/* Additional items when Show more is expanded */}
            {showMore && (
              <div className="py-2 border-t border-[#303030]">
                {/* Add more menu items here if needed */}
              </div>
            )}

            {/* Logout button for logged in users */}
            {user && (
              <>
                <div className="border-t border-[#303030] my-2" />
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-4 px-6 py-3 hover:bg-[#272727] transition-colors text-left w-full"
                >
                  <span className="text-sm text-red-400">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </>
    )}
    </>
  )
}

export default Navbar