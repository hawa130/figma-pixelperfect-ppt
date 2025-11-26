import { useEditorStore } from '../store/use-editor-store'
import { usePluginStore } from '../store/use-plugin-store'

export function useCanExport() {
  const editorType = useEditorStore((state) => state.editorType)
  const frameCount = usePluginStore((state) => state.frameCount)
  const mode = usePluginStore((state) => state.mode)

  if (editorType === 'figma') {
    return frameCount > 0
  }

  if (editorType === 'slides') {
    return frameCount > 0 || mode === 'all'
  }

  return true
}
