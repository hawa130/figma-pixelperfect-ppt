import PptxGenJS from 'pptxgenjs'

import type { ExportImageData } from '../../shared/types'
import { uint8ArrayToBase64 } from './utils'

const INCHES_PER_PIXEL = 1 / 96

function pixelsToInches(pixels: number): number {
  return pixels * INCHES_PER_PIXEL
}

export async function createPptxFromImages(images: ExportImageData[]): Promise<Uint8Array<ArrayBuffer>> {
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
    const slide = pptx.addSlide()
    const base64 = uint8ArrayToBase64(image.bytes)
    slide.background = {
      data: `image/png;base64,${base64}`,
    }
  }

  const result = await pptx.write({ outputType: 'uint8array' })
  if (result instanceof Uint8Array) {
    return result as Uint8Array<ArrayBuffer>
  }
  if (result instanceof ArrayBuffer) {
    return new Uint8Array(result)
  }
  throw new Error('Unexpected return type from pptx.write()')
}
