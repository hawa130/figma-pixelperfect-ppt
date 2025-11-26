export interface PluginSharedState {
  frameCount: number
  mode: 'selected' | 'all'
  previewIndex: number
  previewTotal: number
}

export interface PluginSharedSyncMessage {
  type: 'plugin_shared_sync'
  state: Partial<PluginSharedState>
}

export interface PluginSyncRequest {
  type: 'plugin_sync_request'
}

export interface EditorMetaState {
  editorType: typeof figma.editorType | null
  documentName: string | null
}

export interface EditorMetaResponse {
  type: 'editor_meta_response'
  state: EditorMetaState
}

export interface EditorMetaRequest {
  type: 'editor_meta_request'
}
