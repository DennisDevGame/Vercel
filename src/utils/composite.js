export async function compositeThumbnail(baseImageUrl, avatarUrl, overlay) {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  const baseImg = await loadImage(baseImageUrl)
  const avatarImg = await loadImage(avatarUrl)

  canvas.width = baseImg.width
  canvas.height = baseImg.height

  ctx.drawImage(baseImg, 0, 0)
  ctx.drawImage(avatarImg, overlay.x, overlay.y, overlay.width, overlay.height)

  return canvas.toDataURL("image/png")
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
