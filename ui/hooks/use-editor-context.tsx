import { createContext, useContext, useEffect, useState } from 'react'

import { postMainMessage, useMainMessageEvent } from '../lib'

type EditorType = typeof figma.editorType

const EditorContext = createContext<{
  editorType: EditorType | null
} | null>(null)

export function EditorContextProvider({ children }: { children: React.ReactNode }) {
  const [editorType, setEditorType] = useState<EditorType | null>(null)

  useEffect(() => {
    postMainMessage({ type: 'query_editor_type' })
  }, [])

  useMainMessageEvent('editor_type_result', (message) => {
    setEditorType(message.editorType)
  })

  return <EditorContext.Provider value={{ editorType }}>{children}</EditorContext.Provider>
}

export function useEditorType(): EditorType | null {
  const context = useContext(EditorContext)
  return context?.editorType ?? null
}
