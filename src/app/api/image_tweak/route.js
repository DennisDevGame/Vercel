import { NextResponse } from "next/server"
import { generateImage, removeBackground } from "@/utils/replicate"
import { uploadImageFromURL } from "@/utils/cloudinary"

export async function POST(req) {
  try {
    const body = await req.json()
    const { input_image } = body

    if (!input_image) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required field: input_image",
          data: null,
        },
        { status: 400 }
      )
    }

    // 1. Generate the stylized image from Replicate
    const generatedImageUrl = await generateImage(input_image)

    if (!generatedImageUrl) {
      throw new Error("Failed to get generated image URL")
    }

    // 2. Upload the generated image to Cloudinary
    const uploadedUrl = await uploadImageFromURL(generatedImageUrl)
    console.log("Uploaded image URL:", uploadedUrl)

    // 3. Generate background-removed image (do not upload)
    const removedBgUrl = await removeBackground(generatedImageUrl)
    console.log("Background removed image URL:", removedBgUrl)

    return NextResponse.json(
      {
        success: true,
        message: "Image generated and processed successfully.",
        data: {
          cartoonImageUrl: uploadedUrl,       // Cloudinary-hosted cartoon version
          backgroundRemovedUrl: removedBgUrl, // Replicate-hosted image with background removed
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Image tweak error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process image.",
        data: error?.message || error,
      },
      { status: 500 }
    )
  }
}
