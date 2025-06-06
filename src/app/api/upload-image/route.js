import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_SIZE_MB = 32

export async function POST(req) {
  try {
    if (process.env.NEXT_PUBLIC_API_PRODUCTION === "false") {
      return Response.json({
        success: true,
        message: "Image upload simulated in development mode",
        url: process.env.NEXT_PUBLIC_REPLICATE_TEST_IMAGE || "/images/your-drawing.png",
      })
    }

    const formData = await req.formData()
    const file = formData.get("image")

    if (!file) {
      return Response.json({ success: false, message: "No image uploaded" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json({ success: false, message: "Unsupported image type" }, { status: 415 })
    }

    // Check size limit
    const arrayBuffer = await file.arrayBuffer()
    const sizeInMB = arrayBuffer.byteLength / (1024 * 1024)
    if (sizeInMB > MAX_SIZE_MB) {
      return Response.json({ success: false, message: `Image size exceeds ${MAX_SIZE_MB}MB limit` }, { status: 413 })
    }

    const buffer = Buffer.from(arrayBuffer)

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "cartoonize_folder",
            // no transformation/resizing
          },
          (err, result) => {
            if (err) reject(err)
            else resolve(result)
          }
        )
        .end(buffer)
    })

    return Response.json({
      success: true,
      message: "Image uploaded successfully",
      url: result.secure_url,
    })
  } catch (err) {
    console.error("❌ Upload error:", err)
    return Response.json({ success: false, message: "Image upload failed" }, { status: 500 })
  }
}
