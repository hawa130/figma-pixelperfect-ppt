export function drawCheckerboardBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tileSize: number = 12,
) {
  const lightColor = '#ffffff'
  const darkColor = '#f2f2f2'

  for (let y = 0; y < height; y += tileSize) {
    for (let x = 0; x < width; x += tileSize) {
      const isEvenRow = Math.floor(y / tileSize) % 2 === 0
      const isEvenCol = Math.floor(x / tileSize) % 2 === 0
      const color = (isEvenRow && isEvenCol) || (!isEvenRow && !isEvenCol) ? darkColor : lightColor
      ctx.fillStyle = color
      ctx.fillRect(x, y, tileSize, tileSize)
    }
  }
}
