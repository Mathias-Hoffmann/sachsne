import React from 'react'
import { NavLink } from 'react-router-dom'
import { musicController } from "../hooks/usePageMusic";
import { useState } from "react";





export default function Navbar() {
  return (
    <nav>
      <NavLink to="/home">Home</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/projects">Projects</NavLink>
      <NavLink to="/contact">Contact</NavLink>
      <NavLink to="/gamepage">Game</NavLink>
 
      

    </nav>
  )
}





