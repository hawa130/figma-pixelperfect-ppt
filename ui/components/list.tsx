import type { ComponentProps } from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { clsx } from 'clsx'

export function ListGroup({ children, className, ...props }: ComponentProps<typeof ToggleGroup.Root>) {
  return (
    <ToggleGroup.Root className={className} {...props}>
      {children}
    </ToggleGroup.Root>
  )
}

export function ListItem({ children, className, ...props }: ComponentProps<typeof ToggleGroup.Item>) {
  return (
    <ToggleGroup.Item
      data-slot="list-item"
      className={clsx(
        'flex w-full items-center gap-1.5 py-2 pr-1 pl-4 hover:bg-bg-hover focus-visible:bg-bg-hover focus-visible:outline-none active:bg-bg-pressed data-[state=on]:bg-bg-selected data-[state=on]:text-text-onselected',
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroup.Item>
  )
}
