import type { Dimensions } from '../../shared/types'

export function getSelectedFrames() {
  return figma.currentPage.selection.filter((node) => node.type === 'FRAME')
}

export function getFrames() {
  return getSelectedFrames()
    .map((frame) => {
      const match = frame.name.match(/\d+/)
      return match ? { frame, pageNumber: parseInt(match[0], 10) } : { frame, pageNumber: 0xfffffff }
    })
    .sort((a, b) => a.pageNumber - b.pageNumber)
    .map((item) => item.frame)
}

export function getPreviewFrame(index = 0): { frame?: FrameNode; total: number; index: number } {
  const frames = getFrames()
  const frame = frames[index]
  return {
    frame: frame ?? frames[0],
    index: frame ? index : 0,
    total: frames.length,
  }
}

export function getMaxFrameDimensions() {
  const scale = 0.25
  return getFrames().reduce<Dimensions>(
    (max, frame) => ({
      width: Math.max(max.width, frame.width),
      height: Math.max(max.height, frame.height),
      scale,
    }),
    { width: 0, height: 0, scale },
  )
}
