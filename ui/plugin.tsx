import { Button, Input, RadioGroup, Select, Text } from 'figma-kit'
import { useCallback, useEffect, useState } from 'react'

import { postMainMessage, useMainMessage, useMainMessageEvent } from './lib'
import { downloadFile, MIME_TYPE_PPTX } from './lib/download'
import { createPptxFromImages } from './lib/pptx'

export function Plugin() {
  const [frameCount, setFrameCount] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [filename, setFilename] = useState('Slides')
  const [scale, setScale] = useState('2')
  const [mode, setMode] = useState<'selected' | 'all'>('all')

  useMainMessageEvent('selection_update', (message) => {
    setFrameCount(message.frameCount)
    setError(null)
  })

  useMainMessage(
    'export_complete',
    useCallback(
      (message) => {
        createPptxFromImages(message.images)
          .then((bytes) => {
            downloadFile({ filename: `${filename}.pptx`, bytes, mimeType: MIME_TYPE_PPTX })
          })
          .catch((error) => {
            setError(error instanceof Error ? error.message : 'Unknown error')
          })
          .finally(() => {
            setIsExporting(false)
          })
      },
      [filename],
    ),
  )

  useMainMessageEvent('export_error', (message) => {
    setIsExporting(false)
    setError(message.message)
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
    setIsExporting(true)
    setError(null)
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
        </RadioGroup.Label>
        <RadioGroup.Label>
          <RadioGroup.Item value="selected" />
          <div>
            <strong>{frameCount}</strong> selected slides
          </div>
        </RadioGroup.Label>
      </RadioGroup.Root>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 py-1">
        <Text className="text-text-secondary!">Name</Text>
        <label className="fp-ValueFieldRoot">
          <Input
            selectOnClick
            className="fp-ValueFieldBase"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />
          <span className="fp-ValueFieldLabel w-auto! pr-1.5">.pptx</span>
        </label>
        <Text className="text-text-secondary!">Scale</Text>
        <Select.Root value={scale} onValueChange={setScale}>
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="1">1x</Select.Item>
            <Select.Item value="2">2x</Select.Item>
            <Select.Item value="3">3x</Select.Item>
            <Select.Item value="4">4x</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
      {error && <div className="rounded bg-red-50 p-2 text-xs text-red-600">{error}</div>}
      <div className="flex flex-1 flex-col justify-end">
        <div className="flex items-center justify-end">
          <Button variant="primary" onClick={handleExport} disabled={!canExport || isExporting}>
            {!canExport ? (
              <span className="text-text-tertiary">Select slides to export</span>
            ) : isExporting ? (
              'Exporting...'
            ) : (
              'Export to PPTX'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
