import { useEffect, useRef } from 'react'

import { postMainMessage } from '../lib'

export function useContainerSize() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        postMainMessage({ type: 'update_size', width, height })
      }
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return ref
}
