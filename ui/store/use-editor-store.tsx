import { create } from 'zustand'

import type { EditorMetaState } from '../../shared/state'
import { onMainMessage, postMainMessage } from '../lib'

export const useEditorStore = create<EditorMetaState>(() => ({
  editorType: null,
  documentName: null,
}))

function registerEditorMetaResponse() {
  return onMainMessage('editor_meta_response', (message) => {
    useEditorStore.setState(message.state)
  })
}

function requestEditorMeta() {
  postMainMessage({ type: 'editor_meta_request' })
}

registerEditorMetaResponse()
requestEditorMeta()
