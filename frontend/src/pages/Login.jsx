import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../services/Auth.jsx'

const Login = () => {
// const input = document.getElementById("password");
// const toggle = document.getElementById("togglePassword");
// toggle.addEventListener("click", () => {
//   const isPassword = input.type === "password";
//   input.type = isPassword ? "text" : "password";
//   toggle.className = isPassword
//     ? "ri-eye-fill toggle-password"
//     : "ri-eye-off-fill toggle-password";
// });

  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
   <>
   <div className='flex justify-center items-center px-4 min-h-screen py-10 bg-gradient-to-br from-red-700 via-white to-red-700'>
     <div className='w-full max-w-md bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6 border'>
       <div className='text-center mb-6'>
         <h2 className='text-2xl font-bold'>Welcome back</h2>
         <p className='text-sm text-gray-600'>Sign in to continue to VideoTube</p>
       </div>
       <form onSubmit={onSubmit} className='space-y-4'>
         <div>
           <label className='block text-sm font-medium mb-1'>Email</label>
           <input type="email" placeholder="you@example.com" required value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} className='inputfields w-full' />
         </div>
         <div>
           <label className='block text-sm font-medium mb-1'>Password</label>
           <input type="password" placeholder="Enter your password" required autoComplete="current-password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} className='inputfields w-full' />
         </div>
         {error && <p className="text-red-500 text-sm">{error}</p>}
         <div className='flex items-center justify-between text-sm'>
           <label className='flex items-center gap-2'><input type="checkbox" />Remember me</label>
           <Link to='/forgetPassword' className='text-blue-600 hover:underline'>Forgot Password?</Link>
         </div>
         <button type="submit" className='btnn w-full' disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
       </form>
       <div className='mt-4 text-center text-sm'>
         <span className='text-gray-600'>New here? </span>
         <Link to='/register' className='text-blue-600 hover:underline'>Create an account</Link>
       </div>
     </div>
   </div>
   </>
  )
}

export default Login