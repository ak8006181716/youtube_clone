import React from 'react'
import { Link } from 'react-router-dom'

const VideoCard = ({ video }) => {
  if (!video) return null

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatViews = (views) => {
    if (!views) return '0 views'
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`
    return `${views} views`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/video/${video._id}`}>
        <div className="relative">
          {video.thumbnail ? (
            <img 
              src={video.thumbnail} 
              alt={video.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No thumbnail</span>
            </div>
          )}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {formatDuration(video.duration)}
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/video/${video._id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-red-600 transition-colors">
            {video.title}
          </h3>
        </Link>
        
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          {video.owner?.avatar && (
            <img 
              src={video.owner.avatar} 
              alt={video.owner.fullName}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div>
            <Link 
              to={`/profile/${video.owner?.username}`}
              className="hover:text-red-600 transition-colors"
            >
              {video.owner?.fullName || 'Unknown User'}
            </Link>
            <div className="text-xs text-gray-500">
              {video.views !== undefined ? formatViews(video.views) : '0 views'} • {formatDate(video.createdAt)}
            </div>
          </div>
        </div>
        
        {video.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </div>
  )
}

export default VideoCard