import { usePluginStore } from '../store/use-plugin-store'

export function MessageDisplay() {
  const message = usePluginStore((state) => state.message)
  const frameCount = usePluginStore((state) => state.frameCount)
  const mode = usePluginStore((state) => state.mode)

  const canExport = frameCount > 0 || mode === 'all'

  return (
    <div className="not-empty:-mb-1 not-empty:px-4 not-empty:pt-3">
      {!canExport && <div className="text-text-danger">Please select slides to export</div>}
      {message instanceof Error && <div className="text-text-danger">{message.message}</div>}
    </div>
  )
}
