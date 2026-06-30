import React, { useRef, useEffect, useState } from 'react'
import usePageMusic from '../hooks/usePageMusic';

const PHRASE = 'mathias.hoffmann@imt-atlantique.net'.split('')
const CANVAS_WIDTH = 500 
const CANVAS_HEIGHT = 180
const GROUND_Y = 140

export default function Contact() {
  const canvasRef = useRef(null)
  const [shouldRestart, setShouldRestart] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)

  const musicRef = usePageMusic('contact.mp3')

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const scale = window.devicePixelRatio || 1

    canvas.width = CANVAS_WIDTH * scale
    canvas.height = CANVAS_HEIGHT * scale

    canvas.style.width = '100%'
    canvas.style.maxWidth = `${CANVAS_WIDTH}px`
    canvas.style.height = 'auto'
    canvas.style.aspectRatio = `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`
    canvas.style.border = '4px solid #000'
    canvas.style.borderRadius = '12px'
    canvas.style.boxShadow = '8px 8px 0 #000'
    canvas.style.imageRendering = 'pixelated'

    ctx.scale(scale, scale)

    let brain = { x: 50, y: GROUND_Y, width: 20, height: 20, vy: 0, jumping: false }
    let obstacles = []
    let score = 0
    let frame = 0
    let gameOver = false
    let currentLetterIndex = 0
    let animationId

    function spawnObstacle() {
      const letter = PHRASE[currentLetterIndex % PHRASE.length]
      obstacles.push({
        x: CANVAS_WIDTH,
        y: GROUND_Y,
        width: 20,
        height: 20,
        letter,
      })
      currentLetterIndex++
    }

    function drawBrain() {
      ctx.font = '28px serif'
      ctx.fillText('🧠', brain.x, brain.y)
    }

    function drawObstacles() {
      ctx.fillStyle = 'black'
      ctx.font = '14px "Press Start 2P", monospace'
      obstacles.forEach(o => {
        ctx.fillText(o.letter, o.x, o.y)
      })
    }

    function update() {
      if (gameOver) return

      frame++
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      ctx.fillStyle = '#aaa'
      ctx.fillRect(0, GROUND_Y + 5, CANVAS_WIDTH, 5)

      brain.y += brain.vy
      brain.vy += 1.2

      if (brain.y >= GROUND_Y) {
        brain.y = GROUND_Y
        brain.vy = 0
        brain.jumping = false
      }

      if (frame % 90 === 0) spawnObstacle()

      obstacles.forEach(o => (o.x -= 3))
      obstacles = obstacles.filter(o => o.x + o.width > 0)

      obstacles.forEach(o => {
        if (
          o.x < brain.x + brain.width &&
          o.x + o.width > brain.x &&
          brain.y >= o.y - o.height
        ) {
          gameOver = true

          if (musicRef.current) {
            musicRef.current.pause()
          }

          setIsGameOver(true)
        }
      })

      drawBrain()
      drawObstacles()

      score++
      ctx.fillStyle = 'black'
      ctx.font = '12px monospace'
      ctx.fillText(`Score: ${score}`, 10, 20)

      if (gameOver) {
        ctx.fillStyle = 'rgba(255, 107, 181, 1)'
        ctx.font = '14px "Press Start 2P", monospace'
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2 - 60, GROUND_Y - 40)
      } else {
        animationId = requestAnimationFrame(update)
      }
    }

    function jump() {
      if (!brain.jumping) {
        brain.vy = -18
        brain.jumping = true
      }
    }

    const handleKeydown = e => {
      if (e.code === 'Space') jump()
    }

    const handlePointerOrTouch = e => {
      const target = e.target || e.srcElement

      if (
        target &&
        (target.tagName === 'BUTTON' ||
          (target.closest && target.closest('button')))
      ) {
        return
      }

      if ((window.innerWidth || document.documentElement.clientWidth) <= 768) {
        jump()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('pointerdown', handlePointerOrTouch)
    document.addEventListener('touchstart', handlePointerOrTouch)

    update()

    return () => {
      cancelAnimationFrame(animationId)
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('pointerdown', handlePointerOrTouch)
      document.removeEventListener('touchstart', handlePointerOrTouch)
    }
  }, [shouldRestart])

  return (
    <main className="contact-page">
      <p className="contact-text">You can contact me by mail :</p>

      <h2 className="contact-email">
        mathias.hoffmann@imt-atlantique.net
      </h2>

      <canvas ref={canvasRef} className="contact-canvas" />

      {isGameOver && (
        <button
          onClick={() => {

            if (musicRef.current) {
              musicRef.current.currentTime = 0

              musicRef.current.play().catch(() => {})
            }

            setShouldRestart(prev => !prev)
            setIsGameOver(false)
          }}
          className="restart-button"
        >
          Restart
        </button>
      )}

      <p className="jump-text">
        Press the <b>space bar</b> to jump!
      </p>
    </main>
  )
}