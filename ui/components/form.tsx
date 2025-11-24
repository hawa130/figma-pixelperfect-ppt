import type { ComponentProps } from 'react'
import { clsx } from 'clsx'

export function FormLabel({ children, className, ...props }: ComponentProps<'label'>) {
  return (
    <label className={clsx('self-start py-1 text-text-secondary', className)} {...props}>
      {children}
    </label>
  )
}

export function FormField({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={clsx('col-span-2 grid grid-cols-subgrid', className)} {...props}>
      {children}
    </div>
  )
}

export function Form({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={clsx('grid grid-cols-[auto_minmax(0,1fr)] items-center border-t', className)} {...props}>
      {children}
    </div>
  )
}

export function FormSection({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={clsx('col-span-2 grid grid-cols-subgrid gap-2 px-4 py-3 not-last:border-b', className)} {...props}>
      {children}
    </div>
  )
}
