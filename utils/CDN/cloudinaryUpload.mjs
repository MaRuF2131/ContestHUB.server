import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (fileBuffer, folder = "uploads") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, format: "webp", quality: "auto" }, // 👈 এখানে webp enforce
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// utils/CDN/cloudinaryDelete.mjs

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result; // { result: 'ok' } হলে delete সফল
  } catch (error) {
    console.error("❌ Cloudinary delete failed:", error.message);
    throw new Error("Failed to delete image from Cloudinary");
  }
};

