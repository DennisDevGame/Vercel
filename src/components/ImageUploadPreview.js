"use client"

import Image from "next/image"

export default function ImageUploadPreview({ previewUrl, inputRef, onChange}) {
  return (
    <div className="w-full max-w-[300px] aspect-square relative group  rounded-md overflow-hidden shadow-md">
      <Image src={previewUrl} alt="Preview" fill className="object-contain rounded-md" />
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={onChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  )
}
