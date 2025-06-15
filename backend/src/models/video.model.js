import mongoose,{Schema} from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
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

videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model('Video', videoSchema);
// This model defines the structure of a video document in the MongoDB database.