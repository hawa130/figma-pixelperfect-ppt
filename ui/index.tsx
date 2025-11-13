import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app'

function render(root: Element) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

document.addEventListener('DOMContentLoaded', () => {
  render(document.getElementById('root')!)
})
