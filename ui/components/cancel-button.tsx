import { Button } from 'figma-kit'
import { useState } from 'react'

import { postMainMessage, useMainMessageEvent } from '../lib'

export function CancelButton() {
  const [isCancelling, setIsCancelling] = useState(false)

  useMainMessageEvent('export_cancelled', () => {
    setIsCancelling(false)
  })

  function handleCancel() {
    postMainMessage({ type: 'cancel_export' })
    setIsCancelling(true)
  }

  return (
    <Button variant="secondary" onClick={handleCancel} disabled={isCancelling}>
      {isCancelling ? 'Cancelling' : 'Cancel'}
    </Button>
  )
}
