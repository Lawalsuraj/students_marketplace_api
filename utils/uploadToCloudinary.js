import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (fileBuffer, folder)=>{
    return new Promise((resolve, reject)=>{
        cloudinary.uploader.upload_stream(
            {folder},
            (error, result)=>{
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        ).end(fileBuffer)
    }); 

}; 

export default uploadToCloudinary;