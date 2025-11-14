import { exportFramesAsImages } from './export'
import { onUIMessage, postUIMessage } from './lib'

function getSelectedFrames() {
  return figma.currentPage.selection.filter((node) => node.type === 'SLIDE')
}

async function handleExport() {
  const PAGE_NUMBER_REGEX = /\d+/
  const frames = getSelectedFrames()
    .map((frame) => {
      const match = frame.name.match(PAGE_NUMBER_REGEX)
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
      type: 'SELECTION_UPDATE',
      frameCount: frames.length,
    })
  })

  onUIMessage((message) => {
    switch (message.type) {
      case 'QUERY_SELECTION': {
        const frames = getSelectedFrames()
        postUIMessage({
          type: 'SELECTION_UPDATE',
          frameCount: frames.length,
        })
        break
      }
      case 'EXPORT_FRAMES_AS_IMAGES': {
        void handleExport()
        break
      }
      default:
        break
    }
  })

  figma.showUI(__html__, {
    themeColors: true,
    width: 228,
    height: 100,
  })
}

main()
