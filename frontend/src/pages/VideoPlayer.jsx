import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  SkipBack, 
  SkipForward,
  Loader,
  Heart,
  Share2
} from 'lucide-react'
import { toggleVideoLike } from '../services/videoService'

// Inline VideoPlayerControls component
const VideoPlayerControls = ({ 
  src, 
  poster, 
  autoPlay = false,
  onTimeUpdate,
  onEnded,
  onPlay,
  onPause
}) => {
  const videoRef = useRef(null)
  const progressRef = useRef(null)
  const volumeRef = useRef(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSettings, setShowSettings] = useState(false)

  // Auto-hide controls
  useEffect(() => {
    let timeout
    if (isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000)
    }
    return () => clearTimeout(timeout)
  }, [isPlaying, showControls])

  // Format time helper
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Video event handlers
  const handleLoadedData = () => {
    setIsLoading(false)
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      onTimeUpdate?.(videoRef.current.currentTime)
    }
  }

  const handlePlay = () => {
    setIsPlaying(true)
    onPlay?.()
  }

  const handlePause = () => {
    setIsPlaying(false)
    onPause?.()
  }

  const handleEnded = () => {
    setIsPlaying(false)
    onEnded?.()
  }

  // Control handlers
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const handleProgressClick = (e) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      const newTime = pos * duration
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (e) => {
    if (volumeRef.current && videoRef.current) {
      const rect = volumeRef.current.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      const newVolume = Math.max(0, Math.min(1, pos))
      setVolume(newVolume)
      videoRef.current.volume = newVolume
      setIsMuted(newVolume === 0)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const skipTime = (seconds) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const changePlaybackRate = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
      setPlaybackRate(rate)
      setShowSettings(false)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
    }
  }

  if (!src) {
    return (
      <div className="w-full aspect-video bg-gray-900 flex items-center justify-center text-white">
        <p>No video source provided</p>
      </div>
    )
  }

  return (
    <div 
      className="relative w-full aspect-video bg-black group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying || setShowControls(true)}
      onMouseMove={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        autoPlay={autoPlay}
        onLoadedData={handleLoadedData}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Loader className="w-12 h-12 text-white animate-spin" />
        </div>
      )}

      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-20 h-20 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all"
          >
            <Play className="w-8 h-8 text-white ml-1" />
          </button>
        </div>
      )}

      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        
        <div className="mb-4">
          <div
            ref={progressRef}
            className="w-full h-1 bg-gray-600 rounded cursor-pointer hover:h-2 transition-all"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-red-500 rounded transition-all"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <button onClick={togglePlay} className="hover:text-red-500 transition-colors">
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            <button onClick={() => skipTime(-10)} className="hover:text-red-500 transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            <button onClick={() => skipTime(10)} className="hover:text-red-500 transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <button onClick={toggleMute} className="hover:text-red-500 transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <div
                ref={volumeRef}
                className="w-20 h-1 bg-gray-600 rounded cursor-pointer"
                onClick={handleVolumeChange}
              >
                <div
                  className="h-full bg-white rounded"
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                />
              </div>
            </div>

            <span className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="hover:text-red-500 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {showSettings && (
                <div className="absolute bottom-8 right-0 bg-gray-800 rounded-lg p-2 min-w-32">
                  <div className="text-sm font-medium mb-2">Playback Speed</div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => changePlaybackRate(rate)}
                      className={`block w-full text-left px-2 py-1 hover:bg-gray-700 rounded text-sm ${
                        playbackRate === rate ? 'text-red-500' : ''
                      }`}
                    >
                      {rate === 1 ? 'Normal' : `${rate}x`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={toggleFullscreen} className="hover:text-red-500 transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={togglePlay}
        style={{ zIndex: showControls ? -1 : 1 }}
      />
    </div>
  )
}

