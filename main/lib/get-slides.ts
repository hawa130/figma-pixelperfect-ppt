export function getSelectedSlides() {
  return figma.currentPage.selection.filter((node) => node.type === 'SLIDE')
}

export function getAllSlides() {
  return figma.currentPage.findAll((node) => node.type === 'SLIDE' && !node.isSkippedSlide) as SlideNode[]
}
