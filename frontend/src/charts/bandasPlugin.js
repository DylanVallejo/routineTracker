export function bandasPlugin(zonas) {
  return {
    id: 'bandasEntrenamiento',
    beforeDraw(chart) {
      const { ctx, chartArea, scales } = chart
      if (!chartArea) return
      const y = scales.y
      zonas.forEach(({ min, max, color }) => {
        const yTop = y.getPixelForValue(max)
        const yBottom = y.getPixelForValue(min)
        ctx.save()
        ctx.fillStyle = color
        ctx.fillRect(chartArea.left, yTop, chartArea.right - chartArea.left, yBottom - yTop)
        ctx.restore()
      })
    },
  }
}
