import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
 
    // check if the request has files
  const { fullName, password, email, username } = req.body;  // get user detsils from frontend

   // check if user already exist by username and email
  if (fullName === "" || password === "" || email === "" || username === "") {
    throw new ApiError(400, "Required all fields");
  } 

   // check if user already exist by username and email
  const existingUser = User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }  
  
  const avatarLocalPath = req.files?.avatar[0]?.path;  //check for avatar
  const coverImageLocalPath = req.files?.coverImage[0]?.path; //check for coverimages

    // check if avatar and coverImage are present
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

 
  const avatar = await uploadCloudinary(avatarLocalPath);   //upload them to cloudinary avatar
  const coverImage = await uploadCloudinary(coverImageLocalPath);   //upload them to cloudinary coverImage

    //check if avatar is uploaded successfully
  if(!avatar) throw new ApiError(409,"avatar is required");


   //create a user object- create entry in db
  const user = await  User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase(),
    });
    //check if user is created successfully
    const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
    );

    //check if createdUser is not null
    //if createdUser is null, throw an error
    if(!createdUser) throw new ApiError(500,"something is wrong in regisering user");
    //return the created user
    //return the created user without password and refreshToken
    return res.status(201).json(
        new ApiResponse(201,createdUser,"User created successfully")
    );



});

export { registerUser };
