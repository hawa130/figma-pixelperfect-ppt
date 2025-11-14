export interface ExportImageData {
  bytes: Uint8Array<ArrayBuffer>
  width: number
  height: number
}

interface SelectionUpdate {
  type: 'SELECTION_UPDATE'
  frameCount: number
}

interface ExportProgress {
  type: 'EXPORT_PROGRESS'
  current: number
  total: number
}

interface ExportComplete {
  type: 'EXPORT_COMPLETE'
  images: ExportImageData[]
}

interface ExportError {
  type: 'EXPORT_ERROR'
  message: string
}

export type MessageToUI = SelectionUpdate | ExportProgress | ExportComplete | ExportError

interface ExportFramesAsImagesMessage {
  type: 'EXPORT_FRAMES_AS_IMAGES'
}

interface QuerySelectionMessage {
  type: 'QUERY_SELECTION'
}

export type MessageFromUI = ExportFramesAsImagesMessage | QuerySelectionMessage
