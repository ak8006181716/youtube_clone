import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../services/Auth.jsx'
import { getWatchHistory } from '../services/userService'
import { getUserPlaylists } from '../services/playlistService'
import { getUserTweets } from '../services/tweetService'
import { getLikedVideos } from '../services/likeService'
import { getChannelVideos } from '../services/dashboardService'
import VideoCard from '../components/VideoCard'

const Profile = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
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
    try {
      switch (tab) {
        case 'history': {
          const historyRes = await getWatchHistory()
          setData(prev => ({ ...prev, history: historyRes.data || [] }))
          break
        }
        case 'playlists': {
          const playlistsRes = await getUserPlaylists(user._id)
          setData(prev => ({ ...prev, playlists: playlistsRes.data || [] }))
          break
        }
        case 'tweets': {
          const tweetsRes = await getUserTweets(user._id)
          setData(prev => ({ ...prev, tweets: tweetsRes.data || [] }))
          break
        }
        case 'liked': {
          const likedRes = await getLikedVideos()
          setData(prev => ({ ...prev, likedVideos: likedRes.data || [] }))
          break
        }
        case 'uploaded': {
          const uploadedRes = await getChannelVideos(user._id)
          setData(prev => ({ ...prev, uploadedVideos: uploadedRes.data || [] }))
          break
        }
      }
    } catch (error) {
      console.error(`Error loading ${tab}:`, error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      // Load data for overview tab (which needs all data)
      if (activeTab === 'overview') {
        loadData('uploaded')
        loadData('playlists')
        loadData('liked')
        loadData('tweets')
      } else {
        loadData(activeTab)
      }
    }
  }, [user, activeTab, loadData])

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

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    if (tabId !== 'overview') {
      loadData(tabId)
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">Profile Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <img src={user.avatar} alt={user.fullName} className="w-16 h-16 rounded-full" />
                  <div>
                    <h4 className="font-semibold">{user.fullName}</h4>
                    <p className="text-gray-600">@{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p><span className="font-medium">Uploaded Videos:</span> {(data.uploadedVideos || []).length}</p>
                  <p><span className="font-medium">Playlists:</span> {(data.playlists || []).length}</p>
                  <p><span className="font-medium">Liked Videos:</span> {(data.likedVideos || []).length}</p>
                  <p><span className="font-medium">Tweets:</span> {(data.tweets || []).length}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h4 className="font-semibold mb-3">Recent Uploads</h4>
                {/* {(data.uploadedVideos || []).slice(0, 3).map(video => (
                  <div key={video._id} className="flex space-x-3 mb-3">
                    <img src={video.thumbnail} alt={video.title} className="w-16 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <Link to={`/video/${video._id}`} className="font-medium hover:text-red-600">
                        {video.title}
                      </Link>
                      <p className="text-sm text-gray-500">{video.views} views</p>
                    </div>
                  </div>
                ))} */}
                {(data.uploadedVideos || []).length === 0 && (
                  <p className="text-gray-500">No videos uploaded yet</p>
                )}
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h4 className="font-semibold mb-3">Recent Playlists</h4>
                {(data.playlists || []).slice(0, 3).map(playlist => (
                  <div key={playlist._id} className="mb-3">
                    <Link to={`/playlist/${playlist._id}`} className="font-medium hover:text-red-600">
                      {playlist.name}
                    </Link>
                    <p className="text-sm text-gray-500">{playlist.videos?.length || 0} videos</p>
                  </div>
                ))}
                {(data.playlists || []).length === 0 && (
                  <p className="text-gray-500">No playlists created yet</p>
                )}
              </div>
            </div>
          </div>
        )

      case 'uploaded':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Uploaded Videos</h3>
              <Link to="/upload" className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                Upload New Video
              </Link>
            </div>
            {(data.uploadedVideos || []).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.uploadedVideos.map(video => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h4 className="text-lg font-semibold mb-4">No videos uploaded yet</h4>
                <p className="text-gray-600 mb-6">Start sharing your content with the world!</p>
                <Link to="/upload" className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600">
                  Upload Your First Video
                </Link>
              </div>
            )}
          </div>
        )

      case 'playlists':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">My Playlists</h3>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                Create Playlist
              </button>
            </div>
            {(data.playlists || []).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.playlists.map(playlist => (
                  <div key={playlist._id} className="bg-white rounded-lg p-6 shadow-md">
                    <h4 className="font-semibold mb-2">{playlist.name}</h4>
                    <p className="text-gray-600 text-sm mb-3">{playlist.description}</p>
                    <p className="text-sm text-gray-500">{playlist.videos?.length || 0} videos</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h4 className="text-lg font-semibold mb-4">No playlists created yet</h4>
                <p className="text-gray-600 mb-6">Organize your favorite videos into playlists!</p>
                <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600">
                  Create Your First Playlist
                </button>
              </div>
            )}
          </div>
        )

      case 'liked':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6">Liked Videos</h3>
            {(data.likedVideos || []).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.likedVideos.map(like => (
                  <VideoCard key={like.video?._id} video={like.video} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h4 className="text-lg font-semibold mb-4">No liked videos yet</h4>
                <p className="text-gray-600">Start exploring and liking videos!</p>
              </div>
            )}
          </div>
        )

      case 'history':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6">Watch History</h3>
            {(data.history || []).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.history.map(video => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h4 className="text-lg font-semibold mb-4">No watch history yet</h4>
                <p className="text-gray-600">Start watching videos to build your history!</p>
              </div>
            )}
          </div>
        )

      case 'tweets':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">My Tweets</h3>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                New Tweet
              </button>
            </div>
            {(data.tweets || []).length > 0 ? (
              <div className="space-y-4">
                {data.tweets.map(tweet => (
                  <div key={tweet._id} className="bg-white rounded-lg p-6 shadow-md">
                    <p className="mb-3">{tweet.content}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{new Date(tweet.createdAt).toLocaleDateString()}</span>
                      <div className="space-x-4">
                        <button className="hover:text-red-600">Edit</button>
                        <button className="hover:text-red-600">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h4 className="text-lg font-semibold mb-4">No tweets yet</h4>
                <p className="text-gray-600 mb-6">Share your thoughts with the community!</p>
                <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600">
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <img src={user.avatar} alt={user.fullName} className="w-20 h-20 rounded-full" />
          <div>
            <h1 className="text-3xl font-bold">{user.fullName}</h1>
            <p className="text-gray-600">@{user.username}</p>
          </div>
        </div>
        
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {renderContent()}
    </div>
  )
}

export default Profile