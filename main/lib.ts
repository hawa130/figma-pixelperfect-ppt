import type { MessageFromUI, MessageToUI } from '../shared/types'

export function onUIMessage<T extends MessageFromUI>(handler: (message: T, props: OnMessageProperties) => void) {
  figma.ui.onmessage = (message, props) => {
    handler(message as T, props)
  }
}

export function postUIMessage(message: MessageToUI, options?: UIPostMessageOptions) {
  figma.ui.postMessage(message, options)
}
