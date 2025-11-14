import { TooltipProvider } from 'figma-kit'

import { Plugin } from './plugin'

export function App() {
  return (
    <TooltipProvider delayDuration={100}>
      <Plugin />
    </TooltipProvider>
  )
}
