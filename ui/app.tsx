import { TooltipProvider } from 'figma-kit'

import { EditorStoreLoader } from './components/editor-store-loader'
import { Plugin } from './plugin'

export function App() {
  return (
    <TooltipProvider delayDuration={100}>
      <EditorStoreLoader />
      <Plugin />
    </TooltipProvider>
  )
}
