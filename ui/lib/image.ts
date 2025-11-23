export interface CropOptions {
  input: Uint8Array
  width: number
  height: number
  scale?: number
  mimeType?: 'image/png' | 'image/jpeg' | 'image/webp'
  quality?: number
}

export async function cropImageToFill({
  input,
  width,
  height,
  scale = 1,
  mimeType = 'image/png',
  quality = 0.95,
}: CropOptions): Promise<Uint8Array> {
  const blob = new Blob([input as BlobPart], { type: mimeType })
  const bitmap = await createImageBitmap(blob)

  const { width: srcW, height: srcH } = bitmap
  const targetRatio = width / height
  const sourceRatio = srcW / srcH

  let sx = 0
  let sy = 0
  let sw = srcW
  let sh = srcH

  if (sourceRatio > targetRatio) {
    sw = srcH * targetRatio
    sx = (srcW - sw) / 2
  } else {
    sh = srcW / targetRatio
    sy = (srcH - sh) / 2
  }

  const outputWidth = width * scale
  const outputHeight = height * scale

  const canvas = document.createElement('canvas')
  canvas.width = outputWidth
  canvas.height = outputHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context not available')

  ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, outputWidth, outputHeight)
  bitmap.close()

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Image encoding failed'))
          return
        }
        blob
          .arrayBuffer()
          .then((buffer) => resolve(new Uint8Array(buffer)))
          .catch(reject)
      },
      mimeType,
      quality,
    )
  })
}
