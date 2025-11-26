import { useCanExport } from '../hooks/use-can-export'
import { useEditorStore } from '../store/use-editor-store'
import { usePluginStore } from '../store/use-plugin-store'

export function MessageDisplay() {
  const editorType = useEditorStore((state) => state.editorType)
  const message = usePluginStore((state) => state.message)
  const canExport = useCanExport()

  return (
    <div className="not-empty:px-4 not-empty:pt-3">
      {!canExport && (
        <div className="text-text-danger">Please select {editorType === 'slides' ? 'slides' : 'frames'} to export</div>
      )}
      {message instanceof Error && <div className="text-text-danger">{message.message}</div>}
    </div>
  )
}
