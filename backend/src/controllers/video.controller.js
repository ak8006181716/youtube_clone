import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
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

  const videoLocalPath = req.files.videoFile[0].path; //set local path for video
  const videoThumbnailLocalPath = req.files?.thumbnail[0]?.path || "";
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

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  res.status(200).json(new ApiResponse(video));
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

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
