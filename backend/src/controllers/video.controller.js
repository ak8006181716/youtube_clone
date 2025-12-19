import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
  const filter = {};
  if (query) {
    filter.title = { $regex: query, $options: "i" };
  }

    let sortObject = { createdAt: -1 }; // Default sort
  if (sortBy && sortType) {
    sortObject = { [sortBy]: sortType === "asc" ? 1 : -1 };
  }
  const videos = await Video.find(filter)
    .sort(sortObject)
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json(new ApiResponse(videos));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  
  console.log(req.files)
  const videoLocalPath = req.files?.videoFile[0]?.path; //set local path for video
  const videoThumbnailLocalPath = req.files?.thumbnail[0]?.path;
  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }
  if (!videoThumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }
 
  // TODO: get video, upload to cloudinary, create video
  if (req.files?.videoFile?.[0]?.size === 0) {
    throw new ApiError(400, "Uploaded video file is empty");
  }
  const videoThumbnail = await uploadCloudinary(videoThumbnailLocalPath);
  const videoResponse = await uploadCloudinary(videoLocalPath, "video");
  const duration = videoResponse.duration || 0; // Assuming duration is available in the video file metadata
  const video = await Video.create({
    title,
    description,
    videoUrl: videoResponse.url || videoResponse.secure_url,
    thumbnail: videoThumbnail.url || videoThumbnail.secure_url,
    duration: duration, // Assuming duration is available in the video file metadata.
    owner: req.user._id, // Assuming req.user is populated with the authenticated user
  });
  res.status(201).json(new ApiResponse(video, "Video published successfully"));
});

// Updated version of your getVideoById controller

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  
  // Validate ObjectId format
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  try {
    // Always increment view count when this endpoint is called,
    // and return the updated video document.
    const video = await Video.findByIdAndUpdate(
      videoId,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("owner", "username avatar fullName")
      .select("-__v");

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    // Compute likes count for this video
    const likes = await Like.countDocuments({ video: videoId });

    // Determine if the currently authenticated user has liked this video,
    // and add to their watch history if logged in.
    let isLiked = false;
    if (req.user && req.user._id) {
      const existingLike = await Like.findOne({
        video: videoId,
        owner: req.user._id,
      }).select("_id");

      isLiked = !!existingLike;

      // Add video to user's watch history (no duplicate entries)
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { watchHistory: videoId },
      });
    }

    const videoWithLikes = {
      ...video.toObject(),
      likes,
      isLiked,
    };

    // Return the video data with likes info
    res
      .status(200)
      .json(
        new ApiResponse(200, videoWithLikes, "Video fetched successfully")
      );

  } catch (error) {
    console.error('Error fetching video:', error);
    
    // Handle mongoose CastError (invalid ObjectId format)
    if (error.name === 'CastError') {
      throw new ApiError(400, "Invalid video ID format");
    }
    
    // Re-throw ApiErrors
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle any other errors
    throw new ApiError(500, "Failed to fetch video");
  }
});


const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const updatedVideo = await Video.findByIdAndUpdate(videoId, req.body, {
    new: true,
  });
  if (!updatedVideo) {
    throw new ApiError(404, "Video not found");
  }

  res.status(200).json(new ApiResponse(updatedVideo));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const deletedVideo = await Video.findByIdAndDelete(videoId);
  if (!deletedVideo) {
    throw new ApiError(404, "Video not found");
  }

  res.status(200).json(new ApiResponse(deletedVideo));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle publish status
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  res.status(200).json(new ApiResponse(video));
});


const normalFeedVIdeos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  try {
    // Get videos with pagination, populate owner details, and sort by creation date
    const videos = await Video.find({ 
      isPublished: true // Only get published videos
    })
    .populate('owner', 'username avatar fullName') // Populate owner details
    .sort({ createdAt: -1 }) // Sort by newest first
    .skip(skip)
    .limit(limitNumber)
    .select('-__v'); // Exclude version field

    console.log('Found videos:', videos.length); // Debug log

    // IMPORTANT: Return data directly in the format your frontend expects
    return res.status(200).json({
      success: true,
      data: videos, // Make sure videos array is in 'data' field
      message: "Videos fetched successfully"
    });

  } catch (error) {
    console.error('Error fetching videos:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
      error: error.message
    });
  }
});





export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  normalFeedVIdeos
};
