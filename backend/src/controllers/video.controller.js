import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const filter = {}
    if (query) {
        filter.title = { $regex: query, $options: "i" }
    }

    const videos = await Video.find(filter)
        .sort({ [sortBy]: sortType })
        .skip((page - 1) * limit)
        .limit(limit)

    res.status(200).json(new ApiResponse(videos))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    const { videoFile } = req.files
    const videoThumbnail = await uploadCloudinary(videoFile?.path)
    const videoUrl = await uploadCloudinary(videoFile?.path, 'video')
    const video = await Video.create({
        title,
        description,
        videoUrl,
        thumbnail: videoThumbnail,  
        duration: videoFile?.duration, // Assuming duration is available in the video file metadata.
        user: req.user.id
    })
    res.status(201).json(new ApiResponse(video, "Video published successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    res.status(200).json(new ApiResponse(video))

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, req.body, { new: true })
    if (!updatedVideo) {
        throw new ApiError(404, "Video not found")
    }

    res.status(200).json(new ApiResponse(updatedVideo))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId)
    if (!deletedVideo) {
        throw new ApiError(404, "Video not found")
    }

    res.status(200).json(new ApiResponse(deletedVideo))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle publish status
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    video.isPublished = !video.isPublished
    await video.save()

    res.status(200).json(new ApiResponse(video))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}

