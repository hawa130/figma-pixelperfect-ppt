import { Button, Input, RadioGroup, SegmentedControl, Select, Tooltip, ValueField } from 'figma-kit'
import { useCallback, useEffect, useState } from 'react'

import { Form, FormField, FormLabel, FormSection } from './components/form'
import { useContainerSize } from './hooks/use-container-size'
import { HelpIcon } from './icons/help'
import { postMainMessage, useMainMessage, useMainMessageEvent } from './lib'
import { downloadFile } from './lib/download'
import { createPptxFromImages, type PptxOptions } from './lib/pptx'

export function Plugin() {
  const [frameCount, setFrameCount] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [filename, setFilename] = useState('Slides')
  const [scale, setScale] = useState('2')
  const [mode, setMode] = useState<'selected' | 'all'>('all')
  const [message, setMessage] = useState<string | Error | null>(null)

  const [sizeMode, setSizeMode] = useState<'original' | 'custom'>('original')
  const [customWidth, setCustomWidth] = useState(1920)
  const [customHeight, setCustomHeight] = useState(1080)

  const containerRef = useContainerSize()

  useMainMessageEvent('selection_update', (message) => {
    setFrameCount(message.frameCount)
  })

  useMainMessage(
    'export_complete',
    useCallback(
      async (message) => {
        setMessage('Creating PPTX file...')
        try {
          const settings: PptxOptions | undefined =
            sizeMode === 'custom'
              ? {
                  width: customWidth,
                  height: customHeight,
                  scale: parseFloat(scale),
                }
              : undefined
          const blob = await createPptxFromImages(message.images, settings)
          downloadFile({ filename: `${filename}.pptx`, blob })
        } catch (error) {
          setMessage(error instanceof Error ? error : new Error('An unexpected error occurred'))
        } finally {
          setMessage(null)
          setIsExporting(false)
        }
      },
      [filename, sizeMode, customWidth, customHeight, scale],
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
    <div ref={containerRef}>
      <RadioGroup.Root
        className="px-4 py-3"
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

      <Form className="border-b">
        <FormSection>
          <FormField>
            <FormLabel>File name</FormLabel>
            <label className="fp-ValueFieldRoot">
              <Input
                selectOnClick
                className="fp-ValueFieldBase"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
              />
              <span className="fp-ValueFieldLabel w-auto! pr-1.5">.pptx</span>
            </label>
          </FormField>
        </FormSection>

        <FormSection>
          <FormField>
            <FormLabel>Quality</FormLabel>
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
          </FormField>
          <FormField>
            <FormLabel className="row-span-2">Dimensions</FormLabel>
            <SegmentedControl.Root
              fullWidth
              value={sizeMode}
              onValueChange={(value) => setSizeMode(value as 'original' | 'custom')}
            >
              <SegmentedControl.Item value="original" className="w-1/2!">
                Original
              </SegmentedControl.Item>
              <SegmentedControl.Item value="custom" className="w-1/2!">
                Custom
              </SegmentedControl.Item>
            </SegmentedControl.Root>
            {sizeMode === 'custom' && (
              <div className="flex gap-2 pt-2">
                <ValueField.Root>
                  <ValueField.Label>W</ValueField.Label>
                  <ValueField.Numeric value={customWidth} onChange={setCustomWidth} />
                </ValueField.Root>
                <ValueField.Root>
                  <ValueField.Label>H</ValueField.Label>
                  <ValueField.Numeric value={customHeight} onChange={setCustomHeight} />
                </ValueField.Root>
              </div>
            )}
          </FormField>
        </FormSection>
      </Form>

      <div className="not-empty:-mb-1 not-empty:px-4 not-empty:pt-3">
        {!canExport && <div className="text-text-danger">Please select slides to export</div>}
        {message instanceof Error && <div className="text-text-danger">{message.message}</div>}
      </div>
      <div className="flex items-end p-4">
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
