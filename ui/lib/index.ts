import { useEffect } from 'react'

import type { MessageFromUI, MessageToUI } from '../../shared/types'

const messageListener = new Map<MessageToUI['type'], Set<(message: MessageToUI) => void | Promise<void>>>()

onmessage = (event) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const message = event.data.pluginMessage as MessageToUI
  if (!message || typeof message.type !== 'string') {
    return
  }

  const listeners = messageListener.get(message.type)
  if (listeners) {
    for (const listener of listeners) {
      void listener(message)
    }
  }
}

type MessageByType<TType extends MessageToUI['type']> = Extract<MessageToUI, { type: TType }>
export function onMainMessage<TType extends MessageToUI['type']>(
  type: TType,
  handler: (message: MessageByType<TType>) => void | Promise<void>,
): () => void {
  const listeners = messageListener.get(type) ?? new Set()
  const wrappedHandler = (message: MessageToUI) => handler(message as MessageByType<TType>)
  listeners.add(wrappedHandler)
  messageListener.set(type, listeners)

  return () => {
    const currentListeners = messageListener.get(type)
    if (currentListeners) {
      currentListeners.delete(wrappedHandler)
      if (currentListeners.size === 0) {
        messageListener.delete(type)
      }
    }
  }
}

export function useMainMessage<TType extends MessageToUI['type']>(
  type: TType,
  handler: (message: MessageByType<TType>) => void | Promise<void>,
) {
  useEffect(() => {
    const unregister = onMainMessage(type, handler)
    return () => unregister()
  }, [type, handler])
}

export function useMainMessageEvent<TType extends MessageToUI['type']>(
  type: TType,
  handler: (message: MessageByType<TType>) => void,
) {
  useEffect(() => {
    const unregister = onMainMessage(type, handler)
    return () => unregister()
  }, [type]) // eslint-disable-line react-hooks/exhaustive-deps -- Handler is non-reactive, no need to add to dependencies
}

export function postMainMessage(message: MessageFromUI) {
  parent.postMessage({ pluginMessage: message }, '*')
}
