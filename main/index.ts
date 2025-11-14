import { exportFramesAsImages } from './export'
import { onUIMessage, postUIMessage } from './lib'

function getSelectedFrames() {
  return figma.currentPage.selection.filter((node) => node.type === 'SLIDE')
}

async function handleExport() {
  const frames = getSelectedFrames()
    .map((frame) => {
      const match = frame.name.match(/\d+/)
      return match ? { frame, pageNumber: parseInt(match[0], 10) } : { frame, pageNumber: 0xfffffff }
    })
    .sort((a, b) => a.pageNumber - b.pageNumber)
    .map((item) => item.frame)
  await exportFramesAsImages(frames)
}

function main() {
  figma.on('selectionchange', () => {
    const frames = getSelectedFrames()
    postUIMessage({
      type: 'selection_update',
      frameCount: frames.length,
    })
  })

  onUIMessage('query_selection', () => {
    const frames = getSelectedFrames()
    postUIMessage({
      type: 'selection_update',
      frameCount: frames.length,
    })
  })

  onUIMessage('export_frames_as_images', () => {
    void handleExport()
  })

  figma.showUI(__html__, {
    themeColors: true,
    width: 228,
    height: 100,
  })
}

main()
