import { useCallback, useEffect, useRef, type ComponentProps } from 'react'
import { clsx } from 'clsx'

import type { Dimensions, ExportThumbnailData } from '../../shared/types'
import { postMainMessage, useMainMessageEvent } from '../lib'
import { drawCheckerboardBackground } from '../lib/canvas'
import { resizeImage } from '../lib/image'
import { usePluginStore } from '../store/use-plugin-store'

function applyCustomSize(image: ExportThumbnailData) {
  const {
    customSize: { width, height, resizeMode },
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

async function applyOriginalSize(image: ExportThumbnailData, dimensions: Dimensions) {
  if (image.width === dimensions.width && image.height === dimensions.height) {
    return new Blob([image.bytes as BlobPart], { type: 'image/png' })
  }
  const {
    originalSize: { resizeMode },
  } = usePluginStore.getState()
  return resizeImage({
    input: image.bytes,
    scale: dimensions.scale,
    width: dimensions.width,
    height: dimensions.height,
    mode: resizeMode,
    outputType: 'blob',
  })
}

export function FramePreview({ className, ...props }: ComponentProps<'div'>) {
  const ref = useRef<HTMLCanvasElement>(null)
  const imageDataRef = useRef<ExportThumbnailData | undefined>(undefined)
  const dimensionsRef = useRef<Dimensions | undefined>(undefined)

  const resetCanvas = useCallback(() => {
    if (!ref.current) return
    const canvas = ref.current
    canvas.width = 480
    canvas.height = 270
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawCheckerboardBackground(ctx, canvas.width, canvas.height)
  }, [])

  useEffect(() => {
    postMainMessage({ type: 'export_thumbnail' })
    if (imageDataRef.current) return
    resetCanvas()
  }, [resetCanvas])

  const drawImage = useCallback(async (image: Blob) => {
    if (!ref.current) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bitmap = await createImageBitmap(image)
    canvas.width = bitmap.width
    canvas.height = bitmap.height

    drawCheckerboardBackground(ctx, canvas.width, canvas.height)
    ctx.drawImage(bitmap, 0, 0)
    bitmap.close()
  }, [])

  useEffect(() => {
    const unsubscribe = usePluginStore.subscribe((current, prev) => {
      if (
        current.customSize.width !== prev.customSize.width ||
        current.customSize.height !== prev.customSize.height ||
        current.customSize.resizeMode !== prev.customSize.resizeMode ||
        current.originalSize.resizeMode !== prev.originalSize.resizeMode ||
        current.sizeMode !== prev.sizeMode
      ) {
        if (!imageDataRef.current || !dimensionsRef.current) return
        switch (current.sizeMode) {
          case 'original':
            void applyOriginalSize(imageDataRef.current, dimensionsRef.current).then(drawImage)
            break
          case 'custom':
            void applyCustomSize(imageDataRef.current).then(drawImage)
            break
        }
      }
    })
    return () => unsubscribe()
  }, [drawImage])

  useMainMessageEvent('export_thumbnail_complete', (message) => {
    imageDataRef.current = message.image
    dimensionsRef.current = message.dimensions

    if (!message.image || !message.dimensions) {
      void resetCanvas()
      return
    }

    const { sizeMode } = usePluginStore.getState()
    switch (sizeMode) {
      case 'original':
        void applyOriginalSize(message.image, message.dimensions).then(drawImage)
        break
      case 'custom':
        void applyCustomSize(message.image).then(drawImage)
        break
    }
  })

  return (
    <div className={clsx('flex items-center justify-center', className)} {...props}>
      <canvas ref={ref} className="block max-h-56 max-w-full border object-contain" />
    </div>
  )
}
