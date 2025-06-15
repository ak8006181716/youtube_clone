import mongoose,{Schema} from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
// This model defines the structure of a video document in the MongoDB database.
// This method compares the provided password with the hashed password
const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    videoUrl: { //video file
        type: String, // cloudinary URL
        required: true,

    },
    thumbnail: {
        type: String, // cloudinary URL
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    duration:{
        type:Number, //loudinary 
        required:true,
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    }
}, { timestamps: true });
// This schema defines the structure of a video document in the MongoDB database.
// It includes fields for title, description, video URL, thumbnail, owner, duration, views, and publication status.
videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model('Video', videoSchema);
// This model defines the structure of a video document in the MongoDB database.