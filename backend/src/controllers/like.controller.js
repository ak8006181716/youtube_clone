import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    console.log(req.body);
    //TODO: toggle like on video
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    const existingLike = await Like.findOne({
        video: videoId,
        owner: req.user._id
    });
    if(existingLike){
        await Like.deleteOne({
            _id: existingLike._id   
        })
        return res.status(200).json(new ApiResponse(200, null,"Like removed successfully"));
    }
    else {
        await Like.create({
            video: videoId,
            owner: req.user._id
        })
        return res.status(201).json(new ApiResponse(201, null, "Like added successfully"));
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment ID");
    }
    const existingLike = await Like.findOne({
        comment:commentId,
        owner:req.user._id
    })
    if(existingLike){
        await Like.deleteOne({
            _id:existingLike._id
        })
        return res.status(200).json(new ApiResponse(200, null, "Like removed successfully"))
    }
    else{
        await Like.create({
            comment:commentId,
            owner:req.user._id
        }) 
        return res.status(201).json(new ApiResponse(201, null, "Like added successfully"))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!isValidObjectId(tweetId)) throw new ApiError(400,"invalid tweetId");

    const existingLike = await Like.findOne({
        tweet: tweetId,
        owner:req.user._id
    })

    if(existingLike){
        await Like.deleteOne({
            _id : existingLike._id
        })
        return res.status(200).json(new ApiResponse(200, null, "Like removed successfully"))
    } else{
        await Like.create({
            tweet:tweetId,
            owner:req.user._id
        })
        return res.status(201).json(new ApiResponse(201, null, "Like added successfully"))
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos = await Like.find({ owner: req.user._id })
        .populate('video')
        .exec();
    return res.status(200).json(new ApiResponse(200, likedVideos || [], "Liked videos fetched successfully"));
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
