import type { Dimensions } from '../../shared/types'

export function getSelectedFrames() {
  return figma.currentPage.selection.filter((node) => node.type === 'FRAME')
}

export function getPreviewFrame() {
  const frame = figma.currentPage.selection.find((node) => node.type === 'FRAME')
  return frame ?? undefined
}

export function getFrames() {
  return getSelectedFrames()
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
