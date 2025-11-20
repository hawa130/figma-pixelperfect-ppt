import { Button, Input, RadioGroup, Select, Tooltip } from 'figma-kit'
import { useCallback, useEffect, useState } from 'react'

import { HelpIcon } from './icons/help'
import { postMainMessage, useMainMessage, useMainMessageEvent } from './lib'
import { downloadFile } from './lib/download'
import { createPptxFromImages } from './lib/pptx'

export function Plugin() {
  const [frameCount, setFrameCount] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [filename, setFilename] = useState('Slides')
  const [scale, setScale] = useState('2')
  const [mode, setMode] = useState<'selected' | 'all'>('all')
  const [message, setMessage] = useState<string | Error | null>(null)

  useMainMessageEvent('selection_update', (message) => {
    setFrameCount(message.frameCount)
  })

  useMainMessage(
    'export_complete',
    useCallback(
      async (message) => {
        setMessage('Creating PPTX file...')
        try {
          const blob = await createPptxFromImages(message.images)
          downloadFile({ filename: `${filename}.pptx`, blob })
        } catch (error) {
          setMessage(error instanceof Error ? error : new Error('An unexpected error occurred'))
        } finally {
          setMessage(null)
          setIsExporting(false)
        }
      },
      [filename],
    ),
  )

  useMainMessageEvent('export_progress', (message) => {
    setIsExporting(true)
    setMessage(`Exporting slide ${message.current} of ${message.total}`)
  })

  useMainMessageEvent('export_cancelled', () => {
    setIsExporting(false)
    setMessage(null)
  })

  useMainMessageEvent('export_error', (error) => {
    setIsExporting(false)
    setMessage(new Error(error.message))
  })

  useMainMessageEvent('filename_update', (message) => {
    setFilename(message.filename)
  })

  useEffect(() => {
    postMainMessage({ type: 'query_selection' })
    postMainMessage({ type: 'query_filename' })
  }, [])

  function handleExport() {
    postMainMessage({
      type: 'export_frames_as_images',
      mode,
      settings: { constraint: { value: parseFloat(scale), type: 'SCALE' } },
    })
    setMessage(null)
    setIsExporting(true)
  }

  const canExport = frameCount > 0 || mode === 'all'

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <RadioGroup.Root
        value={mode}
        onValueChange={(value) => setMode(value as 'selected' | 'all')}
        orientation="vertical"
      >
        <RadioGroup.Label>
          <RadioGroup.Item value="all" />
          All slides
          <Tooltip content="Skipped slides are excluded">
            <button>
              <HelpIcon className="size-4" />
            </button>
          </Tooltip>
        </RadioGroup.Label>
        <RadioGroup.Label>
          <RadioGroup.Item value="selected" />
          <div>
            <strong>{frameCount}</strong> selected {frameCount === 1 ? 'slide' : 'slides'}
          </div>
        </RadioGroup.Label>
      </RadioGroup.Root>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 py-1">
        <label className="text-text-secondary">File name</label>
        <label className="fp-ValueFieldRoot">
          <Input
            selectOnClick
            className="fp-ValueFieldBase"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />
          <span className="fp-ValueFieldLabel w-auto! pr-1.5">.pptx</span>
        </label>
        <label className="text-text-secondary">Quality</label>
        <Select.Root value={scale} onValueChange={setScale}>
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="1">
              1x<span className="ml-1 opacity-60">Standard</span>
            </Select.Item>
            <Select.Item value="1.5">
              1.5x<span className="ml-1 opacity-60">Balanced</span>
            </Select.Item>
            <Select.Item value="2">
              2x<span className="ml-1 opacity-60">High</span>
            </Select.Item>
            <Select.Item value="3">
              3x<span className="ml-1 opacity-60">Ultra High</span>
            </Select.Item>
            <Select.Item value="4">
              4x<span className="ml-1 opacity-60">Maximum</span>
            </Select.Item>
          </Select.Content>
        </Select.Root>
      </div>

      {!canExport && <div className="text-text-danger">Please select slides to export</div>}
      {message instanceof Error && <div className="text-text-danger">{message.message}</div>}

      <div className="flex flex-1 flex-col justify-end gap-2">
        <div className="flex items-end">
          <div className="min-h-5 flex-1 font-normal">{typeof message === 'string' && message}</div>
          {!isExporting ? (
            <Button variant="primary" onClick={handleExport} disabled={!canExport}>
              {isExporting ? 'Exporting' : 'Export to PPTX'}
            </Button>
          ) : (
            <CancelButton />
          )}
        </div>
      </div>
    </div>
  )
}

function CancelButton() {
  const [isCancelling, setIsCancelling] = useState(false)

  useMainMessageEvent('export_cancelled', () => {
    setIsCancelling(false)
  })

  function handleCancel() {
    postMainMessage({ type: 'cancel_export' })
    setIsCancelling(true)
  }

  return (
    <Button variant="secondary" onClick={handleCancel} disabled={isCancelling}>
      {isCancelling ? 'Cancelling' : 'Cancel'}
    </Button>
  )
}
