// src/components/ProjectSection.jsx
import React from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"

export default function ProjectSection({ title, description, children }) {
  return (
    <div className="project-row">
      {/* Colonne texte */}
      <div className="project-text">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      {/* Colonne 3D */}
      <div className="project-3d">
        <Canvas
          camera={{ position: [0, 4, 8], fov: 40 }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={1} />
          <OrbitControls enableZoom={false} enablePan={false} />
          {children}
        </Canvas>
      </div>
    </div>
  )
}
