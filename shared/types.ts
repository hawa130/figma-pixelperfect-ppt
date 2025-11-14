export interface ExportImageData {
  bytes: Uint8Array<ArrayBuffer>
  width: number
  height: number
}

interface SelectionUpdate {
  type: 'selection_update'
  frameCount: number
}

interface ExportComplete {
  type: 'export_complete'
  images: ExportImageData[]
}

interface ExportError {
  type: 'export_error'
  message: string
}

export type MessageToUI = SelectionUpdate | ExportComplete | ExportError

interface ExportFramesAsImagesMessage {
  type: 'export_frames_as_images'
}

interface QuerySelectionMessage {
  type: 'query_selection'
}

export type MessageFromUI = ExportFramesAsImagesMessage | QuerySelectionMessage
