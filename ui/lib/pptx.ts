import PptxGenJS from 'pptxgenjs'

import type { ExportImageData } from '../../shared/types'
import { resizeImage, type ResizeMode } from './image'
import { uint8ArrayToBase64 } from './utils'

const PIXELS_PER_INCH = 144

function pixelsToInches(pixels: number): number {
  return pixels / PIXELS_PER_INCH
}

export interface PptxOptions {
  width?: number
  height?: number
  scale?: number
  mode?: ResizeMode
}

export async function createPptxFromImages(images: ExportImageData[], options: PptxOptions = {}): Promise<Blob> {
  if (images.length === 0) {
    throw new Error('No slides to export')
  }

  const { width, height, scale, mode = 'fill' } = options
  const globalWidth = width ?? Math.max(...images.map((img) => img.width))
  const globalHeight = height ?? Math.max(...images.map((img) => img.height))

  const widthInches = pixelsToInches(globalWidth)
  const heightInches = pixelsToInches(globalHeight)

  const pptx = new PptxGenJS()
  pptx.defineLayout({
    name: 'custom',
    width: widthInches,
    height: heightInches,
  })
  pptx.layout = 'custom'

  for (const image of images) {
    const slide = pptx.addSlide({ masterName: 'custom' })
    const needToCrop = image.width !== globalWidth || image.height !== globalHeight
    const base64 = uint8ArrayToBase64(
      needToCrop
        ? await resizeImage({
            input: image.bytes,
            width: globalWidth,
            height: globalHeight,
            scale,
            mode,
          })
        : image.bytes,
    )
    slide.background = {
      data: `image/png;base64,${base64}`,
    }
  }

  return (await pptx.write({ outputType: 'blob', compression: true })) as Blob
}
