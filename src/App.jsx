import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import Contact from './pages/Contact'
import Projects from './pages/Projects'
import About from './pages/About'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import GamePage from './pages/GamePage'

import { musicController } from './hooks/usePageMusic'

export default function App() {

  const [musicOn, setMusicOn] = useState(false)

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  )

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  return (
    <>
      {/* <Navbar /> */}
      <GamePage />



      {/* Bouton musique */}
      <button
        className="music-button music-button-fixed"
        onClick={() => {
          musicController.toggle()
          setMusicOn(musicController.isPlaying())
        }}
      >
        {musicOn ? '🔊 MUSIC' : '🔇 MUSIC'}
      </button>

      {/* Bouton dark mode */}
      {/* <button
        className={`theme-button theme-button-fixed ${darkMode ? 'dark' : 'light'}`}
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? '☀️' : '🌙'}
      </button> */}
    </>
  )
}