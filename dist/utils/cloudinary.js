"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageBuffer = uploadImageBuffer;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});
/** Uploads an in-memory file buffer (from multer) to Cloudinary and returns its public URL. */
function uploadImageBuffer(buffer, folder = "soulvalley/community") {
    if (!process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {
        return Promise.reject(new Error("Cloudinary is not configured on the server."));
    }
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({ folder }, (error, result) => {
            if (error || !result) {
                reject(error || new Error("Cloudinary upload failed"));
                return;
            }
            resolve(result.secure_url);
        });
        stream.end(buffer);
    });
}
