import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {changePassword} from '../services/userService'

function ForgetPassword() {
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const onSubmit = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }
        setLoading(true)
        setError('')
        setSuccess('')
        try {
            const response = await changePassword({ email, newPassword, confirmPassword })
            setSuccess(response?.message)
            setEmail('')
            setNewPassword('')
        } catch (error) {
            setError(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }
  return (
    <div className='flex justify-center items-center py-10 min-h-screen bg-gradient-to-br from-red-700 via-white to-red-700 px-4'>
        <div className='w-full max-w-3xl bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6 border'>
            <h1 className='text-2xl font-bold py-2'>Forget Password</h1>
            <form className='space-y-4' onSubmit={onSubmit}>
                <input 
                type="email" 
                placeholder="Email" 
                className='inputfields w-full' 
                value={email} onChange={(e) => setEmail(e.target.value)} 
                required
                />
                <input 
                type="password" 
                placeholder="New Password" 
                className='inputfields w-full' 
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
                required
                />
                <input type="password" 
                placeholder="Confirm Password" 
                className='inputfields w-full' 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required
                />
                <button 
                type="submit" 
                className='btnn w-full' 
                disabled={loading}>{loading ? 'Submitting...' : 'Submit'}
                </button>
                <div className='text-center text-sm'>
                    <Link to='/login' className='text-blue-600 hover:underline'>Back to Login</Link>
                </div>
            </form>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
        </div>
    </div>
  )
}

export default ForgetPassword