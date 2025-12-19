import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../services/Auth.jsx'


const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '' })
  const [avatar, setAvatar] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('fullName', form.fullName)
      fd.append('username', form.username)
      fd.append('email', form.email)
      fd.append('password', form.password)
      if (avatar) fd.append('avatar', avatar)
      if (coverImage) fd.append('coverImages', coverImage)
      await register(fd)
      navigate('/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <div>
      <form onSubmit={onSubmit}>
        <div className='flex justify-center items-center py-10 min-h-screen bg-gradient-to-br from-red-700 via-white to-red-700 px-4'>
          <div className='w-full max-w-3xl bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6 border'>
            <div className='text-center mb-6'>
              <h2 className='text-2xl font-bold'>Create your account</h2>
              <p className='text-sm text-gray-600'>Join VideoTube to upload and share your videos</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-3'>
                <h3 className='text-sm font-semibold text-gray-700'>Account details</h3>
                <div>
                  <label className='block text-sm font-medium mb-1'>Full name</label>
                  <input type="text" placeholder='e.g. John Doe'  className='inputfields w-full' value={form.fullName} onChange={e=>setForm(f=>({...f, fullName: e.target.value}))} />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Username</label>
                  <input type="text" placeholder='e.g. johndoe' className='inputfields w-full' value={form.username} onChange={e=>setForm(f=>({...f, username: e.target.value}))} />
                  <p className='text-xs text-gray-500 mt-1'>Lowercase is preferred; it becomes your channel handle.</p>
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Email</label>
                  <input type="email" placeholder='you@example.com' className='inputfields w-full' value={form.email} onChange={e=>setForm(f=>({...f, email: e.target.value}))} />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Password</label>
                  <input type="password" className="inputfields w-full" placeholder='At least 8 characters' value={form.password} onChange={e=>setForm(f=>({...f, password: e.target.value}))} />
                </div>
              </div>

              <div className='space-y-3'>
                <h3 className='text-sm font-semibold text-gray-700'>Channel visuals</h3>
                <div className='bg-white p-3 border rounded-xl'>
                  <label className='block text-sm font-medium mb-1'>Avatar</label>
                  <div className='flex items-center justify-between gap-3'>
                    <p className='text-sm text-gray-600'>PNG/JPG, square image works best</p>
                    <input type="file" accept='image/*' aria-label='Select avatar image' onChange={e=>setAvatar(e.target.files?.[0] || null)} className='text-sm' />
                  </div>
                </div>
                <div className='bg-white p-3 border rounded-xl'>
                  <label className='block text-sm font-medium mb-1'>Cover image</label>
                  <div className='flex items-center justify-between gap-3'>
                    <p className='text-sm text-gray-600'>Optional banner for your channel</p>
                    <input type="file" accept='image/*' aria-label='Select cover image' onChange={e=>setCoverImage(e.target.files?.[0] || null)} className='text-sm' />
                  </div>
                </div>
                <div className='pt-1'>
                  <button type='submit' disabled={loading} className='btnn w-full'>{loading ? 'Registering...' : 'Create account'}</button>
                </div>
                {error && <p className='text-red-500 text-sm'>{error}</p>}
                <p className='text-xs text-gray-500 text-center'>By continuing you agree to our Terms and Privacy Policy.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    </>
  )
}

export default Register