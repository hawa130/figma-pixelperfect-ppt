import PptxGenJS from 'pptxgenjs'

import type { ExportImageData } from '../../shared/types'
import { uint8ArrayToBase64 } from './utils'

const INCHES_PER_PIXEL = 1 / 192

function pixelsToInches(pixels: number): number {
  return pixels * INCHES_PER_PIXEL
}

export async function createPptxFromImages(images: ExportImageData[]): Promise<Blob> {
  if (images.length === 0) {
    throw new Error('No images provided')
  }

  const maxWidth = Math.max(...images.map((img) => img.width))
  const maxHeight = Math.max(...images.map((img) => img.height))

  const widthInches = pixelsToInches(maxWidth)
  const heightInches = pixelsToInches(maxHeight)

  const pptx = new PptxGenJS()
  pptx.defineLayout({
    name: 'custom',
    width: widthInches,
    height: heightInches,
  })
  pptx.layout = 'custom'

  for (const image of images) {
    const slide = pptx.addSlide({ masterName: 'custom' })
    const base64 = uint8ArrayToBase64(image.bytes)
    slide.background = {
      data: `image/png;base64,${base64}`,
    }
  }

  return (await pptx.write({ outputType: 'blob', compression: true })) as Blob
}
