import { exportFramesAsImages } from './export'
import { onUIMessage, postUIMessage } from './lib'

function getSelectedFrames() {
  return figma.currentPage.selection.filter((node) => node.type === 'SLIDE')
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
        const frames = getSelectedFrames()
        void exportFramesAsImages(frames)
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
