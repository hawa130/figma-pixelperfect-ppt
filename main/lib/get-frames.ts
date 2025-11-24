export function getSelectedFrames() {
  return figma.currentPage.selection.filter((node) => node.type === 'FRAME')
}

export function getPreviewFrame() {
  const frame =
    figma.currentPage.selection.find((node) => node.type === 'FRAME') ??
    (figma.currentPage.findOne((node) => node.type === 'FRAME') as FrameNode | null)
  return frame ?? undefined
}
