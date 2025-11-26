import { useEffect } from 'react'

import { postMainMessage, useMainMessageEvent } from '../lib'
import { useEditorStore } from '../store/use-editor-store'

export function EditorStoreLoader() {
  const setEditorType = useEditorStore((state) => state.setEditorType)

  useEffect(() => {
    postMainMessage({ type: 'query_editor_type' })
  }, [])

  useMainMessageEvent('editor_type_result', (message) => {
    setEditorType(message.editorType)
  })

  return null
}
