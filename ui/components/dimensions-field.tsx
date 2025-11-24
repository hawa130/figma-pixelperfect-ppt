import { SegmentedControl, Select, ValueField } from 'figma-kit'

import type { ResizeMode } from '../lib/image'
import { usePluginStore } from '../store/use-plugin-store'
import { FormField, FormLabel } from './form'

export function DimensionsField() {
  const sizeMode = usePluginStore((state) => state.sizeMode)
  const setSizeMode = usePluginStore((state) => state.setSizeMode)

  return (
    <>
      <FormField>
        <FormLabel>Dimensions</FormLabel>
        <div className="flex flex-col gap-2">
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
          {sizeMode === 'custom' && <CustomDimensionsField />}
          {sizeMode === 'custom' && <ResizeModeSelector />}
        </div>
      </FormField>
    </>
  )
}

function CustomDimensionsField() {
  const customSize = usePluginStore((state) => state.customSize)
  const setCustomWidth = usePluginStore((state) => state.setCustomWidth)
  const setCustomHeight = usePluginStore((state) => state.setCustomHeight)

  return (
    <div className="flex gap-2">
      <ValueField.Root>
        <ValueField.Label>W</ValueField.Label>
        <ValueField.Numeric value={customSize.width} onChange={setCustomWidth} />
      </ValueField.Root>
      <ValueField.Root>
        <ValueField.Label>H</ValueField.Label>
        <ValueField.Numeric value={customSize.height} onChange={setCustomHeight} />
      </ValueField.Root>
    </div>
  )
}

function ResizeModeSelector() {
  const resizeMode = usePluginStore((state) => state.resizeMode)
  const setResizeMode = usePluginStore((state) => state.setResizeMode)

  return (
    <Select.Root value={resizeMode} onValueChange={(value) => setResizeMode(value as ResizeMode)}>
      <Select.Trigger />
      <Select.Content>
        <Select.Item value="fit">Fit</Select.Item>
        <Select.Item value="fill">Fill</Select.Item>
        <Select.Item value="stretch">Stretch</Select.Item>
        <Select.Item value="original">Original</Select.Item>
      </Select.Content>
    </Select.Root>
  )
}
