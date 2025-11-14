import type { MessageFromUI, MessageToUI } from '../../shared/types'

const messageListener = new Map<
  MessageFromUI['type'],
  Set<(message: MessageFromUI, props: OnMessageProperties) => void>
>()

figma.ui.onmessage = (message: MessageFromUI, props) => {
  const listeners = messageListener.get(message.type)
  if (listeners) {
    for (const listener of listeners) {
      listener(message, props)
    }
  }
}

type MessageByType<TType extends MessageFromUI['type']> = Extract<MessageFromUI, { type: TType }>

export function onUIMessage<TType extends MessageFromUI['type']>(
  type: TType,
  handler: (message: MessageByType<TType>, props: OnMessageProperties) => void,
): () => void {
  const listeners = messageListener.get(type) ?? new Set()
  const wrappedHandler = (message: MessageFromUI, props: OnMessageProperties) =>
    handler(message as MessageByType<TType>, props)
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

export function postUIMessage(message: MessageToUI, options?: UIPostMessageOptions) {
  figma.ui.postMessage(message, options)
}
