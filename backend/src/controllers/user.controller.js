import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async(userId)=>{

  try {
    const user= await User.findById(userId)
    const accessToken= user.generateAccessToken();
    const refreshToken= user.generateRefreshToken();
    user.refreshToken= refreshToken;
    await user.save({validateBeforeSave:false});
    return {accessToken,refreshToken};
  } catch (error) {
    throw new ApiError(500,"something is wrong generating access and refresh token");
  }
}

const registerUser = asyncHandler(async (req, res) => {
 
    // check if the request has files
  const { fullName, password, email, username } = req.body;  // get user detsils from frontend

   // check if user already exist by username and email
  if (fullName === "" || password === "" || email === "" || username === "") {
    throw new ApiError(400, "Required all fields");
  } 

   // check if user already exist by username and email
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }  
  
  const avatarLocalPath = req.files?.avatar[0]?.path;  //set local path for avatar
  const coverImageLocalPath = req.files?.coverImages[0]?.path || "";  //set local path for coverimages, if not present set it to empty string
  
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

const loginUser = asyncHandler(async (req, res)=>{
const { password, email, username } = req.body; 


if(!(email || username) ) throw new ApiError(404, "username or email is required");

  const user= await User.findOne({
    $or: [
    { email: email },
    { username: username }
  ]
  })
  if(!user) throw new ApiError(404,"user not found");


  const isPasswordValid = await user.isPasswordCorrect(password);
  if(!isPasswordValid) throw new ApiError(401,"Wrong Password");

  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

  const logedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options ={
    httpOnly:true,
    secure:true
  }

  return res
  .status(201)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json( new ApiResponse (201,{
    user:
    logedInUser,
    accessToken,
    refreshToken
    
  },
  "user loged in successfully"
))
})

const logoutUser =asyncHandler(async (req ,res)=>{
 await User.findByIdAndUpdate(req.user._id,
  req.user._id,{
    $set:{ 
      refreshToken: undefined,
    }
  },{
    new:true,
  }
 )
  const options ={
    httpOnly:true,
    secure:true
  }
  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200, null, "User logged out successfully"));

})

const refreshAccessToken = asyncHandler(async (req, res) => {
 
  const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken;


 if(!incomingRefreshToken) throw new ApiError(401,"unauthorized access, refresh token is required");
 try {
   const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
 const user = await User.findById(decodedToken?._id);
 if(!user) throw new ApiError(401,"unauthorized access, refresh token is invalid");
 
 if(incomingRefreshToken!==user?.refreshToken) throw new ApiError(401,"unauthorized access, refresh token is invalid");
 
 
 const options={
   httpOnly:true,
   secure:true
 }
 
 const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);
 
 return res
 .status(201)
 .cookie("accessToken",accessToken)
 .cookie("refreshToken",newRefreshToken)
 .json(
   new ApiResponse(201,
     {accessToken,refreshToken: newRefreshToken},
     "Access Token successfully updated")
 )
 } catch (error) {
    throw new ApiError(401, error?.massage || "something went wrong in token refreshing")
 }
})



export 
{ 
  registerUser,
  loginUser,
  logoutUser, 
  refreshAccessToken
};
