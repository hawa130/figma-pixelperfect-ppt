import { assign } from 'radashi'

import { onUIMessage, postUIMessage } from './lib'
import { exportFramesAsImages } from './lib/export'
import { defaultExportSettings } from './settings'

function getSelectedSlides() {
  return figma.currentPage.selection.filter((node) => node.type === 'SLIDE')
}

function getAllSlides() {
  return figma.currentPage
    .findAll()
    .filter((node) => node.type === 'SLIDE')
    .filter((node) => !node.isSkippedSlide)
}

async function handleExport(mode: 'selected' | 'all' = 'all', settings?: ExportSettings) {
  const slides = mode === 'selected' ? getSelectedSlides() : getAllSlides()
  const frames = slides
    .map((frame) => {
      const match = frame.name.match(/\d+/)
      return match ? { frame, pageNumber: parseInt(match[0], 10) } : { frame, pageNumber: 0xfffffff }
    })
    .sort((a, b) => a.pageNumber - b.pageNumber)
    .map((item) => item.frame)
  await exportFramesAsImages(frames, settings)
}

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

  onUIMessage('export_frames_as_images', (message) => {
    void handleExport(message.mode, assign(defaultExportSettings, message.settings) as ExportSettings)
  })

  onUIMessage('query_filename', () => {
    postUIMessage({
      type: 'filename_update',
      filename: figma.root.name,
    })
  })

  figma.showUI(__html__, {
    themeColors: true,
    width: 220,
    height: 200,
  })
}

main()
