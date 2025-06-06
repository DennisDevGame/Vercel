// utils/replicate.ts
import Replicate from "replicate"

const replicate = new Replicate({
  auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
})

const isProduction = process.env.NEXT_PUBLIC_API_PRODUCTION === "true"

// Generate 3D cartoon-style image from drawing
export const generateImage = async (input_image) => {
  // if (!isProduction) {
  //   return input_image || process.env.NEXT_PUBLIC_REPLICATE_TEST_IMAGE
  // }

  console.log("Generating image with Replicate...", input_image)

  const input = {
    input_image: input_image,
    seed: 400557187,
    aspect_ratio: "1:1",
    prompt:
      "Transform this child's drawing into a colorful, high-resolution 3D cartoon character in the style of Pixar. Maintain the original design elements but enhance the textures and lighting to make it look soft, playful, and realistic. Add expressive features and plush-like details to give it a lifelike yet animated appearance. Use a white background so only the main character exist. All other elements can be ignored. Remove all text",
  }

  const output = await replicate.run("black-forest-labs/flux-kontext-pro", { input })

  return output?.url()
}

// Remove background from an image
export const removeBackground = async (imageUrl) => {
  console.log("Removing background with Replicate...", imageUrl)

  const input = {
    image: imageUrl,
  }

  const output = await replicate.run(
    "lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1",
    { input }
  )

  // output is a URL string or an array with URL
  if (Array.isArray(output)) {
    return output[0] // Return first URL if array
  }

  return output?.url()
}
