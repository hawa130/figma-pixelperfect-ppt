import { create } from 'zustand'

import type { PluginSharedState } from '../../shared/state'
import { onMainMessage, postMainMessage } from '../lib'

interface PluginSharedAction {
  setMode: (mode: 'selected' | 'all') => void
  setPreviewIndex: (index: number) => void
}

type PluginSharedStore = PluginSharedAction & PluginSharedState

export const useSharedStore = create<PluginSharedStore>((set) => ({
  frameCount: 0,
  mode: 'all',
  previewIndex: 0,
  previewTotal: 0,
  setMode: (mode) => {
    pushPluginState({ mode })
    set({ mode })
  },
  setPreviewIndex: (index) => {
    pushPluginState({ previewIndex: index })
    set({ previewIndex: index })
  },
}))

function pushPluginState(state: Partial<PluginSharedState>) {
  postMainMessage({ type: 'plugin_shared_sync', state })
}

function registerPluginStateSync() {
  return onMainMessage('plugin_shared_sync', (message) => {
    useSharedStore.setState(message.state)
  })
}

function requestPluginStateSync() {
  postMainMessage({ type: 'plugin_sync_request' })
}

registerPluginStateSync()
requestPluginStateSync()
