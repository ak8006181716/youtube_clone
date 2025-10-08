import api from './api'

export const getChannelStats = async (channelId) => {
  const res = await api.get(`/api/v1/dashboard/stats?channelId=${channelId}`)
  return res.data
}

export const getChannelVideos = async (channelId) => {
  const res = await api.get(`/api/v1/dashboard/videos?channelId=${channelId}`)
  return res.data
}
