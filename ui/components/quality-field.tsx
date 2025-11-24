import { Select } from 'figma-kit'

import { usePluginStore } from '../store/use-plugin-store'
import { FormField, FormLabel } from './form'

export function QualityField() {
  const scale = usePluginStore((state) => state.scale)
  const setScale = usePluginStore((state) => state.setScale)

  return (
    <>
      <FormField>
        <FormLabel>Quality</FormLabel>
        <Select.Root value={String(scale)} onValueChange={(value) => setScale(parseFloat(value))}>
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
    </>
  )
}
