import { SegmentedControl } from 'figma-kit'

import { usePluginStore, type ExportFormat } from '../store/use-plugin-store'
import { FormField, FormLabel, FormSection } from './form'

export function FormatField() {
  const exportFormat = usePluginStore((state) => state.exportFormat)
  const setExportFormat = usePluginStore((state) => state.setExportFormat)

  return (
    <FormSection>
      <FormField>
        <FormLabel>Format</FormLabel>
        <SegmentedControl.Root
          fullWidth
          value={exportFormat}
          onValueChange={(value) => setExportFormat(value as ExportFormat)}
        >
          <SegmentedControl.Item value="pptx" className="w-1/2!">
            PPTX
          </SegmentedControl.Item>
          <SegmentedControl.Item value="pdf" className="w-1/2!">
            PDF
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      </FormField>
    </FormSection>
  )
}
