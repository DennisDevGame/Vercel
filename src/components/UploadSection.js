"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import ProductOptions from "./ProductOptions"
import BuyButton from "./BuyButton"
import ImageUploadPreview from "./ImageUploadPreview"
import GeneratedImagePreview from "./GeneratedImagePreview"
import GenerateButton from "./GenerateButton"
import { thumbnailOverlays } from "@/utils/thumbnailOverlayMap"
import { compositeThumbnail } from "@/utils/composite"

export default function UploadSection() {
  const [previewUrl, setPreviewUrl] = useState("/images/your-drawing.png")
  const [isUploading, setIsUploading] = useState(false)
  const [backgroundRemovedUrl, setBackgroundRemovedUrl] = useState("/images/sample_output.png")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedThumbnailKey, setSelectedThumbnailKey] = useState(Object.keys(thumbnailOverlays)[0])
  const [compositedImageUrl, setCompositedImageUrl] = useState(thumbnailOverlays[Object.keys(thumbnailOverlays)[0]].initImage)
  const [showGeenerateOption, setShowGenerateOption] = useState(false)
  const inputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("image", file)
    setIsUploading(true)

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (data.success && data.url) {
        setPreviewUrl(data.url)
        setShowGenerateOption(true)
      } else {
        alert(data.message || "Upload failed")
      }
    } catch (err) {
      console.error("Upload error:", err)
      alert("Image upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  const handleGenerate = async () => {
    if (!previewUrl || previewUrl === "/images/your-drawing.png") return

    setIsGenerating(true)
    try {
      const res = await fetch("/api/image_tweak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input_image: previewUrl }),
      })

      const data = await res.json()
      if (data.success && data.data?.backgroundRemovedUrl) {
        const newAvatar = data.data.backgroundRemovedUrl
        setBackgroundRemovedUrl(newAvatar)
        const defaultKey = Object.keys(thumbnailOverlays)[0]
        const thumb = thumbnailOverlays[defaultKey]
        const composite = await compositeThumbnail(thumb.src, newAvatar, thumb.overlay)
        setCompositedImageUrl(composite)
        setSelectedThumbnailKey(defaultKey)
        setShowGenerateOption(false)
      } else {
        alert(data.message || "Generation failed")
      }
    } catch (err) {
      console.error("Generation error:", err)
      alert("Image generation failed")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleThumbnailSelect = async (key, avatarOverride) => {
    setSelectedThumbnailKey(key)
    const thumb = thumbnailOverlays[key]
    const avatarUrl = avatarOverride || backgroundRemovedUrl
    if (!thumb || !avatarUrl) return

    const result = await compositeThumbnail(thumb.src, avatarUrl, thumb.overlay)
    setCompositedImageUrl(result)
  }

  return (
    <section className="w-full px-4 py-10">
      <div className="text-start md:text-center pb-6 max-w-3xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold font-sans text-black pb-4">
          Bring imaginary things to life with AI
        </h1>
        <p className="text-gray1 mt-2 text-base md:text-lg mx-auto">
          Upload a drawing and get AI-generated products. Printed on demand.
        </p>
      </div>

      <div className="max-w-3xl mx-auto rounded-xl bg-bg2 p-6 md:p-10 shadow-sm flex flex-col gap-6">
        <div className="flex flex-row items-start justify-between gap-4 md:gap-8">
          <div className="flex flex-col items-center flex-1 min-w-0">
            <ImageUploadPreview
              previewUrl={previewUrl}
              inputRef={inputRef}
              onChange={handleFileChange}
              isUploading={isUploading}
            />
            <p className="mt-2 text-black font-bold text-base text-center">Your drawing</p>
            <div className="hidden md:block mt-4 w-full">
              <BuyButton
                inputRef={inputRef}
                isLoading={isUploading}
                isUploaded={previewUrl !== "/images/your-drawing.png"}
              />
            </div>
          </div>

          <div className="flexitems-center justify-center shrink-0 self-center md:self-start md:mt-30">
            <div className="w-10 aspect-square relative">
              <Image src="/images/icon-right-arrow.png" alt="arrow" fill className="object-contain" />
            </div>
          </div>

          <div className="flex flex-col items-center flex-1 min-w-0">
            {compositedImageUrl ? (
              <GeneratedImagePreview url={compositedImageUrl} />
            ) : (
              <div className="w-full max-w-[300px] aspect-square relative  rounded-md overflow-hidden shadow-md">
                <Image src="/images/ai-picture.png" alt="Generated image" fill className="object-fit" />
              </div>
            )}
            <p className="mt-2 text-black font-bold text-base text-center">Picture</p>
            <div className="hidden md:block mt-4 w-full">
              <ProductOptions
                handleSelect={handleThumbnailSelect}
                avatarUrl={backgroundRemovedUrl}
                selectedKey={selectedThumbnailKey}
              />
            </div>
          </div>
        </div>

        <div className="md:hidden flex flex-col items-center gap-4">
          <ProductOptions
            handleSelect={handleThumbnailSelect}
            avatarUrl={backgroundRemovedUrl}
            selectedKey={selectedThumbnailKey}
          />
          <BuyButton inputRef={inputRef} isLoading={isUploading} />
        </div>
      </div>
      {previewUrl !== "/images/your-drawing.png" && showGeenerateOption && (
        <div className="mt-6 w-full text-center">
          <GenerateButton onClick={handleGenerate} isLoading={isGenerating} />
        </div>
      )}
    </section>
  )
}
