import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body;
    if (!content || content.trim() === "") throw new ApiError(400, "Content is required");
    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    });
    res.status(201).json(new ApiResponse(201, tweet, "Tweet created successfully"));
    
    
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params;
    if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid user ID");
    const tweets = await Tweet.find({ owner: userId })
        .populate("owner", "-password -refreshToken")
        .sort({ createdAt: -1 }); // Sort by creation date, most recent first
    if (!tweets || tweets.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No tweets found for this user"));
    }
    res.status(200).json(new ApiResponse(tweets, "User tweets fetched successfully"));
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;
    const { content } = req.body;
    if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweet ID");
    if (!content || content.trim() === "") throw new ApiError(400, "Content is required");
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        { content },
        { new: true, runValidators: true }
    );
    if (!updatedTweet) throw new ApiError(404, "Tweet not found");
    res.status(200).json(new ApiResponse(updatedTweet, "Tweet updated successfully"));

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;
    if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweet ID");
    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);
    if (!deletedTweet) throw new ApiError(404, "Tweet not found");
    res.status(200).json(new ApiResponse(deletedTweet, "Tweet deleted successfully"));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}

