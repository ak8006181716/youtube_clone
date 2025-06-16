import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const verifyJWT =asyncHandler(async (req, _, next)=>{
  try {
     const token= req.cookies?.accessToken ||req.header("Authorization")?.replace("Bearer ","");
     if(!token) throw new ApiError(401,"Unotherized access");
  
  
     const decodedtoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
  
     const user =User.findById(decodedtoken?._id).select("-password -refreshToken");
     if(!user) throw new ApiError(404,"Invalid token or user not found");
      req.user = user;
      next();
  } catch (error) {
    throw new ApiError(401, error?.massage || "Unauthorized access: Invalid token or user not found");
  }
})