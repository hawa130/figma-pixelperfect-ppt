export interface ExportImageData {
  bytes: Uint8Array
  width: number
  height: number
}

export interface ExportThumbnailData {
  bytes: Uint8Array
  width: number
  height: number
  scale: number
}

interface SelectionUpdate {
  type: 'selection_update'
  frameCount: number
}

interface ExportProgress {
  type: 'export_progress'
  current: number
  total: number
}

interface ExportComplete {
  type: 'export_complete'
  images: ExportImageData[]
}

interface ExportCancelled {
  type: 'export_cancelled'
}

interface ExportError {
  type: 'export_error'
  message: string
}

interface FilenameUpdate {
  type: 'filename_update'
  filename: string
}

interface ExportThumbnail {
  type: 'export_thumbnail_complete'
  image?: ExportThumbnailData
}

export type MessageToUI =
  | SelectionUpdate
  | ExportComplete
  | ExportError
  | FilenameUpdate
  | ExportProgress
  | ExportCancelled
  | ExportThumbnail

interface ExportFramesAsImagesMessage {
  type: 'export_frames_as_images'
  mode: 'selected' | 'all'
  settings: Partial<ExportSettings>
}

interface CancelExportMessage {
  type: 'cancel_export'
}

interface QuerySelectionMessage {
  type: 'query_selection'
}

interface QueryFilenameMessage {
  type: 'query_filename'
}

interface UpdateSizeMessage {
  type: 'update_size'
  width: number
  height: number
}

interface ExportThumbnailMessage {
  type: 'export_thumbnail'
}

export type MessageFromUI =
  | ExportFramesAsImagesMessage
  | QuerySelectionMessage
  | QueryFilenameMessage
  | CancelExportMessage
  | UpdateSizeMessage
  | ExportThumbnailMessage
