import {v2 as cloudinary } from 'cloudinary'
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,

});
/**
 * Uploads a file to Cloudinary.
 * @param {string} localFilepath - The local path of the file to upload.
 * @returns {Promise<Object|null>} - The response from Cloudinary or null if upload fails.
 */
const uploadCloudinary= async (localFilepath) => {
    if(!localFilepath) return null;
    try{
        
        const response = await cloudinary.uploader.upload(localFilepath, {
            resource_type: 'auto',
        });
        //console.log('Cloudinary upload response:', response.url);
        fs.unlinkSync(localFilepath); // Delete the file after upload
        return response;
    } catch (error) {
        fs.unlinkSync(localFilepath); // Delete the file if upload fails
        console.error('Error uploading to Cloudinary:', error);
        return null;
    }
}

export { uploadCloudinary };