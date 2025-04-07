export default async function html2canvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  // Create a canvas element
  const canvas = document.createElement("canvas")
  const width = element.offsetWidth
  const height = element.offsetHeight

  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext("2d")

  if (ctx) {
    // Fill with white background
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, width, height)

    // Draw some text to represent the content
    ctx.fillStyle = "black"
    ctx.font = "16px Arial"
    ctx.fillText("Recipe Export Image", 20, 30)
  }

  return canvas
}

