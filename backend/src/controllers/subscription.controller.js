import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if (!isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel ID");
    const existingSubscription = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user._id
    });
    if (existingSubscription) {
        await Subscription.deleteOne({
            _id: existingSubscription._id
        });
        return res.status(200).json(new ApiResponse(200, null, "Unsubscribed successfully"));
    } else {
        await Subscription.create({
            channel: channelId,
            subscriber: req.user._id
        });
        return res.status(201).json(new ApiResponse(201, null, "Subscribed successfully"));
    }

})


const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // controller to return subscriber list of a channel
    if (!isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel ID");
    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "-password -refreshToken")
        .sort({ createdAt: -1 }); // Sort by subscription date, most recent first
    if (!subscribers || subscribers.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No subscribers found for this channel"));
    }
    res.status(200).json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"));
    // return res.status(200).json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"));

})


const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    // controller to return channel list to which user has subscribed
    if (!isValidObjectId(subscriberId)) throw new ApiError(400, "Invalid subscriber ID");
    const subscriptions = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "-password -refreshToken")
        .sort({ createdAt: -1 }); // Sort by subscription date, most recent first
    if (!subscriptions || subscriptions.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No subscribed channels found for this user"));
    }
    res.status(200).json(new ApiResponse(200, subscriptions, "Subscribed channels fetched successfully"));
    // return res.status(200).json(new ApiResponse(200, subscriptions, "Subscribed channels fetched successfully"));
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
