import { Input } from 'figma-kit'

import { usePluginStore } from '../store/use-plugin-store'
import { FormField, FormLabel, FormSection } from './form'

export function FilenameField() {
  const filename = usePluginStore((state) => state.filename)
  const setFilename = usePluginStore((state) => state.setFilename)

  return (
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
  )
}
