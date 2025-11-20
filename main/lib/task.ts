import type { CancelSignal } from './types'

interface CancelController {
  readonly signal: CancelSignal
  cancel: () => void
}

export function createCancelSignal(): CancelController {
  const cancelSignal: CancelSignal = { aborted: false }
  return {
    get signal() {
      return cancelSignal
    },
    cancel() {
      cancelSignal.aborted = true
    },
  }
}

export function createTask<Args extends unknown[], T>(fn: (signal: CancelSignal, ...args: Args) => Promise<T>) {
  let cancelController: CancelController | null = null

  return {
    async execute(...args: Args) {
      if (cancelController) cancelController.cancel()
      cancelController = createCancelSignal()

      return await fn(cancelController.signal, ...args).finally(() => {
        cancelController = null
      })
    },

    cancel() {
      if (!cancelController) return
      cancelController.cancel()
      cancelController = null
    },
  }
}
