import { debounce } from 'radashi'

import { onUIMessage, postUIMessage } from './lib'
import { exportFramesAsImages, exportThumbnail } from './lib/export'
import { getFrames, getMaxFrameDimensions, getPreviewFrame, getSelectedFrames } from './lib/get-frames'
import {
  getMaxSlideDimensions,
  getPreviewSlide,
  getSelectedSlides,
  getSlides,
  type GetPreviewSlideOptions,
} from './lib/get-slides'
import { createTask } from './lib/task'
import { defaultExportSettings } from './settings'
import { getPluginState, pushPluginState, registerPluginStateSync, setPluginState, watch } from './store'

const exportTask = createTask(async (signal, settings?: ExportSettings) => {
  const { mode } = getPluginState()
  const frames = figma.editorType === 'slides' ? getSlides(mode) : getFrames()
  return await exportFramesAsImages(frames, settings, { signal })
})

function handleGetSelectedNodes() {
  const frames = figma.editorType === 'slides' ? getSelectedSlides() : getSelectedFrames()
  setPluginState((state) => {
    state.frameCount = frames.length
  })
}

function handleSelectedNodeChange(event: NodeChangeEvent) {
  event.nodeChanges.forEach(async (change) => {
    const { mode, previewIndex } = getPluginState()
    const { frame } =
      figma.editorType === 'slides' ? getPreviewSlide(previewIndex, mode) : getPreviewFrame(previewIndex)
    if (change.id === frame?.id) {
      const image = await exportThumbnail(frame)
      const dimensions = figma.editorType === 'slides' ? getMaxSlideDimensions() : getMaxFrameDimensions()
      postUIMessage({ type: 'export_thumbnail_complete', image, dimensions })
    }
  })
}

async function handleThumbnailExport(options: GetPreviewSlideOptions = {}) {
  const { mode, previewIndex } = getPluginState()
  const { frame, total, index } =
    figma.editorType === 'slides' ? getPreviewSlide(previewIndex, mode, options) : getPreviewFrame(previewIndex)

  setPluginState((state) => {
    state.previewIndex = index
    state.previewTotal = total
  })

  if (!frame) {
    postUIMessage({ type: 'export_thumbnail_complete' })
    return
  }

  const image = await exportThumbnail(frame)
  const dimensions = figma.editorType === 'slides' ? getMaxSlideDimensions(mode) : getMaxFrameDimensions()
  postUIMessage({ type: 'export_thumbnail_complete', image, dimensions })
}

function main() {
  onUIMessage('editor_meta_request', () => {
    postUIMessage({
      type: 'editor_meta_response',
      state: {
        editorType: figma.editorType,
        documentName: figma.root.name,
      },
    })
  })

  figma.on('selectionchange', handleGetSelectedNodes)

  registerPluginStateSync()
  onUIMessage('plugin_sync_request', pushPluginState)

  onUIMessage('export_thumbnail', () => handleThumbnailExport({ syncWithSelection: true }))
  figma.on('selectionchange', () => handleThumbnailExport({ syncWithSelection: true }))
  watch(
    (state) => [state.previewIndex, state.mode],
    () => handleThumbnailExport(),
  )
  figma.currentPage.on('nodechange', debounce({ delay: 300 }, handleSelectedNodeChange))
  onUIMessage('export_frames_as_images', async (message) => {
    await exportTask.execute(Object.assign(defaultExportSettings, message.settings) as ExportSettings)
  })

  onUIMessage('cancel_export', () => {
    exportTask.cancel()
  })

  onUIMessage('query_filename', () => {
    postUIMessage({ type: 'filename_update', filename: figma.root.name })
  })

  onUIMessage('update_size', (message) => {
    figma.ui.resize(Math.ceil(message.width), Math.ceil(message.height))
  })

  figma.showUI(__html__, {
    themeColors: true,
    width: 248,
    height: figma.editorType === 'slides' ? 374 : 309,
  })
}

main()
