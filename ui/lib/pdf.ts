import { jsPDF } from 'jspdf'

import type { ExportImageData } from '../../shared/types'
import { resizeImage, type ResizeMode } from './image'

const PIXELS_PER_INCH = 144
const POINTS_PER_INCH = 72

export interface PdfOptions {
  width?: number
  height?: number
  scale?: number
  mode?: ResizeMode
}

function points(pixels: number): number {
  return (pixels / PIXELS_PER_INCH) * POINTS_PER_INCH
}

async function getPdfImage(image: ExportImageData, options: Required<PdfOptions>): Promise<Uint8Array> {
  if (image.width === options.width && image.height === options.height) {
    return image.bytes
  }

  return resizeImage({
    input: image.bytes,
    ...options,
    backgroundColor: '#ffffff',
  })
}

export async function createPdfFromImages(images: ExportImageData[], options: PdfOptions = {}): Promise<Blob> {
  if (images.length === 0) throw new Error('No pages to export')

  const pdfOptions = {
    width: options.width ?? Math.max(...images.map((image) => image.width)),
    height: options.height ?? Math.max(...images.map((image) => image.height)),
    scale: options.scale ?? 1,
    mode: options.mode ?? 'fill',
  } satisfies Required<PdfOptions>
  const pageWidth = points(pdfOptions.width)
  const pageHeight = points(pdfOptions.height)
  const orientation = pageWidth > pageHeight ? 'landscape' : 'portrait'
  const pdf = new jsPDF({
    orientation,
    unit: 'pt',
    format: [pageWidth, pageHeight],
    compress: true,
    putOnlyUsedFonts: true,
  })

  for (const [index, image] of images.entries()) {
    if (index > 0) {
      pdf.addPage([pageWidth, pageHeight], orientation)
    }

    const imageBytes = await getPdfImage(image, pdfOptions)
    pdf.addImage(imageBytes, 'PNG', 0, 0, pageWidth, pageHeight)
  }

  return pdf.output('blob')
}
