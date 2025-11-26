import { RadioGroup, Tooltip } from 'figma-kit'

import { HelpIcon } from '../icons/help'
import { useEditorStore } from '../store/use-editor-store'
import { useSharedStore } from '../store/use-shared-store'

export function ModeSelector() {
  const editorType = useEditorStore((state) => state.editorType)
  const frameCount = useSharedStore((state) => state.frameCount)
  const mode = useSharedStore((state) => state.mode)
  const setMode = useSharedStore((state) => state.setMode)

  return (
    editorType === 'slides' && (
      <RadioGroup.Root
        className="border-b px-4 py-3"
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
    )
  )
}
