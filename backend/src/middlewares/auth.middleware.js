import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Middleware to verify JWT and attach user to request object
// This middleware checks for a valid JWT in the request headers or cookies
export const verifyJWT =asyncHandler(async (req, _, next)=>{
  try {
    // Check for token in cookies or Authorization header
     
     const token= req.cookies?.accessToken ||req.header("Authorization")?.replace("Bearer ","");
     if(!token) throw new ApiError(401,"Unotherized access");// If token is not found, throw an error
  
  
     const decodedtoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
  
     const user = await User.findById(decodedtoken?._id).select("-password -refreshToken");
     if(!user) throw new ApiError(404,"Invalid token or user not found");
      req.user = user;
      next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Unauthorized access: Invalid token or user not found");
  }
})