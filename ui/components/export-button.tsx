import { Button } from 'figma-kit'

import { postMainMessage } from '../lib'
import { usePluginStore } from '../store/use-plugin-store'
import { CancelButton } from './cancel-button'

export function ExportButton() {
  const isExporting = usePluginStore((state) => state.isExporting)
  const message = usePluginStore((state) => state.message)
  const mode = usePluginStore((state) => state.mode)
  const scale = usePluginStore((state) => state.scale)
  const frameCount = usePluginStore((state) => state.frameCount)
  const startExport = usePluginStore((state) => state.startExport)

  const canExport = frameCount > 0 || mode === 'all'

  function handleExport() {
    postMainMessage({
      type: 'export_frames_as_images',
      mode,
      settings: { constraint: { value: scale, type: 'SCALE' } },
    })
    startExport()
  }

  return (
    <div className="flex items-end py-2.5 pr-2.5 pl-4">
      <div className="min-h-5 flex-1 font-normal">{typeof message === 'string' && message}</div>
      {!isExporting ? (
        <Button variant="primary" onClick={handleExport} disabled={!canExport}>
          Export to PPTX
        </Button>
      ) : (
        <CancelButton />
      )}
    </div>
  )
}
