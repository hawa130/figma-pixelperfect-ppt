import { useMemo, useState } from 'react'
import { IconButton, Popover, SegmentedControl, Select, ValueField } from 'figma-kit'

import { StylesIcon } from '../icons/styles-icon'
import type { ResizeMode } from '../lib/image'
import { usePluginStore } from '../store/use-plugin-store'
import { FormField, FormLabel } from './form'
import { ListGroup, ListItem } from './list'

export function DimensionsField() {
  const sizeMode = usePluginStore((state) => state.sizeMode)
  const setSizeMode = usePluginStore((state) => state.setSizeMode)

  return (
    <>
      <FormField>
        <FormLabel>Dimensions</FormLabel>
        <div className="flex flex-col gap-2">
          <SegmentedControl.Root
            fullWidth
            value={sizeMode}
            onValueChange={(value) => setSizeMode(value as 'original' | 'custom')}
          >
            <SegmentedControl.Item value="original" className="w-1/2!">
              Original
            </SegmentedControl.Item>
            <SegmentedControl.Item value="custom" className="w-1/2!">
              Custom
            </SegmentedControl.Item>
          </SegmentedControl.Root>
          {sizeMode === 'custom' && <CustomDimensionsField />}
          {sizeMode === 'custom' && <ResizeModeSelector />}
        </div>
      </FormField>
    </>
  )
}

function CustomDimensionsField() {
  const customSize = usePluginStore((state) => state.customSize)
  const setCustomWidth = usePluginStore((state) => state.setCustomWidth)
  const setCustomHeight = usePluginStore((state) => state.setCustomHeight)

  return (
    <div className="flex gap-2">
      <PresetsSelector />
      <ValueField.Root>
        <ValueField.Label>W</ValueField.Label>
        <ValueField.Numeric value={customSize.width} onChange={setCustomWidth} />
      </ValueField.Root>
      <ValueField.Root>
        <ValueField.Label>H</ValueField.Label>
        <ValueField.Numeric value={customSize.height} onChange={setCustomHeight} />
      </ValueField.Root>
    </div>
  )
}

function PresetsSelector() {
  const [open, setOpen] = useState(false)

  const width = usePluginStore((state) => state.customSize.width)
  const height = usePluginStore((state) => state.customSize.height)
  const setCustomSize = usePluginStore((state) => state.setCustomSize)

  const presets = useMemo(
    () => [
      {
        width: 1440,
        height: 1080,
        aspectRatio: '4:3',
      },
      {
        width: 1728,
        height: 1080,
        aspectRatio: '16:10',
      },
      {
        width: 1920,
        height: 1080,
        aspectRatio: '16:9',
      },
      {
        width: 1920,
        height: 960,
        aspectRatio: '18:9',
      },
      {
        width: 1920,
        height: 800,
        aspectRatio: '21:9',
      },
    ],
    [],
  )

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <IconButton className="absolute -translate-x-8" aria-label="Presets">
          <StylesIcon />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content
        align="start"
        className="w-48 overflow-auto"
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          const target = e.target as HTMLDivElement
          const button: HTMLButtonElement | null = target.querySelector('button[data-slot="list-item"]')
          if (button) button.focus()
        }}
      >
        <Popover.Header>
          <Popover.Title>Presets</Popover.Title>
          <Popover.Controls>
            <Popover.Close />
          </Popover.Controls>
        </Popover.Header>
        <ListGroup
          className="pb-2"
          type="single"
          value={`${width}x${height}`}
          onValueChange={(value) => {
            setOpen(false)
            if (!value.includes('x')) return
            const [width, height] = value.split('x').map((value) => parseInt(value))
            setCustomSize({ width, height })
          }}
        >
          {presets.map((item) => (
            <ListItem key={`${item.width}x${item.height}`} value={`${item.width}x${item.height}`}>
              {item.width} &times; {item.height}
              <span className="opacity-60">{item.aspectRatio}</span>
            </ListItem>
          ))}
        </ListGroup>
      </Popover.Content>
    </Popover.Root>
  )
}

function ResizeModeSelector() {
  const resizeMode = usePluginStore((state) => state.resizeMode)
  const setResizeMode = usePluginStore((state) => state.setResizeMode)

  return (
    <Select.Root value={resizeMode} onValueChange={(value) => setResizeMode(value as ResizeMode)}>
      <Select.Trigger />
      <Select.Content>
        <Select.Item value="fill">Fill</Select.Item>
        <Select.Item value="fit">Fit</Select.Item>
        <Select.Item value="stretch">Stretch</Select.Item>
        <Select.Item value="original">Original</Select.Item>
      </Select.Content>
    </Select.Root>
  )
}
