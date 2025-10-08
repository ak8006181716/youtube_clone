import api from './api'

export const toggleVideoLike = async (videoId) => {
  const res = await api.post(`/api/v1/likes/toggle/v/${videoId}`)
  return res.data
}

export const toggleCommentLike = async (commentId) => {
  const res = await api.post(`/api/v1/likes/toggle/c/${commentId}`)
  return res.data
}

export const toggleTweetLike = async (tweetId) => {
  const res = await api.post(`/api/v1/likes/toggle/t/${tweetId}`)
  return res.data
}

export const getLikedVideos = async () => {
  const res = await api.get('/api/v1/likes/videos')
  return res.data
}
