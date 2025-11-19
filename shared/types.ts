export interface ExportImageData {
  bytes: Uint8Array
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

interface FilenameUpdate {
  type: 'filename_update'
  filename: string
}

export type MessageToUI = SelectionUpdate | ExportComplete | ExportError | FilenameUpdate

interface ExportFramesAsImagesMessage {
  type: 'export_frames_as_images'
  mode: 'selected' | 'all'
  settings: Partial<ExportSettings>
}

interface QuerySelectionMessage {
  type: 'query_selection'
}

interface QueryFilenameMessage {
  type: 'query_filename'
}

export type MessageFromUI = ExportFramesAsImagesMessage | QuerySelectionMessage | QueryFilenameMessage
