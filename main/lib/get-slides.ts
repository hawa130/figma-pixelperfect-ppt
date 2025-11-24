export function getSelectedSlides() {
  return figma.currentPage.selection.filter((node) => node.type === 'SLIDE')
}

export function getAllSlides() {
  return figma.currentPage.findAll((node) => node.type === 'SLIDE' && !node.isSkippedSlide) as SlideNode[]
}

export function getPreviewSlide() {
  const slide =
    figma.currentPage.selection.find((node) => node.type === 'SLIDE') ??
    (figma.currentPage.findOne((node) => node.type === 'SLIDE') as SlideNode | null)
  return slide ?? undefined
}
