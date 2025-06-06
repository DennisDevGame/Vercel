'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faDownload,
  faSearchPlus,
  faSearchMinus,
} from '@fortawesome/free-solid-svg-icons'

export default function GeneratedImagePreview({ url }) {
  const [showPreview, setShowPreview] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [zoom, setZoom] = useState(1)

  const imageWrapperRef = useRef(null)

  const handlePreview = (e) => {
    e.preventDefault()
    setShowPreview(true)
  }

  const handleClose = () => {
    setShowPreview(false)
    setZoom(1)
  }

  const handleDownload = async (e) => {
    e.preventDefault()
    setIsDownloading(true)
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = blobUrl
      a.download = 'generated-image.png'
      document.body.appendChild(a)
      a.click()
      a.remove()

      URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error('Download failed:', err)
      alert('Failed to download image.')
    } finally {
      setIsDownloading(false)
    }
  }

  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 5))
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.25))

  return (
    <>
      {/* Thumbnail */}
      <div className="w-full max-w-[300px] aspect-square relative group rounded-md overflow-hidden shadow-md">
        <Image
          src={url}
          alt="Generated Image"
          fill
          className="object-contain transition-opacity duration-200"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-50 transition" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10">
          <div className="flex gap-4">
            <button
              onClick={handlePreview}
              className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition w-10 h-10 flex items-center justify-center"
              title="Preview"
            >
              <FontAwesomeIcon icon={faEye} fixedWidth />
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition w-10 h-10 flex items-center justify-center"
              title="Download"
            >
              {isDownloading ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faDownload} fixedWidth />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Full screen modal with zoom/scroll */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-black text-3xl font-bold hover:opacity-70 z-50"
            title="Close"
          >
            &times;
          </button>

          {/* Zoom control panel (bottom-right) */}
          <div className="absolute bottom-6 right-6 z-50 flex items-center gap-2 bg-white bg-opacity-80 px-3 py-2 rounded shadow">
            <button
              onClick={zoomOut}
              className="text-black p-1 hover:text-red-500"
              title="Zoom Out"
            >
              <FontAwesomeIcon icon={faSearchMinus} />
            </button>
            <span className="text-sm font-semibold text-black flex items-center h-6">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={zoomIn}
              className="text-black p-1 hover:text-green-600"
              title="Zoom In"
            >
              <FontAwesomeIcon icon={faSearchPlus} />
            </button>
          </div>

          {/* Scrollable zoomable image container */}
          <div className="flex-1 overflow-auto p-4 flex justify-center items-center">
            <div
              ref={imageWrapperRef}
              className="relative"
              style={{
                width: `${zoom * 100}%`,
                height: `${zoom * 100}%`,
                minWidth: '300px',
                minHeight: '300px',
              }}
            >
              <Image
                src={url}
                alt="Zoomed preview"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
