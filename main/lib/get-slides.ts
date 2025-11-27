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

export interface GetPreviewSlideOptions {
  syncWithSelection?: boolean
}

export function getPreviewSlide(
  index = 0,
  mode: 'selected' | 'all' = 'all',
  { syncWithSelection = false }: GetPreviewSlideOptions = {},
): { frame?: SlideNode; total: number; index: number } {
  const slides = getSlides(mode)

  if (syncWithSelection && mode === 'all') {
    // Set the preview index to the current focused slide
    const currentSlide = getSelectedSlides()[0] as SlideNode | undefined
    const frameIndex = slides.findIndex((slide) => slide.id === currentSlide?.id)
    if (frameIndex !== -1) {
      return {
        frame: slides[frameIndex],
        total: slides.length,
        index: frameIndex,
      }
    }
  }

  const frame = slides[index]
  return {
    frame: frame ?? slides[0],
    total: slides.length,
    index: frame ? index : 0,
  }
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
