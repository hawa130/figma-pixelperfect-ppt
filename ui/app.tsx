import { TooltipProvider } from 'figma-kit'

import { EditorContextProvider } from './hooks/use-editor-context'
import { Plugin } from './plugin'

export function App() {
  return (
    <EditorContextProvider>
      <TooltipProvider delayDuration={100}>
        <Plugin />
      </TooltipProvider>
    </EditorContextProvider>
  )
}
