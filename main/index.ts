import { assign, debounce } from 'radashi'

import { onUIMessage, postUIMessage } from './lib'
import { exportFramesAsImages, exportThumbnail } from './lib/export'
import { getFrames, getMaxFrameDimensions, getPreviewFrame, getSelectedFrames } from './lib/get-frames'
import { getMaxSlideDimensions, getPreviewSlide, getSelectedSlides, getSlides } from './lib/get-slides'
import { createTask } from './lib/task'
import { defaultExportSettings } from './settings'

const exportTask = createTask(async (signal, mode: 'selected' | 'all' = 'all', settings?: ExportSettings) => {
  const frames = figma.editorType === 'slides' ? getSlides(mode) : getFrames()
  return await exportFramesAsImages(frames, settings, { signal })
})

function handleGetSelectedNodes() {
  const frames = figma.editorType === 'slides' ? getSelectedSlides() : getSelectedFrames()
  postUIMessage({ type: 'selection_update', frameCount: frames.length })
}

function handleSelectedNodeChange(event: NodeChangeEvent) {
  event.nodeChanges.forEach(async (change) => {
    const frame = figma.editorType === 'slides' ? getPreviewSlide() : getPreviewFrame()
    if (!frame) {
      postUIMessage({ type: 'export_thumbnail_complete' })
      return
    }
    if (change.id === frame?.id) {
      const image = await exportThumbnail(frame)
      const dimensions = figma.editorType === 'slides' ? getMaxSlideDimensions() : getMaxFrameDimensions()
      postUIMessage({ type: 'export_thumbnail_complete', image, dimensions })
    }
  })
}

async function handleThumbnailExport() {
  const frame = figma.editorType === 'slides' ? getPreviewSlide() : getPreviewFrame()
  if (!frame) {
    postUIMessage({ type: 'export_thumbnail_complete' })
    return
  }
  const image = await exportThumbnail(frame)
  const dimensions = figma.editorType === 'slides' ? getMaxSlideDimensions() : getMaxFrameDimensions()
  postUIMessage({ type: 'export_thumbnail_complete', image, dimensions })
}

function main() {
  figma.on('selectionchange', handleGetSelectedNodes)
  onUIMessage('query_selection', handleGetSelectedNodes)

  onUIMessage('export_frames_as_images', async (message) => {
    await exportTask.execute(message.mode, assign(defaultExportSettings, message.settings) as ExportSettings)
  })

  onUIMessage('cancel_export', () => {
    exportTask.cancel()
  })

  onUIMessage('query_filename', () => {
    postUIMessage({ type: 'filename_update', filename: figma.root.name })
  })

  onUIMessage('export_thumbnail', handleThumbnailExport)
  figma.on('selectionchange', handleThumbnailExport)
  figma.currentPage.on('nodechange', debounce({ delay: 300 }, handleSelectedNodeChange))

  onUIMessage('update_size', (message) => {
    figma.ui.resize(Math.ceil(message.width), Math.ceil(message.height))
  })

  onUIMessage('query_editor_type', () => {
    postUIMessage({ type: 'editor_type_result', editorType: figma.editorType })
  })

  figma.showUI(__html__, {
    themeColors: true,
    width: 248,
    height: 380,
  })
}

main()
