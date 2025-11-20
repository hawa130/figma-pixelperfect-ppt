export interface CancelSignal {
  aborted: boolean
}

export interface TaskOptions {
  signal?: CancelSignal
}
