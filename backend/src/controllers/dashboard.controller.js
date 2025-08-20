import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {channelId} = req.params
    if (!mongoose.isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel ID");
    
    const channelVideos = await Video.find({ channel: channelId });
    const totalViews = channelVideos.reduce((acc, video) => acc + video.views, 0);
    const totalVideos = channelVideos.length;
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });
    const totalLikes = await Like.countDocuments({ channel: channelId });
    const channelStats = {
        totalViews,
        totalVideos,
        totalSubscribers,
        totalLikes
    };
    res.status(200).json(new ApiResponse(channelStats, "Channel stats fetched successfully"));
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {channelId} = req.params
    if (!mongoose.isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel ID");
    const videos = await Video.find({ channel: channelId })
        .populate("channel", "-password -refreshToken")
        .populate("likes", "-password -refreshToken")
        .populate("comments", "-password -refreshToken");
    if (!videos || videos.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No videos found for this channel"));
    }
    res.status(200).json(new ApiResponse(videos, "Channel videos fetched successfully"));
})

export {
    getChannelStats, 
    getChannelVideos
    }
