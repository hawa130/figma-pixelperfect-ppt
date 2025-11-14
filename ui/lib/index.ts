import type { MessageFromUI, MessageToUI } from '../../shared/types'

const messageListener = new Map<MessageToUI['type'], ((message: MessageToUI) => void)[]>()

onmessage = (event) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const message = event.data.pluginMessage as MessageToUI
  if (!message || typeof message.type !== 'string') {
    return
  }

  const listeners = messageListener.get(message.type)
  if (listeners) {
    for (const listener of listeners) {
      listener(message)
    }
  }
}

type MessageByType<TType extends MessageToUI['type']> = Extract<MessageToUI, { type: TType }>
export function onMainMessage<TType extends MessageToUI['type']>(
  type: TType,
  handler: (message: MessageByType<TType>) => void,
) {
  const listeners = messageListener.get(type) ?? []
  listeners.push((message) => handler(message as MessageByType<TType>))
  messageListener.set(type, listeners)
}

export function postMainMessage(message: MessageFromUI) {
  parent.postMessage({ pluginMessage: message }, '*')
}
