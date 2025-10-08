import api from './api'

export const toggleSubscription = async (channelId) => {
  const res = await api.post(`/api/v1/subscriptions/c/${channelId}`)
  return res.data
}

export const getSubscribedChannels = async (subscriberId) => {
  const res = await api.get(`/api/v1/subscriptions/u/${subscriberId}`)
  return res.data
}

export const getUserChannelSubscribers = async (channelId) => {
  const res = await api.get(`/api/v1/subscriptions/c/${channelId}`)
  return res.data
}
