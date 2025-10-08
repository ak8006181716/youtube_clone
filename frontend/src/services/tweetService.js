import api from './api'

export const createTweet = async (payload) => {
  const res = await api.post('/api/v1/tweets', payload)
  return res.data
}

export const getUserTweets = async (userId) => {
  const res = await api.get(`/api/v1/tweets/user/${userId}`)
  return res.data
}

export const updateTweet = async (tweetId, payload) => {
  const res = await api.patch(`/api/v1/tweets/${tweetId}`, payload)
  return res.data
}

export const deleteTweet = async (tweetId) => {
  const res = await api.delete(`/api/v1/tweets/${tweetId}`)
  return res.data
}

export const toggleTweetLike = async (tweetId) => {
  const res = await api.post(`/api/v1/likes/toggle/t/${tweetId}`)
  return res.data
}
