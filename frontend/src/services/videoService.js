import api from './api'

export const fetchVideos = async (params = {}) => {
  const res = await api.get('/api/v1/videos/feed', { params })
  return res.data
}

export const fetchVideoById = async (videoId) => {
  const res = await api.get(`/api/v1/videos/${videoId}`)
  return res.data
}

export const publishVideo = async (formData) => {
  const res = await api.post('/api/v1/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export const updateVideo = async (videoId, payloadOrFormData) => {
  const res = await api.patch(`/api/v1/videos/${videoId}`, payloadOrFormData)
  return res.data
}

export const deleteVideo = async (videoId) => {
  const res = await api.delete(`/api/v1/videos/${videoId}`)
  return res.data
}

export const togglePublish = async (videoId) => {
  const res = await api.patch(`/api/v1/videos/toggle/publish/${videoId}`)
  return res.data
}

export const toggleVideoLike = async (videoId) => {
  const res = await api.post(`/api/v1/likes/toggle/v/${videoId}`)
  return res.data
}

export const fetchComments = async (videoId, params = {}) => {
  const res = await api.get(`/api/v1/comments/${videoId}`, { params })
  return res.data
}

export const addComment = async (videoId, content) => {
  const res = await api.post(`/api/v1/comments/${videoId}`, { content })
  return res.data
}

export const updateComment = async (commentId, content) => {
  const res = await api.patch(`/api/v1/comments/c/${commentId}`, { content })
  return res.data
}

export const deleteComment = async (commentId) => {
  const res = await api.delete(`/api/v1/comments/c/${commentId}`)
  return res.data
}