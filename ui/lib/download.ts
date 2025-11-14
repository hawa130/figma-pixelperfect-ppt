export const MIME_TYPE_PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'

export function downloadFile({
  filename,
  bytes,
  mimeType,
}: {
  filename: string
  bytes: Uint8Array<ArrayBuffer>
  mimeType?: string
}) {
  const blob = new Blob([bytes], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
