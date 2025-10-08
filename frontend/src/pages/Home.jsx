import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchVideos } from '../services/videoService'
import VideoCard from '../components/VideoCard'

const Home = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loadVideos = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true)
      setError('') // Clear any previous errors
      
      const response = await fetchVideos({ page: pageNum, limit: 10 })
      const newVideos = response.data || []
      
      if (reset) {
        setVideos(newVideos)
        setPage(1) // Reset page to 1 when resetting videos
      } else {
        setVideos(prev => [...prev, ...newVideos])
        setPage(pageNum) // Update page state to current page
      }
      
      // Check if we have more videos to load
      setHasMore(newVideos.length === 10)
    } catch (err) {
      setError('Failed to load videos')
      console.error('Error loading videos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVideos(1, true)
  }, [])

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      loadVideos(nextPage, false)
    }
  }

  const retryLoad = () => {
    setError('')
    loadVideos(1, true)
  }

  if (error && videos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={retryLoad}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to VideoTube</h1>
        <p className="text-gray-600">Discover amazing videos from creators around the world</p>
      </div>

      {/* Show error message if there are videos but loading more failed */}
      {error && videos.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {videos.length === 0 && !loading ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">No videos found</h2>
          <p className="text-gray-600 mb-6">Be the first to upload a video!</p>
          <Link 
            to="/upload" 
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            Upload Video
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              <p className="mt-2 text-gray-600">Loading videos...</p>
            </div>
          )}

          {hasMore && !loading && (
            <div className="text-center">
              <button
                onClick={loadMore}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Load More Videos
              </button>
            </div>
          )}

          {!hasMore && videos.length > 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">No more videos to load</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Home