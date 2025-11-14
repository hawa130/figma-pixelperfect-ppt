import type { MessageFromUI, MessageToUI } from '../shared/types'

const messageListener = new Map<
  MessageFromUI['type'],
  ((message: MessageFromUI, props: OnMessageProperties) => void)[]
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
) {
  const listeners = messageListener.get(type) ?? []
  listeners.push((message, props) => handler(message as MessageByType<TType>, props))
  messageListener.set(type, listeners)
}

export function postUIMessage(message: MessageToUI, options?: UIPostMessageOptions) {
  figma.ui.postMessage(message, options)
}
