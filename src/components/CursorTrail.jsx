import React, { useEffect, useRef } from 'react'

const TRAIL_COUNT = 8

export default function CursorTrail() {
  const dotsRef = useRef([])

  useEffect(() => {
    const dots = dotsRef.current
    if (!dots.length) return undefined

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const positions = Array.from({ length: TRAIL_COUNT }, () => ({
      x: target.x,
      y: target.y,
    }))

    const handlePointerMove = (event) => {
      target.x = event.clientX
      target.y = event.clientY
    }

    let frameId = 0

    const animate = () => {
      positions[0].x += (target.x - positions[0].x) * 0.32
      positions[0].y += (target.y - positions[0].y) * 0.32

      for (let index = 1; index < positions.length; index += 1) {
        const previous = positions[index - 1]
        positions[index].x += (previous.x - positions[index].x) * 0.28
        positions[index].y += (previous.y - positions[index].y) * 0.28
      }

      dots.forEach((dot, index) => {
        if (!dot) return

        const scale = 1 - index * 0.09
        dot.style.transform = `translate3d(${positions[index].x}px, ${positions[index].y}px, 0) translate(-50%, -50%) scale(${Math.max(scale, 0.28)})`
        dot.style.opacity = `${1 - index * 0.1}`
      })

      frameId = window.requestAnimationFrame(animate)
    }

    window.addEventListener('pointermove', handlePointerMove)
    frameId = window.requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <div className="cursor-trail" aria-hidden="true">
      {Array.from({ length: TRAIL_COUNT }).map((_, index) => (
        <span
          key={index}
          ref={(element) => {
            dotsRef.current[index] = element
          }}
          className="cursor-trail__dot"
        />
      ))}
    </div>
  )
}
