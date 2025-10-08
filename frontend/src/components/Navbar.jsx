import React from 'react'
import { useState, } from 'react';
import { Menu, X } from 'lucide-react'; // Importing icons from lucide
import {Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/Auth.jsx'
const Navbar = () => {
     const [isOpen, setIsOpen] = useState(false);
    
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const handleLogout = async () => { await logout(); navigate('/login') }
  return (
    <>
        <nav className= 'flex flex-wrap justify-between items-center'>
            <div className='hidden md:flex flex-wrap items-center justify-between w-full p-4 bg-gray-800 text-white'>
            <h1 className='text-4xl text-shadow-red-700 font-bold  m-2'>video<span className='text-red-600'>Tube</span></h1>
            <div className='flex items-center space-x-4 flex-wrap'>
            <input type="text" placeholder="Search videos..." className='bg-white text-gray-700 m-2 w-2xl h-10 rounded-xl p-2 items-center' />
            
            <button className='bg-red-500 text-white px-4 py-2 rounded-xl m-2 hover:bg-red-600 shadow-2xl'>Search</button>
            </div>
            <ul className='flex space-x-4 text-lg m-2 font-semibold '>    
                <li><Link to="/">Home</Link></li>
                {user && <li><Link to="/upload"  className="hover:text-blue-400 cursor-pointer">Upload</Link></li>}
                {user && <li><Link to="/profile"  className="hover:text-blue-400 cursor-pointer">Profile</Link></li>}
                {!user && <li><Link to="/register">Register</Link></li>}
                {!user && <li><Link to="/login">Login</Link></li>}
                {user && <li><button onClick={handleLogout}>Logout</button></li>}
            </ul>
            </div>
            {/* Mobile Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="flex flex-col gap-4 mt-4 md:hidden">
          <li className="hover:text-blue-400 cursor-pointer">Home</li>
          <li className="hover:text-blue-400 cursor-pointer">Videos</li>
          <li className="hover:text-blue-400 cursor-pointer">About</li>
          <li className="hover:text-blue-400 cursor-pointer">Contact</li>
        </ul>
      )}
        </nav>
    </>
  )
}

export default Navbar