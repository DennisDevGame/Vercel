const cloudinary = require("cloudinary").v2
const axios = require("axios")

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})

async function uploadImageFromURL(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" })
    const buffer = Buffer.from(response.data, "binary")

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "outputs" }, (err, result) => {
          if (err) reject(err)
          else resolve(result)
        })
        .end(buffer)
    })

    return result.secure_url
  } catch (err) {
    console.error("Upload error:", err)
    throw err
  }
}

module.exports = { uploadImageFromURL }
