import mongoose, { Schema } from "mongoose";

const tweetSchema = mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    comment:{
        type:Schema.Types.ObjectId,
        ref:"Comment"
    }

},{timestamps:true})


export const Tweet = mongoose.model("Tweet",tweetSchema)