import type { EditorMetaRequest, EditorMetaResponse, PluginSharedSyncMessage, PluginSyncRequest } from './state'

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
  dimensions?: Dimensions
}

export interface Dimensions {
  width: number
  height: number
  scale: number
}

export type MessageToUI =
  | ExportComplete
  | ExportError
  | FilenameUpdate
  | ExportProgress
  | ExportCancelled
  | ExportThumbnail
  | PluginSharedSyncMessage
  | EditorMetaResponse

interface ExportFramesAsImagesMessage {
  type: 'export_frames_as_images'
  settings: Partial<ExportSettings>
}

interface CancelExportMessage {
  type: 'cancel_export'
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
  | QueryFilenameMessage
  | CancelExportMessage
  | UpdateSizeMessage
  | ExportThumbnailMessage
  | PluginSharedSyncMessage
  | PluginSyncRequest
  | EditorMetaRequest
