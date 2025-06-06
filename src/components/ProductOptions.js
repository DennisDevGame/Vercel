import Image from "next/image"
import { useEffect, useState } from "react"
import { thumbnailOverlays } from "@/utils/thumbnailOverlayMap"
import { compositeThumbnail } from "@/utils/composite"

export default function ProductOptions({ handleSelect, avatarUrl, selectedKey }) {
  const [compositedThumbs, setCompositedThumbs] = useState({})
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false)

  useEffect(() => {
    if (!avatarUrl) return

    const generateThumbnails = async () => {
      const all = {}
      let firstKey = null
      let firstThumb = null

      for (const [key, config] of Object.entries(thumbnailOverlays)) {
        if (!avatarUrl.includes("sample_output")) {
          const composed = await compositeThumbnail(config.src, avatarUrl, config.overlay)
          all[key] = composed

          if (!firstKey) {
            firstKey = key
            firstThumb = composed
          }
        }
      }

      setCompositedThumbs(all)

      // Only auto-trigger on first avatar generation
      if (firstKey && firstThumb && !hasGeneratedOnce) {
        handleSelect(firstKey, avatarUrl)
        setHasGeneratedOnce(true)
      }
    }

    generateThumbnails()
  }, [avatarUrl])

  return (
    <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
      <div className="flex gap-4 px-1 w-max">
        {Object.entries(thumbnailOverlays).map(([key, { title, initImage }]) => {
          const thumb = compositedThumbs[key] || initImage
          const isSelected = key === selectedKey

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleSelect(key)}
              className={`flex flex-col items-center text-center min-w-[72px] rounded-md p-1 border transition-all ${
                isSelected ? "border-gray-300 bg-gray-50" : "border-transparent hover:border-black/50"
              }`}
              style={{ borderColor: isSelected ? undefined : "transparent" }}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 relative">
                {thumb ? (
                  <Image src={thumb} alt={title} fill className="object-contain" />
                ) : (
                  <div className="w-full h-full bg-gray-100 animate-pulse rounded-md" />
                )}
              </div>
              <p className="text-sm text-black mt-1">{title}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
