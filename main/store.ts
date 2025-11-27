import { cloneDeep, FastCloningStrategy, isEqual } from 'radashi'

import type { PluginSharedState } from '../shared/state'
import { onUIMessage, postUIMessage } from './lib'
import { getSelectedFrames } from './lib/get-frames'
import { getSelectedSlides } from './lib/get-slides'

const pluginState: PluginSharedState = {
  frameCount: (figma.editorType === 'slides' ? getSelectedSlides() : getSelectedFrames()).length,
  mode: figma.editorType === 'slides' ? 'all' : 'selected',
  previewIndex: 0,
  previewTotal: 0,
}

// Set the plugin state, and push the state to the UI
export function setPluginState(dispatch: (state: PluginSharedState) => void) {
  dispatch(pluginState)
  pushPluginState()
}

export function getPluginState(): Readonly<PluginSharedState> {
  return pluginState
}

export function pushPluginState() {
  postUIMessage({ type: 'plugin_shared_sync', state: getPluginState() })
}

export function registerPluginStateSync() {
  onUIMessage('plugin_shared_sync', (message) => {
    const prevState = cloneDeep(pluginState, FastCloningStrategy)
    Object.assign(pluginState, message.state)
    notifySubscribers(prevState)
  })
}

type PluginStateListener<T = any> = (current: T, prev: T) => void
type PluginStateSelector<T = any> = (state: PluginSharedState) => T
const subscribers = new Set<PluginStateListener>()

function notifySubscribers(prev: PluginSharedState) {
  for (const subscriber of subscribers) {
    subscriber(pluginState, prev)
  }
}

// Subscribe to state changes from UI sync
export function watch<T = any>(selector: PluginStateSelector<T>, listener: PluginStateListener<T>) {
  const _listener = (current: PluginSharedState, prev: PluginSharedState) => {
    const selected = selector(current)
    const prevSelected = selector(prev)
    if (isEqual(selected, prevSelected)) {
      return
    }
    listener(selected, prevSelected)
  }
  subscribers.add(_listener)
  return () => subscribers.delete(_listener)
}
