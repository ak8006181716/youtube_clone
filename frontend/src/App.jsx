import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Upload from './pages/Upload.jsx'
import VideoPlayer from './pages/VideoPlayer.jsx'
import Profile from './pages/Profile.jsx'
import Navbar from './components/Navbar.jsx'
import { AuthProvider, useAuth } from './services/Auth.jsx'

function Protected({children}) {
  const {user} = useAuth();
  if(!user) return <Navigate to='/login' />
  return children;
}

export default function App(){
  return (
    <AuthProvider>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/upload" element={<Protected><Upload/></Protected>} />
          <Route path="/video/:id" element={<VideoPlayer/>} />
          <Route path="/profile" element={<Protected><Profile/></Protected>} />
        </Routes>
      </div>
    </AuthProvider>
  )
}
