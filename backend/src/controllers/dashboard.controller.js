import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {channelId} = req.query
    if (!mongoose.isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel ID");
    
    const channelVideos = await Video.find({ owner: channelId });
    const totalViews = channelVideos.reduce((acc, video) => acc + video.views, 0);
    const totalVideos = channelVideos.length;
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });
    const totalLikes = await Like.countDocuments({ owner: channelId });
    const channelStats = {
        totalViews,
        totalVideos,
        totalSubscribers,
        totalLikes
    };
    // ApiResponse expects: StatusCode, data, message
    res.status(200).json(new ApiResponse(200, channelStats, "Channel stats fetched successfully"));
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {channelId} = req.query
    if (!mongoose.isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel ID");
    const videos = await Video.find({ owner: channelId })
        .populate("owner", "-password -refreshToken")
        .sort({ createdAt: -1 });

    // Always return 200 with an array (possibly empty) so frontend can handle "no videos" state
    const safeVideos = Array.isArray(videos) ? videos : [];

    res.status(200).json(
        new ApiResponse(
            200,
            safeVideos,
            safeVideos.length
                ? "Channel videos fetched successfully"
                : "No videos found for this channel"
        )
    );
})

export {
    getChannelStats, 
    getChannelVideos
    }
