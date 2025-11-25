import type { ComponentProps } from 'react'

export const StylesIcon = (props: ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.5 10a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 1a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Zm7-1a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 1a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5ZM14 15.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm-1 0a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0ZM8.5 17a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 1a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
      fill="var(--color-icon)"
    />
  </svg>
)
