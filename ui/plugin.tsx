import { Button, Text } from 'figma-kit'
import { useEffect, useState } from 'react'

import { onMainMessage, postMainMessage } from './lib'
import { downloadFile, MIME_TYPE_PPTX } from './lib/download'
import { createPptxFromImages } from './lib/pptx'

export function Plugin() {
  const [frameCount, setFrameCount] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    onMainMessage((message) => {
      switch (message.type) {
        case 'selection_update':
          setFrameCount(message.frameCount)
          setError(null)
          break
        case 'export_complete': {
          createPptxFromImages(message.images)
            .then((bytes) => {
              downloadFile({ filename: `frames-${Date.now()}.pptx`, bytes, mimeType: MIME_TYPE_PPTX })
            })
            .catch((error) => {
              setError(error instanceof Error ? error.message : 'Unknown error')
            })
            .finally(() => {
              setIsExporting(false)
            })
          break
        }
        case 'export_error':
          setIsExporting(false)
          setError(message.message)
          break
      }
    })
    postMainMessage({ type: 'query_selection' })
  }, [])

  function handleExport() {
    postMainMessage({ type: 'export_frames_as_images' })
    setIsExporting(true)
    setError(null)
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-col gap-2">
        <Text>
          Selected pages: <span className="font-semibold">{frameCount}</span>
        </Text>
        {error && <div className="rounded bg-red-50 p-2 text-xs text-red-600">{error}</div>}
      </div>
      <Button variant="primary" onClick={handleExport} disabled={frameCount === 0 || isExporting}>
        {isExporting ? 'Exporting...' : 'Export to PPTX'}
      </Button>
    </div>
  )
}
