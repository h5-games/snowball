interface computedPixe {
  (pixe: number): number
}

export function computedPixe(pixe) {
  return pixe * (window.devicePixelRatio || 1)
}
