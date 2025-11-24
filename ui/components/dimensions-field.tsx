import { SegmentedControl, ValueField } from 'figma-kit'

import { usePluginStore } from '../store/use-plugin-store'
import { FormField, FormLabel } from './form'

export function DimensionsField() {
  const sizeMode = usePluginStore((state) => state.sizeMode)
  const setSizeMode = usePluginStore((state) => state.setSizeMode)

  return (
    <>
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
        {sizeMode === 'custom' && <CustomDimensionsField />}
      </FormField>
    </>
  )
}

function CustomDimensionsField() {
  const customSize = usePluginStore((state) => state.customSize)
  const setCustomWidth = usePluginStore((state) => state.setCustomWidth)
  const setCustomHeight = usePluginStore((state) => state.setCustomHeight)

  return (
    <div className="flex gap-2 pt-2">
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
