import { postUIMessage } from '.'
import type { ExportImageData, ExportThumbnailData } from '../../shared/types'
import { defaultExportSettings } from '../settings'
import type { TaskOptions } from './types'

async function exportFrameAsImage(
  frame: BaseFrameMixin,
  exportSettings: ExportSettings = defaultExportSettings,
): Promise<ExportImageData> {
  const bytes = await frame.exportAsync(exportSettings)
  return { bytes, width: frame.width, height: frame.height }
}

export async function exportFramesAsImages(
  frames: BaseFrameMixin[],
  settings: ExportSettings = defaultExportSettings,
  options: TaskOptions = {},
) {
  if (frames.length === 0) {
    postUIMessage({
      type: 'export_error',
      message: figma.editorType === 'slides' ? 'No slides selected' : 'No frames selected',
    })
    return
  }

  try {
    const images: ExportImageData[] = []

    for (const [index, frame] of frames.entries()) {
      if (options.signal?.aborted) {
        postUIMessage({ type: 'export_cancelled' })
        figma.notify('Export cancelled', { timeout: 2000 })
        return
      }

      postUIMessage({
        type: 'export_progress',
        current: index + 1,
        total: frames.length,
      })

      await new Promise((resolve) => setTimeout(resolve, 50))
      const imageData = await exportFrameAsImage(frame, settings)
      images.push(imageData)
    }

    postUIMessage({ type: 'export_complete', images })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Export failed'
    figma.notify(message, { error: true })
    postUIMessage({ type: 'export_error', message })
  }
}

export async function exportThumbnail(frame: BaseFrameMixin): Promise<ExportThumbnailData> {
  const scale = 0.25
  const bytes = await frame.exportAsync({
    format: 'PNG',
    constraint: { type: 'SCALE', value: scale },
  })
  return { bytes, width: frame.width, height: frame.height, scale }
}
