
import { isValidObjectId } from "mongoose"
import express from "express";
import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
 
const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    }

    const comments = await Comment.find({ video: videoId })
        .skip((options.page - 1) * options.limit)
        .limit(options.limit)
        .populate("user", "-password -refreshToken");

    res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"));
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    console.log("req.body:", req.body);
    if (!req.body) {
    throw new ApiError(400, "Request body is required");
  }
    const { content } = req.body
    const comment= await Comment.create({
        video: videoId,
        owner: req.user._id,
        content
    })
    res.status(201).json(new ApiResponse(201,comment, "comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} =req.params
    const {content} = req.body
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {content},
        {new: true}
    )
    res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    const deletedComment = await Comment.findByIdAndDelete(commentId)
    res.status(200).json(new ApiResponse(200, deletedComment, "Comment deleted successfully"));
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