const VideoPlayer = () => {
  const { id: videoId } = useParams()
  const [video, setVideo] = useState(null)
  const [relatedVideos, setRelatedVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  // Fetch video details
  const fetchVideo = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/v1/videos/${videoId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch video')
      }
      const data = await response.json()
      setVideo(data.data || data)
      // Set initial like count (you might want to fetch this from a separate endpoint)
      setLikeCount(data.data?.likes || 0)
    } catch (err) {
      setError('Failed to load video')
      console.error('Error fetching video:', err)
    } finally {
      setLoading(false)
    }
  }, [videoId])

  // Handle like toggle
  const handleLike = async () => {
    try {
      await toggleVideoLike(videoId)
      setIsLiked(!isLiked)
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    } catch (err) {
      console.error('Error toggling like:', err)
    }
  }

  // Fetch related videos
  const fetchRelatedVideos = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/v1/videos/feed?limit=8`)
      if (response.ok) {
        const data = await response.json()
        setRelatedVideos(data.data || data || [])
      }
    } catch (err) {
      console.error('Error fetching related videos:', err)
    }
  }

  useEffect(() => {
    if (videoId) {
      fetchVideo()
      fetchRelatedVideos()
    }
  }, [videoId, fetchVideo])

  // Format functions
  const formatViews = (views) => {
    if (!views) return '0 views'
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`
    return `${views} views`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Video not found</h2>
          <p className="text-gray-600 mb-6">{error || 'The video you\'re looking for doesn\'t exist.'}</p>
          <Link 
            href="/" 
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Video Section */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden mb-4">
              <VideoPlayerControls
                src={video.videoUrl}
                poster={video.thumbnail}
                onTimeUpdate={(time) => {
                  // Optional: Track watch time
                  console.log('Watch time:', time)
                }}
                onEnded={() => {
                  // Optional: Mark video as watched
                  console.log('Video finished')
                }}
              />
            </div>

            {/* Video Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    {formatViews(video.views)} • {formatDate(video.createdAt)}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleLike}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                      isLiked 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{likeCount}</span>
                  </button>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors flex items-center space-x-2">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              <hr className="my-4" />

              {/* Channel Info */}
              <div className="flex items-center space-x-4 mb-4">
                {video.owner?.avatar ? (
                  <img
                    src={video.owner.avatar}
                    alt={video.owner.fullName}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 font-bold">
                      {video.owner?.fullName?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <a 
                    href={`/profile/${video.owner?.username}`}
                    className="font-semibold hover:text-red-600 transition-colors"
                  >
                    {video.owner?.fullName || 'Unknown User'}
                  </a>
                  <p className="text-sm text-gray-600">
                    {/* Add subscriber count if available */}
                    Creator
                  </p>
                </div>
                <button className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-medium">
                  Subscribe
                </button>
              </div>

              {/* Description */}
              {video.description && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {video.description}
                  </p>
                </div>
              )}
            </div>

            {/* Comments Section - You can add this later */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-xl font-bold mb-4">Comments</h3>
              <div className="text-center text-gray-500 py-8">
                <p>Comments feature coming soon...</p>
              </div>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-bold mb-4">Related Videos</h3>
              <div className="space-y-4">
                {relatedVideos
                  .filter(relatedVideo => relatedVideo._id !== video._id)
                  .slice(0, 10)
                  .map((relatedVideo) => (
                    <div key={relatedVideo._id} className="flex space-x-3">
                      <Link to={`/video/${relatedVideo._id}`} className="flex-shrink-0">
                        <img
                          src={relatedVideo.thumbnail}
                          alt={relatedVideo.title}
                          className="w-32 h-20 object-cover rounded"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={`/video/${relatedVideo._id}`}
                          className="block font-medium text-sm hover:text-red-600 transition-colors line-clamp-2"
                        >
                          {relatedVideo.title}
                        </Link>
                        <Link 
                          to={`/profile/${relatedVideo.owner?.username}`}
                          className="text-xs text-gray-600 hover:text-red-600 transition-colors mt-1 block"
                        >
                          {relatedVideo.owner?.fullName}
                        </Link>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatViews(relatedVideo.views)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer