import mongoose, { mongo, Schema } from "mongoose";


const likeSchema = mongoose.Schema({
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    comment:{
        type:Schema.Types.ObjectId,
        ref:"Comment"
    },
    tweet:{
        type:Schema.Types.ObjectId,
        ref:"Tweet"
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required: true
    }


}, {timestamps: true})


export const Like = mongoose.model("Like",likeSchema)