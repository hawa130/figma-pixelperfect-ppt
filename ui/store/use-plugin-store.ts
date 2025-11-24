import { create } from 'zustand'

import type { ExportImageData } from '../../shared/types'
import { downloadFile } from '../lib/download'
import { createPptxFromImages, type PptxOptions } from '../lib/pptx'

interface PluginState {
  frameCount: number
  mode: 'selected' | 'all'
  isExporting: boolean
  message: string | Error | null
  filename: string
  scale: number
  sizeMode: 'original' | 'custom'
  customSize: { width: number; height: number }

  setFrameCount: (count: number) => void
  setMode: (mode: 'selected' | 'all') => void
  setIsExporting: (isExporting: boolean) => void
  setMessage: (message: string | Error | null) => void
  setFilename: (filename: string) => void
  setScale: (scale: number) => void
  setSizeMode: (sizeMode: 'original' | 'custom') => void
  setCustomWidth: (width: number) => void
  setCustomHeight: (height: number) => void

  startExport: () => void
  cancelExport: () => void
  handleExportProgress: (current: number, total: number) => void
  handleExportError: (error: string) => void
  handleExportComplete: (images: ExportImageData[]) => Promise<void>
}

export const usePluginStore = create<PluginState>((set, get) => ({
  frameCount: 0,
  mode: 'all',
  isExporting: false,
  message: null,
  filename: 'Slides',
  scale: 2,
  sizeMode: 'original',
  customSize: { width: 1920, height: 1080 },

  setFrameCount: (count) => set({ frameCount: count }),
  setMode: (mode) => set({ mode }),
  setIsExporting: (isExporting) => set({ isExporting }),
  setMessage: (message) => set({ message }),
  setFilename: (filename) => set({ filename }),
  setScale: (scale) => set({ scale }),
  setSizeMode: (sizeMode) => set({ sizeMode }),
  setCustomWidth: (width) => set((prev) => ({ customSize: { ...prev.customSize, width } })),
  setCustomHeight: (height) => set((prev) => ({ customSize: { ...prev.customSize, height } })),

  startExport: () => set({ isExporting: true, message: null }),
  cancelExport: () => set({ isExporting: false, message: null }),
  handleExportProgress: (current, total) =>
    set({
      isExporting: true,
      message: `Exporting slide ${current} of ${total}`,
    }),
  handleExportError: (error) =>
    set({
      isExporting: false,
      message: new Error(error),
    }),
  handleExportComplete: async (images) => {
    set({ message: 'Creating PPTX file...' })
    try {
      const state = get()
      const settings: PptxOptions | undefined =
        state.sizeMode === 'custom'
          ? {
              width: state.customSize.width,
              height: state.customSize.height,
              scale: state.scale,
            }
          : undefined
      const blob = await createPptxFromImages(images, settings)
      downloadFile({ filename: `${state.filename}.pptx`, blob })
    } catch (error) {
      set({
        message: error instanceof Error ? error : new Error('An unexpected error occurred'),
      })
    } finally {
      set({ message: null, isExporting: false })
    }
  },
}))
