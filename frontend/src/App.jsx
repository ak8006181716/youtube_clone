import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Upload from './pages/Upload.jsx'
import VideoPlayer from './pages/VideoPlayer.jsx'
import Profile from './pages/Profile.jsx'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import { AuthProvider, useAuth } from './services/Auth.jsx'
import ForgetPassword from './pages/ForgetPassword.jsx'
import Subscriptions from './pages/Subscriptions.jsx'
import Shorts from './pages/Shorts.jsx'

function Protected({children}) {
  const {user} = useAuth();
  if(!user) return <Navigate to='/login' />
  return children;
}

function Layout({ children }) {
  const location = useLocation()
  const hideSidebarPages = ['/login', '/register', '/forgetPassword']
  const isVideoPage = location.pathname.startsWith('/video/')
  const showSidebar = !hideSidebarPages.includes(location.pathname) && !isVideoPage
  
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Navbar />
      {showSidebar && <Sidebar />}
      <div className={showSidebar ? 'md:ml-20 pt-14' : 'pt-14'}>
        {children}
      </div>
    </div>
  )
}

export default function App(){
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/forgetPassword" element={<ForgetPassword/>} />
          <Route path="/upload" element={<Protected><Upload/></Protected>} />
          <Route path="/video/:id" element={<VideoPlayer/>} />
          <Route path="/profile" element={<Protected><Profile/></Protected>} />
          <Route path="/subscriptions" element={<Subscriptions/>} />
          <Route path="/shorts" element={<Shorts/>} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}
