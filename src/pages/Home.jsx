import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BrainModel from '../components/BrainModel'
import { useNavigate } from 'react-router-dom'
import usePageMusic from '../hooks/usePageMusic';











export default function Home() {
  const [selectedPart, setSelectedPart] = useState('Brain_Part_06')
  const [cardPosition, setCardPosition] = useState({ x: 900, y: 80 })
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600)
  usePageMusic('home.mp3')

  const navigate = useNavigate()
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const cardData = {
    Brain_Part_06: {
      title: 'Home',
      description: 'Select another part to navigate.',
      route: '/home',
    },
    Brain_Part_05: {
      title: 'Contact',
      description: 'Want to chat? Contact me here.',
      route: '/contact',
    },
    Brain_Part_02: {
      title: 'About',
      description: 'About me and my work.',
      route: '/about',
    },
    Brain_Part_04: {
      title: 'Projects',
      description: 'Here are some projects I made.',
      route: '/projects',
    },
  }

  const currentCard = cardData[selectedPart]

  return (
    <div className="home-page">
      <div className="home-text">
        <h1>Select</h1>
        <h1>another part</h1>
        <h1>to navigate</h1>
      </div>

      <div className="canvas-wrapper home-canvas-wrapper">
        <Canvas camera={{ position: [2.45, -0.15, 1.6], fov: 45 }}>
          <ambientLight intensity={0.1} />
          <directionalLight position={[0, 0, 5]} />

          <BrainModel
            selectedPart={selectedPart}
            setSelectedPart={setSelectedPart}
            setCardPosition={setCardPosition}
            setSelectedRoute={setSelectedRoute}
          />

          <OrbitControls />
        </Canvas>

        {currentCard && (
          <div
            className="brain-card"
            style={
              isMobile
                ? {
                    position: 'absolute',
                    left: '50%',
                    bottom: '15px',
                    top: 'auto',
                    transform: 'translateX(-50%)',
                  }
                : {
                    top: cardPosition.y,
                    left: cardPosition.x,
                  }
            }
          >
            <h4 onClick={() => navigate(currentCard.route)}>
              {currentCard.title}
            </h4>
            <p>{currentCard.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}