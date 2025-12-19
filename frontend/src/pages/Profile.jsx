import React, { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../services/Auth.jsx'
import { getWatchHistory, getUserChannelProfile } from '../services/userService'
import { getUserPlaylists, createPlaylist } from '../services/playlistService'
import { getUserTweets } from '../services/tweetService'
import { getLikedVideos } from '../services/likeService'
import { getChannelVideos } from '../services/dashboardService'
import VideoCard from '../components/VideoCard'

const Profile = () => {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab') || 'overview'
  const [activeTab, setActiveTab] = useState(tabFromUrl)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [channelInfo, setChannelInfo] = useState(null)
  const [showPlaylistModal, setShowPlaylistModal] = useState(false)
  const [playlistForm, setPlaylistForm] = useState({ name: '', description: '' })
  const [creatingPlaylist, setCreatingPlaylist] = useState(false)
  const [data, setData] = useState({
    history: [],
    playlists: [],
    tweets: [],
    likedVideos: [],
    uploadedVideos: []
  })

  const loadData = useCallback(async (tab) => {
    if (!user) return
    
    setLoading(true)
    setError(null)
    try {
      switch (tab) {
        case 'history': {
          const historyRes = await getWatchHistory()
          // ApiResponse structure: { StatusCode, data, massage, success }
          // Service returns res.data which is the ApiResponse object, so access .data property
          const historyData = Array.isArray(historyRes?.data) ? historyRes.data : []
          setData(prev => ({ ...prev, history: historyData }))
          break
        }
        case 'playlists': {
          const playlistsRes = await getUserPlaylists(user._id)
          const playlistsData = Array.isArray(playlistsRes?.data) ? playlistsRes.data : []
          setData(prev => ({ ...prev, playlists: playlistsData }))
          break
        }
        case 'tweets': {
          const tweetsRes = await getUserTweets(user._id)
          const tweetsData = Array.isArray(tweetsRes?.data) ? tweetsRes.data : []
          setData(prev => ({ ...prev, tweets: tweetsData }))
          break
        }
        case 'liked': {
          const likedRes = await getLikedVideos()
          const likedData = Array.isArray(likedRes?.data) ? likedRes.data : []
          setData(prev => ({ ...prev, likedVideos: likedData }))
          break
        }
        case 'uploaded': {
          const uploadedRes = await getChannelVideos(user._id)
          const uploadedData = Array.isArray(uploadedRes?.data) ? uploadedRes.data : []
          setData(prev => ({ ...prev, uploadedVideos: uploadedData }))
          break
        }
      }
    } catch (err) {
      console.error(`Error loading ${tab}:`, err)
      setError(`Failed to load ${tab}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Load channel (self) profile info to get subscribers count
  useEffect(() => {
    if (!user) return
    const loadChannelInfo = async () => {
      try {
        const res = await getUserChannelProfile(user.username)
        const info = res?.data || res
        setChannelInfo(info)
      } catch (err) {
        console.error('Error loading channel profile:', err)
      }
    }
    loadChannelInfo()
  }, [user])

  // Update activeTab when URL query parameter changes
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') || 'overview'
    setActiveTab(tabFromUrl)
  }, [searchParams])

  useEffect(() => {
    if (user) {
      // Load data for overview tab (which needs all data)
      if (activeTab === 'overview') {
        // Load all data in parallel for overview
        const loadOverviewData = async () => {
          setLoading(true)
          setError(null)
          try {
            const [uploadedRes, playlistsRes, likedRes, tweetsRes, historyRes] = await Promise.all([
              getChannelVideos(user._id),
              getUserPlaylists(user._id),
              getLikedVideos(),
              getUserTweets(user._id),
              getWatchHistory()
            ])
            
            setData(prev => ({
              ...prev,
              uploadedVideos: Array.isArray(uploadedRes?.data) ? uploadedRes.data : [],
              playlists: Array.isArray(playlistsRes?.data) ? playlistsRes.data : [],
              likedVideos: Array.isArray(likedRes?.data) ? likedRes.data : [],
              tweets: Array.isArray(tweetsRes?.data) ? tweetsRes.data : [],
              history: Array.isArray(historyRes?.data) ? historyRes.data : []
            }))
          } catch (err) {
            console.error('Error loading overview data:', err)
            setError('Failed to load profile data. Please try again.')
          } finally {
            setLoading(false)
          }
        }
        loadOverviewData()
      } else {
        loadData(activeTab)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, activeTab])

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Please log in to view your profile</h2>
          <Link to="/login" className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600">
            Login
          </Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'uploaded', label: 'Uploaded Videos' },
    { id: 'playlists', label: 'Playlists' },
    { id: 'liked', label: 'Liked Videos' },
    { id: 'history', label: 'Watch History' },
    { id: 'tweets', label: 'Tweets' }
  ]

  const renderCompactVideos = (videos = [], emptyText) => {
    if (!videos.length) {
      return (
        <div className="text-center py-6 sm:py-8 text-gray-400 bg-[#181818] rounded-lg border border-[#303030]">
          {emptyText}
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {videos.map(video => (
          <Link
            key={video?._id}
            to={`/video/${video?._id}`}
            className="flex space-x-3 bg-[#181818] rounded-lg p-3 sm:p-4 border border-[#303030] hover:bg-[#272727] transition-colors group"
          >
            <img
              src={video?.thumbnail}
              alt={video?.title}
              className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white text-sm sm:text-base line-clamp-2 group-hover:text-red-500 transition-colors">
                {video?.title}
              </h4>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">{video?.views?.toLocaleString() || 0} views</p>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    // Data will be loaded by useEffect when activeTab changes
  }

  const handleCreatePlaylist = async (e) => {
    e?.preventDefault()
    if (!playlistForm.name.trim()) {
      setError('Playlist name is required')
      return
    }

    setCreatingPlaylist(true)
    setError(null)
    try {
      const payload = {
        name: playlistForm.name.trim(),
        description: playlistForm.description.trim() || ''
      }
      const res = await createPlaylist(payload)
      
      if (res?.success) {
        // Refresh playlists data
        if (activeTab === 'playlists') {
          await loadData('playlists')
        } else if (activeTab === 'overview') {
          // Reload overview data to update playlist count
          const playlistsRes = await getUserPlaylists(user._id)
          const playlistsData = Array.isArray(playlistsRes?.data) ? playlistsRes.data : []
          setData(prev => ({ ...prev, playlists: playlistsData }))
        }
        
        // Reset form and close modal
        setPlaylistForm({ name: '', description: '' })
        setShowPlaylistModal(false)
      } else {
        setError(res?.massage || 'Failed to create playlist')
      }
    } catch (err) {
      console.error('Error creating playlist:', err)
      setError(err?.response?.data?.massage || err?.message || 'Failed to create playlist. Please try again.')
    } finally {
      setCreatingPlaylist(false)
    }
  }

  const openPlaylistModal = () => {
    setShowPlaylistModal(true)
    setError(null)
    setPlaylistForm({ name: '', description: '' })
  }

  const closePlaylistModal = () => {
    setShowPlaylistModal(false)
    setPlaylistForm({ name: '', description: '' })
    setError(null)
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8 sm:py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <p className="mt-2 text-gray-400">Loading...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center py-8 sm:py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => {
              if (activeTab === 'overview') {
                loadData('uploaded')
                loadData('playlists')
                loadData('liked')
                loadData('tweets')
              } else {
                loadData(activeTab)
              }
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-[#181818] rounded-lg p-4 sm:p-6 shadow-lg border border-[#303030]">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Profile Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <img src={user.avatar} alt={user.fullName} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-[#303030]" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-white truncate">{user.fullName}</h4>
                    <p className="text-gray-400 text-sm">@{user.username}</p>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{user.email}</p>
                    <h3 className="text-xs sm:text-sm font-medium mt-1 text-gray-400">
                      {channelInfo?.subscribersCount?.toLocaleString() ?? 0} subscribers
                    </h3>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-[#0f0f0f] rounded-lg p-3 sm:p-4 border border-[#303030]">
                    <p className="text-xs sm:text-sm text-gray-400">Uploaded</p>
                    <p className="text-lg sm:text-xl font-bold text-white">{(data.uploadedVideos || []).length}</p>
                  </div>
                  <div className="bg-[#0f0f0f] rounded-lg p-3 sm:p-4 border border-[#303030]">
                    <p className="text-xs sm:text-sm text-gray-400">Playlists</p>
                    <p className="text-lg sm:text-xl font-bold text-white">{(data.playlists || []).length}</p>
                  </div>
                  <div className="bg-[#0f0f0f] rounded-lg p-3 sm:p-4 border border-[#303030]">
                    <p className="text-xs sm:text-sm text-gray-400">Liked</p>
                    <p className="text-lg sm:text-xl font-bold text-white">{(data.likedVideos || []).length}</p>
                  </div>
                  <div className="bg-[#0f0f0f] rounded-lg p-3 sm:p-4 border border-[#303030]">
                    <p className="text-xs sm:text-sm text-gray-400">Tweets</p>
                    <p className="text-lg sm:text-xl font-bold text-white">{(data.tweets || []).length}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-[#181818] rounded-lg p-4 sm:p-6 shadow-lg border border-[#303030]">
                <h4 className="font-semibold mb-3 sm:mb-4 text-white">Recent Uploads</h4>
                <div className="space-y-3">
                  {(data.uploadedVideos || []).slice(0, 3).map(video => (
                    <Link key={video._id} to={`/video/${video._id}`} className="flex space-x-3 hover:bg-[#272727] rounded-lg p-2 -m-2 transition-colors">
                      <img src={video.thumbnail} alt={video.title} className="w-20 h-14 sm:w-24 sm:h-16 object-cover rounded shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-white text-sm sm:text-base line-clamp-2 hover:text-red-500 transition-colors">{video.title}</h5>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1">{video.views?.toLocaleString() || 0} views</p>
                      </div>
                    </Link>
                  ))}
                  {(data.uploadedVideos || []).length === 0 && (
                    <p className="text-gray-400 text-sm">No videos uploaded yet</p>
                  )}
                </div>
              </div>

              <div className="bg-[#181818] rounded-lg p-4 sm:p-6 shadow-lg border border-[#303030]">
                <h4 className="font-semibold mb-3 sm:mb-4 text-white">Recent Playlists</h4>
                <div className="space-y-3">
                  {(data.playlists || []).slice(0, 3).map(playlist => (
                    <Link key={playlist._id} to={`/playlist/${playlist._id}`} className="block hover:bg-[#272727] rounded-lg p-2 -m-2 transition-colors">
                      <p className="font-medium text-white text-sm sm:text-base hover:text-red-500 transition-colors">{playlist.name}</p>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">{playlist.videos?.length || 0} videos</p>
                    </Link>
                  ))}
                  {(data.playlists || []).length === 0 && (
                    <p className="text-gray-400 text-sm">No playlists created yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 'uploaded':
        return (
          <div className='space-y-4 sm:space-y-6'>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white">Uploaded Videos</h3>
              <Link to="/upload" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base w-full sm:w-auto text-center">
                Upload New Video
              </Link>
            </div>
            {(!data.uploadedVideos || data.uploadedVideos.length === 0) ? (
              <div className="text-center py-8 sm:py-12 bg-[#181818] rounded-lg border border-[#303030]">
                <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-white">No videos uploaded yet</h4>
                <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">Upload your first video to start your channel.</p>
                <Link 
                  to="/upload" 
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-block text-sm sm:text-base"
                >
                  Upload Your First Video
                </Link>
              </div>
            ) : (
              <div className='space-y-3'>
                {renderCompactVideos(data.uploadedVideos, 'No videos uploaded yet')}
              </div>
            )}
          </div>
        )

      case 'playlists':
        return (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white">My Playlists</h3>
              <button 
                onClick={openPlaylistModal}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                Create Playlist
              </button>
            </div>
            {(data.playlists || []).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {data.playlists.map(playlist => (
                  <Link 
                    key={playlist._id} 
                    to={`/playlist/${playlist._id}`}
                    className="bg-[#181818] rounded-lg p-4 sm:p-6 border border-[#303030] hover:bg-[#272727] transition-colors group"
                  >
                    <h4 className="font-semibold mb-2 text-white group-hover:text-red-500 transition-colors line-clamp-1">{playlist.name}</h4>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{playlist.description}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{playlist.videos?.length || 0} videos</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 bg-[#181818] rounded-lg border border-[#303030]">
                <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-white">No playlists created yet</h4>
                <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">Organize your favorite videos into playlists!</p>
                <button 
                  onClick={openPlaylistModal}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  Create Your First Playlist
                </button>
              </div>
            )}
          </div>
        )

      case 'liked':
        return (
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white">Liked Videos</h3>
            {renderCompactVideos(
              (data.likedVideos || []).map(item => item.video).filter(Boolean),
              'No liked videos yet'
            )}
          </div>
        )

      case 'history':
        return (
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white">Watch History</h3>
            {renderCompactVideos(data.history, 'No watch history yet')}
          </div>
        )

      case 'tweets':
        return (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white">My Tweets</h3>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base w-full sm:w-auto">
                New Tweet
              </button>
            </div>
            {(data.tweets || []).length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {data.tweets.map(tweet => (
                  <div key={tweet._id} className="bg-[#181818] rounded-lg p-4 sm:p-6 border border-[#303030]">
                    <p className="mb-3 text-white text-sm sm:text-base">{tweet.content}</p>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs sm:text-sm text-gray-400">
                      <span>{new Date(tweet.createdAt).toLocaleDateString()}</span>
                      <div className="flex space-x-4">
                        <button className="hover:text-red-500 transition-colors">Edit</button>
                        <button className="hover:text-red-500 transition-colors">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 bg-[#181818] rounded-lg border border-[#303030]">
                <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-white">No tweets yet</h4>
                <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">Share your thoughts with the community!</p>
                <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base">
                  Write Your First Tweet
                </button>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Profile Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={user.fullName} 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 border-[#303030] object-cover" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 truncate">{user.fullName}</h1>
              <p className="text-sm sm:text-base text-gray-400 mb-2">@{user.username}</p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="text-xs sm:text-sm text-gray-400">
                  <span className="font-semibold text-white">{channelInfo?.subscribersCount?.toLocaleString() ?? 0}</span> subscribers
                </div>
                <div className="text-xs sm:text-sm text-gray-400">
                  <span className="font-semibold text-white">{(data.uploadedVideos || []).length}</span> videos
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs - Responsive */}
          <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
            <div className="flex space-x-1 bg-[#272727] rounded-lg p-1 min-w-max sm:min-w-0">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-2 sm:px-3 md:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#0f0f0f] text-red-500 shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-[#303030]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {renderContent()}
      </div>

      {/* Create Playlist Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#181818] rounded-lg p-4 sm:p-6 w-full max-w-md border border-[#303030]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Create New Playlist</h2>
              <button
                onClick={closePlaylistModal}
                className="text-gray-400 hover:text-white text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreatePlaylist}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-white">Playlist Name *</label>
                <input
                  type="text"
                  value={playlistForm.name}
                  onChange={(e) => setPlaylistForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter playlist name"
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#303030] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-white">Description</label>
                <textarea
                  value={playlistForm.description}
                  onChange={(e) => setPlaylistForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter playlist description (optional)"
                  rows="3"
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#303030] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>

              {error && (
                <div className="mb-4 text-red-400 text-sm bg-red-900/20 p-2 rounded">{error}</div>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={closePlaylistModal}
                  className="px-4 py-2 border border-[#303030] rounded-lg hover:bg-[#272727] text-white transition-colors order-2 sm:order-1"
                  disabled={creatingPlaylist}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors order-1 sm:order-2"
                  disabled={creatingPlaylist}
                >
                  {creatingPlaylist ? 'Creating...' : 'Create Playlist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile