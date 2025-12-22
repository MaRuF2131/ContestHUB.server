// config/uploadConfig.js
import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => { 
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); //  allow all images
    } else {
      cb(new Error("Only image files are allowed!"), false); //  reject others
    }
  },
});
