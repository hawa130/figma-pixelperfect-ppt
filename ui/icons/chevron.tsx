import type { ComponentProps } from 'react'

export function ChevronLeftIcon(props: ComponentProps<'svg'>) {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="var(--color-icon)"
        fillRule="evenodd"
        d="M13.854 7.146a.5.5 0 0 1 0 .708L9.707 12l4.147 4.146a.5.5 0 0 1-.708.708l-4.5-4.5a.5.5 0 0 1 0-.708l4.5-4.5a.5.5 0 0 1 .708 0"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function ChevronRightIcon(props: ComponentProps<'svg'>) {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="var(--color-icon)"
        fillRule="evenodd"
        d="M10.146 16.854a.5.5 0 0 1 0-.708L14.293 12l-4.147-4.146a.5.5 0 0 1 .708-.708l4.5 4.5a.5.5 0 0 1 0 .708l-4.5 4.5a.5.5 0 0 1-.708 0"
        clipRule="evenodd"
      />
    </svg>
  )
}
