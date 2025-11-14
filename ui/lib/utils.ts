import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  const chunkSize = 8192
  let base64 = ''
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.slice(i, i + chunkSize)
    base64 += String.fromCharCode(...chunk)
  }
  return btoa(base64)
}
