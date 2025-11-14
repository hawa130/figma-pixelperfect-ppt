import type { ExportImageData } from '../shared/types'
import { postUIMessage } from './lib'

async function exportFrameAsImage(frame: BaseFrameMixin): Promise<ExportImageData> {
  const bytes = (await frame.exportAsync({
    format: 'PNG',
    constraint: { type: 'SCALE', value: 2 },
  })) as Uint8Array<ArrayBuffer>
  return { bytes, width: frame.width, height: frame.height }
}

export async function exportFramesAsImages(frames: BaseFrameMixin[]) {
  if (frames.length === 0) {
    postUIMessage({
      type: 'EXPORT_ERROR',
      message: 'No frames selected',
    })
    return
  }

  try {
    const images: ExportImageData[] = []

    for (let i = 0; i < frames.length; i++) {
      postUIMessage({
        type: 'EXPORT_PROGRESS',
        current: i + 1,
        total: frames.length,
      })

      const imageData = await exportFrameAsImage(frames[i])
      images.push(imageData)
    }

    postUIMessage({
      type: 'EXPORT_PROGRESS',
      current: frames.length,
      total: frames.length + 1,
    })

    postUIMessage({
      type: 'EXPORT_COMPLETE',
      images,
    })

    figma.notify(`Exported ${frames.length} frame(s) to PPTX`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Export failed'
    postUIMessage({
      type: 'EXPORT_ERROR',
      message,
    })
  }
}
