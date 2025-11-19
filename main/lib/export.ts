import { postUIMessage } from '.'
import type { ExportImageData } from '../../shared/types'
import { defaultExportSettings } from '../settings'

async function exportFrameAsImage(
  frame: BaseFrameMixin,
  exportSettings: ExportSettings = defaultExportSettings,
): Promise<ExportImageData> {
  const bytes = await frame.exportAsync(exportSettings)
  return { bytes, width: frame.width, height: frame.height }
}

export async function exportFramesAsImages(
  frames: BaseFrameMixin[],
  exportSettings: ExportSettings = defaultExportSettings,
) {
  if (frames.length === 0) {
    postUIMessage({
      type: 'export_error',
      message: 'No frames selected',
    })
    return
  }

  try {
    const images: ExportImageData[] = []

    for (const frame of frames) {
      const imageData = await exportFrameAsImage(frame, exportSettings)
      images.push(imageData)
    }

    postUIMessage({
      type: 'export_complete',
      images,
    })

    figma.notify(`Exported ${frames.length} slide${frames.length > 1 ? 's' : ''} to PPTX`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Export failed'
    figma.notify(message, { error: true })
    postUIMessage({
      type: 'export_error',
      message,
    })
  }
}
