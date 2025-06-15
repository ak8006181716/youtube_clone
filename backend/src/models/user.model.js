import mongoose ,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
// Define the user schema for MongoDB using Mongoose
// This schema includes fields for watch history, username, email, full name, avatar, cover image, password, and refresh token
const userSchema = new mongoose.Schema({
    watchHistory:[
        {
        type:Schema.Types.ObjectId,
        ref:'Video',
        }
    ],    
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
        minlength:3,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    avatar:{
        type:String, //cloudnary url
        required:true,
    },
    coverImage:{
        type:String, //cloudnary url
    },
    password:{
        type:String,
        required:[true, 'Password is required'],
    },
    refreshToken:{
        type:String,
        required:true,
    },

},{timestamps:true} );
// Middleware to hash the password before saving the user document
// This middleware checks if the password field is modified and hashes it using bcrypt
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
});
// Method to check if the provided password matches the hashed password stored in the database

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password);
};
// Method to generate an access token for the user
userSchema.methods.generateAccessToken = function () {
    // The access token includes the user's ID, username, email, and full name
    // It is signed with a secret key and has an expiration time defined in the environment variables
    return jwt.sign(
    {
        _id: this._id,
        username: this.username, 
        email: this.email, 
        fullName:this.fullName 
    },
        process.env.ACCESS_TOKEN_SECRET,
    { 
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    );
};
// Method to generate a refresh token for the user
userSchema.methods.generateRefreshToken= function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { 
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
}

export const User =mongoose.model("User",userSchema)