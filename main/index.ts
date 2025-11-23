import { assign } from 'radashi'

import { onUIMessage, postUIMessage } from './lib'
import { exportFramesAsImages } from './lib/export'
import { getAllSlides, getSelectedSlides } from './lib/get-slides'
import { createTask } from './lib/task'
import { defaultExportSettings } from './settings'

const exportTask = createTask(async (signal, mode: 'selected' | 'all' = 'all', settings?: ExportSettings) => {
  const slides = mode === 'selected' ? getSelectedSlides() : getAllSlides()
  const frames = slides
    .map((frame) => {
      const match = frame.name.match(/\d+/)
      return match ? { frame, pageNumber: parseInt(match[0], 10) } : { frame, pageNumber: 0xfffffff }
    })
    .sort((a, b) => a.pageNumber - b.pageNumber)
    .map((item) => item.frame)

  return await exportFramesAsImages(frames, settings, { signal })
})

function main() {
  figma.on('selectionchange', () => {
    const frames = getSelectedSlides()
    postUIMessage({
      type: 'selection_update',
      frameCount: frames.length,
    })
  })

  onUIMessage('query_selection', () => {
    const frames = getSelectedSlides()
    postUIMessage({
      type: 'selection_update',
      frameCount: frames.length,
    })
  })

  onUIMessage('export_frames_as_images', async (message) => {
    await exportTask.execute(message.mode, assign(defaultExportSettings, message.settings) as ExportSettings)
  })

  onUIMessage('cancel_export', () => {
    exportTask.cancel()
  })

  onUIMessage('query_filename', () => {
    postUIMessage({
      type: 'filename_update',
      filename: figma.root.name,
    })
  })

  onUIMessage('update_size', (message) => {
    figma.ui.resize(message.width, message.height)
  })

  figma.showUI(__html__, {
    themeColors: true,
    width: 240,
    height: 251,
  })
}

main()
