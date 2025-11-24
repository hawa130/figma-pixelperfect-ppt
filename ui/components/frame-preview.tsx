import { useCallback, useEffect, useRef, type ComponentProps } from 'react'

import type { ExportThumbnailData } from '../../shared/types'
import { postMainMessage, useMainMessageEvent } from '../lib'
import { drawCheckerboardBackground } from '../lib/canvas'
import { resizeImage } from '../lib/image'
import { usePluginStore } from '../store/use-plugin-store'

function processImage(image: ExportThumbnailData) {
  const {
    customSize: { width, height },
    resizeMode,
  } = usePluginStore.getState()
  return resizeImage({
    input: image.bytes,
    scale: image.scale,
    width: width,
    height: height,
    mode: resizeMode,
    outputType: 'blob',
  })
}

export function FramePreview({ className, ...props }: ComponentProps<'div'>) {
  const ref = useRef<HTMLCanvasElement>(null)
  const imageDataRef = useRef<ExportThumbnailData | null>(null)

  useEffect(() => {
    postMainMessage({ type: 'export_thumbnail' })
  }, [])

  const drawImage = useCallback(async (image: Uint8Array | Blob) => {
    if (!ref.current) return
    const blob = image instanceof Blob ? image : new Blob([image as BlobPart], { type: 'image/png' })
    const bitmap = await createImageBitmap(blob)
    const canvas = ref.current
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawCheckerboardBackground(ctx, canvas.width, canvas.height)
    ctx.drawImage(bitmap, 0, 0)
    bitmap.close()
  }, [])

  useEffect(() => {
    const unsubscribe = usePluginStore.subscribe((current, prev) => {
      if (
        current.customSize.width !== prev.customSize.width ||
        current.customSize.height !== prev.customSize.height ||
        current.resizeMode !== prev.resizeMode ||
        current.sizeMode !== prev.sizeMode
      ) {
        if (!imageDataRef.current) return
        switch (current.sizeMode) {
          case 'original':
            void drawImage(imageDataRef.current.bytes)
            break
          case 'custom':
            void processImage(imageDataRef.current).then((image) => drawImage(image))
            break
        }
      }
    })
    return () => unsubscribe()
  }, [drawImage])

  useMainMessageEvent('export_thumbnail_complete', (message) => {
    if (!message.image) return
    imageDataRef.current = message.image
    void drawImage(message.image.bytes)
  })

  return (
    <div className={className} {...props}>
      <canvas ref={ref} className="w-full" />
    </div>
  )
}
