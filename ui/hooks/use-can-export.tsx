import { usePluginStore } from '../store/use-plugin-store'
import { useEditorType } from './use-editor-context'

export function useCanExport() {
  const editorType = useEditorType()
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
