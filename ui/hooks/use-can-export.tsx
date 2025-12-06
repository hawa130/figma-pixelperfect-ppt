import { useEditorStore } from '../store/use-editor-store'
import { useSharedStore } from '../store/use-shared-store'

export function useCanExport() {
  const editorType = useEditorStore((state) => state.editorType)
  const frameCount = useSharedStore((state) => state.frameCount)
  const mode = useSharedStore((state) => state.mode)

  if (editorType === 'slides') {
    return frameCount > 0 || mode === 'all'
  }

  return frameCount > 0
}
