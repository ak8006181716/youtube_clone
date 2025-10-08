import api from './api'

export const getCurrentUser = async () => {
  const res = await api.get('/api/v1/users/current-user')
  return res.data
}

export const getUserChannelProfile = async (username) => {
  const res = await api.get(`/api/v1/users/c/${username}`)
  return res.data
}

export const getWatchHistory = async () => {
  const res = await api.get('/api/v1/users/history')
  return res.data
}

export const updateAccountDetails = async (payload) => {
  const res = await api.patch('/api/v1/users/update-account', payload)
  return res.data
}

export const updateUserAvatar = async (formData) => {
  const res = await api.patch('/api/v1/users/update-avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export const updateUserCoverImage = async (formData) => {
  const res = await api.patch('/api/v1/users/cover-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export const changePassword = async (payload) => {
  const res = await api.post('/api/v1/users/change-password', payload)
  return res.data
}
