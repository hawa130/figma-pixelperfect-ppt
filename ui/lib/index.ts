import type { MessageFromUI, MessageToUI } from '../../shared/types'

export function onMainMessage<T extends MessageToUI>(handler: (message: T) => void) {
  onmessage = (event) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const message = event.data.pluginMessage as T
    if (!message) {
      return
    }
    handler(message)
  }
}

export function postMainMessage(message: MessageFromUI) {
  parent.postMessage({ pluginMessage: message }, '*')
}
