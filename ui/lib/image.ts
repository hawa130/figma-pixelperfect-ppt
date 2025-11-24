export type ResizeMode = 'fill' | 'fit' | 'original' | 'stretch' | 'scale-down'

export interface ResizeOptionsBase {
  input: Uint8Array
  width: number
  height: number
  mode?: ResizeMode
  scale?: number
  mimeType?: 'image/png' | 'image/jpeg' | 'image/webp'
  quality?: number
}

export interface ResizeOptionsUint8Array extends ResizeOptionsBase {
  outputType?: 'uint8array'
}

export interface ResizeOptionsBlob extends ResizeOptionsBase {
  outputType: 'blob'
}

export type ResizeOptions = ResizeOptionsUint8Array | ResizeOptionsBlob

export function resizeImage(options: ResizeOptionsUint8Array): Promise<Uint8Array>
export function resizeImage(options: ResizeOptionsBlob): Promise<Blob>
export async function resizeImage({
  input,
  width,
  height,
  mode = 'fill',
  scale = 1,
  mimeType = 'image/png',
  quality = 0.95,
  outputType = 'uint8array',
}: ResizeOptions): Promise<Uint8Array | Blob> {
  const blob = new Blob([input as BlobPart], { type: mimeType })
  const bitmap = await createImageBitmap(blob)

  const { width: srcW, height: srcH } = bitmap

  const targetWidth = width * scale
  const targetHeight = height * scale

  let sx = 0
  let sy = 0
  let sWidth = srcW
  let sHeight = srcH

  let dx = 0
  let dy = 0
  let dWidth = targetWidth
  let dHeight = targetHeight

  switch (mode) {
    case 'fill': {
      const targetRatio = targetWidth / targetHeight
      const sourceRatio = srcW / srcH

      if (sourceRatio > targetRatio) {
        sWidth = srcH * targetRatio
        sx = (srcW - sWidth) / 2
      } else {
        sHeight = srcW / targetRatio
        sy = (srcH - sHeight) / 2
      }
      break
    }
    case 'fit': {
      const ratio = Math.min(targetWidth / srcW, targetHeight / srcH)
      dWidth = srcW * ratio
      dHeight = srcH * ratio
      dx = (targetWidth - dWidth) / 2
      dy = (targetHeight - dHeight) / 2
      break
    }
    case 'original': {
      dWidth = srcW
      dHeight = srcH
      dx = (targetWidth - srcW) / 2
      dy = (targetHeight - srcH) / 2
      break
    }
    case 'stretch': {
      dWidth = targetWidth
      dHeight = targetHeight
      break
    }
    case 'scale-down': {
      const ratio = Math.min(1, targetWidth / srcW, targetHeight / srcH)
      dWidth = srcW * ratio
      dHeight = srcH * ratio
      dx = (targetWidth - dWidth) / 2
      dy = (targetHeight - dHeight) / 2
      break
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context not available')

  ctx.drawImage(bitmap, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  bitmap.close()

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Image encoding failed'))
          return
        }
        switch (outputType) {
          case 'uint8array': {
            blob
              .arrayBuffer()
              .then((buffer) => resolve(new Uint8Array(buffer)))
              .catch(reject)
            break
          }
          case 'blob': {
            resolve(blob)
            break
          }
        }
      },
      mimeType,
      quality,
    )
  })
}
