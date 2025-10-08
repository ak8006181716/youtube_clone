import api from './api'

export const createPlaylist = async (payload) => {
  const res = await api.post('/api/v1/playlists', payload)
  return res.data
}

export const getUserPlaylists = async (userId) => {
  const res = await api.get(`/api/v1/playlists/user/${userId}`)
  return res.data
}

export const getPlaylistById = async (playlistId) => {
  const res = await api.get(`/api/v1/playlists/${playlistId}`)
  return res.data
}

export const updatePlaylist = async (playlistId, payload) => {
  const res = await api.patch(`/api/v1/playlists/${playlistId}`, payload)
  return res.data
}

export const deletePlaylist = async (playlistId) => {
  const res = await api.delete(`/api/v1/playlists/${playlistId}`)
  return res.data
}

export const addVideoToPlaylist = async (videoId, playlistId) => {
  const res = await api.patch(`/api/v1/playlists/add/${videoId}/${playlistId}`)
  return res.data
}

export const removeVideoFromPlaylist = async (videoId, playlistId) => {
  const res = await api.patch(`/api/v1/playlists/remove/${videoId}/${playlistId}`)
  return res.data
}
