import { create } from 'zustand'

interface EditorStore {
  editorType: typeof figma.editorType | null

  setEditorType: (editorType: typeof figma.editorType | null) => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  editorType: null,
  setEditorType: (editorType) => set({ editorType }),
}))
