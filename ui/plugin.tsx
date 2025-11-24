import { useEffect } from 'react'

import { DimensionsField } from './components/dimensions-field'
import { ExportButton } from './components/export-button'
import { FilenameField } from './components/filename-field'
import { Form, FormSection } from './components/form'
import { MessageDisplay } from './components/message-display'
import { ModeSelector } from './components/mode-selector'
import { QualityField } from './components/quality-field'
import { useContainerSize } from './hooks/use-container-size'
import { postMainMessage, useMainMessageEvent } from './lib'
import { usePluginStore } from './store/use-plugin-store'

export function Plugin() {
  const containerRef = useContainerSize()

  const setFrameCount = usePluginStore((state) => state.setFrameCount)
  const setFilename = usePluginStore((state) => state.setFilename)
  const handleExportComplete = usePluginStore((state) => state.handleExportComplete)
  const handleExportProgress = usePluginStore((state) => state.handleExportProgress)
  const cancelExport = usePluginStore((state) => state.cancelExport)
  const handleExportError = usePluginStore((state) => state.handleExportError)

  useMainMessageEvent('selection_update', (message) => {
    setFrameCount(message.frameCount)
  })

  useMainMessageEvent('export_complete', (message) => {
    void handleExportComplete(message.images)
  })

  useMainMessageEvent('export_progress', (message) => {
    handleExportProgress(message.current, message.total)
  })

  useMainMessageEvent('export_cancelled', () => {
    cancelExport()
  })

  useMainMessageEvent('export_error', (error) => {
    handleExportError(error.message)
  })

  useMainMessageEvent('filename_update', (message) => {
    setFilename(message.filename)
  })

  useEffect(() => {
    postMainMessage({ type: 'query_selection' })
    postMainMessage({ type: 'query_filename' })
  }, [])

  return (
    <div ref={containerRef}>
      <ModeSelector />
      <Form className="border-b">
        <FilenameField />
        <FormSection>
          <QualityField />
          <DimensionsField />
        </FormSection>
      </Form>
      <MessageDisplay />
      <ExportButton />
    </div>
  )
}
