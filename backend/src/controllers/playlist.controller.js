import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
// Removed unused imports


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    if (!name || name.trim() === "") {
        throw new ApiError(400, "Playlist name is required");
    }
    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
        videos: []
    })
   
    // Return the populated playlist
    res.status(201).json(new ApiResponse(201, playlist, "Playlist created successfully"));
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }
    const playlists = await Playlist.find({owner: userId})
        .populate("owner", "-password -refreshToken")
        .populate("videos");    
    return res.status(200).json(new ApiResponse(200, playlists || [], "Playlists fetched successfully"));
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }
    const populatedPlaylist = await Playlist.findById(playlistId)
        .populate("owner", "-password -refreshToken")
        .populate("videos");

    if (!populatedPlaylist) {
        return res.status(404).json(new ApiResponse(404, null, "Playlist not found"));
    }
    if (!populatedPlaylist.videos || populatedPlaylist.videos.length === 0) {
        return res.status(201).json(new ApiResponse(201, null, "No videos found in this playlist"));
    }
    
    // Return the populated playlist
    return res.status(201).json(
        new ApiResponse(201, populatedPlaylist, "Playlist fetched successfully"));
    
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video ID");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in the playlist");
    }
    playlist.videos.push(videoId);
    await playlist.save();
    res.status(201).json(new ApiResponse(201, playlist, "Video added to playlist successfully"));
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!isValidObjectId(playlistId)|| !isValidObjectId(videoId)) throw new ApiError(400, "invalid playlist or videoID");
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { videos: videoId } }, // remove videoId from videos array
        { new: true } // return the updated document
    );
    if (!updatedPlaylist) throw new ApiError(404, "Playlist not found");
    
    res.status(201).json(new ApiResponse(201, updatedPlaylist, "video removed successfully"));
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)) throw new ApiError(400, "Playlist id is not valid");
    const deleteplaylist = await Playlist.findByIdAndDelete(playlistId);
    if(!deleteplaylist) throw new ApiError(404,"Playlist not found");
    res.status(200).json(new ApiResponse(200,deleteplaylist,"playlist deleted successfully"));
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    if(!name || !description) throw new ApiError(404, "At least one field (name or description) is required");
    //TODO: update playlist
    if(!playlistId) throw new ApiError(404,"invalid playlistID");
    const updatedplaylist = await Playlist.findByIdAndUpdate(
       playlistId,
       {
        $set:{
            name:name,
            description:description,
        }
       },
       {
        new:true,
        runValidators: false
       }
)
    res.status(201).json(201,updatedplaylist,"Playlist updated successfully");
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}

