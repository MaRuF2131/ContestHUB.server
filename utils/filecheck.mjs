import sharp from "sharp";
import { uploadToCloudinary } from "./CDN/cloudinaryUpload.mjs";

export const fileCheck = (folderName = "uploads") => {
  console.log("fileCheck middleware initialized for folder:", folderName);
  return async (req, res, next) => {
    try {
      let imageData = null;
      console.log("fileCheck: Received file:", req.file ? req.file.originalname : "No file uploaded");
      if (req.file) {
        if (!req.file.mimetype.startsWith("image/")) {
          return res.status(400).json({ error: "Only image files are allowed!" });
        }

        let webpBuffer;

        try {
          // ✅ Step 1: sharp দিয়ে WebP convert
          webpBuffer = await sharp(req.file.buffer)
            .resize({ width: 1200 }) // বড় image হলে resize করবে
            .webp({ quality: 80 }) // balanced quality
            .toBuffer();
              // ✅ Step 2: conversion এর পরে metadata check
            const metadata = await sharp(webpBuffer).metadata();

            if (metadata.format !== "webp") {
              console.error(" Conversion check failed: Not WebP");
              return res.status(400).json({ error: "Image conversion to WebP failed" });
            }
        } catch (sharpError) {
          console.error(" Sharp conversion failed:", sharpError.message);
          return res.status(400).json({ error: "Invalid image format or conversion failed" });
        }

        if (!webpBuffer || webpBuffer.length === 0) {
          return res.status(400).json({ error: "Image conversion failed, empty buffer" });
        }

        //  Step 2: Cloudinary  upload
        try {
          imageData = await uploadToCloudinary(webpBuffer, folderName);
        } catch (cloudError) {
          console.error(" Cloudinary upload failed:", cloudError.message);
          return res.status(500).json({ error: "Image upload to Cloudinary failed" });
        }

        if (!imageData || !imageData.secure_url) {
          return res.status(500).json({ error: "Image upload failed (no secure URL)" });
        }

        // Save image data in request object
        req.imageData = imageData;
        console.log(" Image uploaded to Cloudinary:", imageData, "for folder:",req.imageData);
        
      }

      next();
    } catch (err) {
      console.error(" fileCheck middleware error:", err.message);
      res.status(500).json({ error: "Something went wrong in fileCheck" });
    }
  };
};
