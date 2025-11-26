import { Dimensions } from '../../shared/types'

export function getSelectedSlides() {
  const selectedSlides = figma.currentPage.selection.filter((node) => node.type === 'SLIDE')
  if (selectedSlides.length === 0 && figma.viewport.slidesView === 'single-slide') {
    return figma.currentPage.focusedSlide ? [figma.currentPage.focusedSlide] : []
  }
  return selectedSlides
}

export function getAllSlides() {
  return figma.currentPage.findAll((node) => node.type === 'SLIDE' && !node.isSkippedSlide) as SlideNode[]
}

export function getPreviewSlide() {
  const slide =
    figma.currentPage.selection.find((node) => node.type === 'SLIDE') ??
    figma.currentPage.focusedSlide ??
    (figma.currentPage.findOne((node) => node.type === 'SLIDE') as SlideNode | null)
  return slide ?? undefined
}

export function getSlides(mode: 'selected' | 'all' = 'all') {
  const slides = mode === 'selected' ? getSelectedSlides() : getAllSlides()
  return slides
    .map((frame) => {
      const match = frame.name.match(/\d+/)
      return match ? { frame, pageNumber: parseInt(match[0], 10) } : { frame, pageNumber: 0xfffffff }
    })
    .sort((a, b) => a.pageNumber - b.pageNumber)
    .map((item) => item.frame)
}

export function getMaxSlideDimensions(mode: 'selected' | 'all' = 'all') {
  const scale = 0.25
  return getSlides(mode).reduce<Dimensions>(
    (max, slide) => ({
      width: Math.max(max.width, slide.width),
      height: Math.max(max.height, slide.height),
      scale,
    }),
    { width: 0, height: 0, scale },
  )
}
