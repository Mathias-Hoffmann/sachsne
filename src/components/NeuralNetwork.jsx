import React from 'react'
import { Box, Line } from '@react-three/drei'

export function Layer({ data, position, spacing, size, highlightIndex = null, isOutput = false }) {
  const rows = data.length
  const cols = data[0].length

  return (
    <>
      {data.map((row, rowIndex) =>
        row.map((val, colIndex) => {
          const x = colIndex * spacing - (cols - 1) * spacing / 2
          const y = position[1]
          const z = rowIndex * -spacing + (rows - 1) * spacing / 2

          let color

          if (isOutput) {
            color = (highlightIndex !== null && rowIndex === 0 && colIndex === highlightIndex)
              ? `rgb(0, 0, 0)`
              : `rgb(200, 200, 200)`
          } else {
            color = val > 0 ? `rgb(0, 0, 0)` : `rgb(200, 200, 200)`
          }

          return (
            <Box key={`${rowIndex}-${colIndex}`} args={[size, size, size]} position={[x, y, z]}>
              <meshStandardMaterial color={color} />
            </Box>
          )
        })
      )}
    </>
  )
}

export function Connections({ from, to, fromY, toY, spacing, weights }) {
  const fromPositions = getPositions(from, fromY, spacing, true)
  const toPositions = getPositions(to, toY, spacing, false)

  const lines = []

  fromPositions.forEach(([fx, fy, fz, active], i) => {
    if (active === 0) return
    toPositions.forEach(([tx, ty, tz], j) => {
      const weight = weights[i][j]
      const brightness = Math.floor(weight * 255)
      lines.push(
        <Line
          key={`${i}-${j}`}
          points={[[fx, fy, fz], [tx, ty, tz]]}
          color={`rgb(${brightness}, ${brightness}, ${brightness})`}
          lineWidth={0.5}
          transparent
          opacity={0.6}
        />
      )
    })
  })

  return <>{lines}</>
}

function getPositions(data, y, spacing, includeVal = false) {
  const result = []
  const rows = data.length
  const cols = data[0].length

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = j * spacing - (cols - 1) * spacing / 2
      const z = i * -spacing + (rows - 1) * spacing / 2
      const val = data[i][j]
      result.push(includeVal ? [x, y, z, val] : [x, y, z])
    }
  }

  return result
}
