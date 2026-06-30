import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function BrainModel({
  selectedPart,
  setSelectedPart,
  setSelectedRoute,
  setCardPosition
}) {
  const groupRef = useRef()
  const { nodes } = useGLTF('/hoffmannmathias/models/brain_areas.glb')
  const meshNames = Object.keys(nodes).filter(key => nodes[key].isMesh)
  const { camera, gl } = useThree()

  // --- Rotation automatique lente (ajuste la vitesse au besoin)
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003 // 0.001 = très lent, 0.003 = lent
    }
  })

  const simplifyName = (fullName) => fullName.split('_BRAIN_TEXTURE')[0]

  const handleClick = (e, fullName) => {
    const simpleName = simplifyName(fullName)
    setSelectedPart(simpleName)

    // Position écran fiable: on part de la position MONDE du mesh
    const mesh = e.object
    const worldPos = new THREE.Vector3()
    mesh.getWorldPosition(worldPos)

    const ndc = worldPos.project(camera) // coordonnées normalisées [-1,1]
    const x = (ndc.x * 0.5 + 0.5) * gl.domElement.clientWidth
    const y = (-ndc.y * 0.5 + 0.5) * gl.domElement.clientHeight

    // Décalage pour ne pas recouvrir le modèle
    const offsetX = 350
    const offsetY = -150
    setCardPosition({ x: x + offsetX, y: y + offsetY })

    // Routage personnalisé
    let route = null
    switch (simpleName) {
      case 'Brain_Part_05':
        route = '/projets'
        break
      case 'Brain_Part_06':
        route = '/contact'
        break
      case 'Brain_Part_04':
        route = '/brain'
        break
      case 'Brain_Part_02':
        route = '/'
        break
      default:
        break
    }
    if (route) setSelectedRoute(route)
  }

  return (
    <group ref={groupRef}>
      {meshNames.map(name => {
        const simpleName = simplifyName(name)
        return (
          <mesh
            key={name}
            geometry={nodes[name].geometry}
            material={nodes[name].material.clone()}
            material-color={simpleName === selectedPart ? '#333' : nodes[name].material.color}
            onClick={(e) => handleClick(e, name)}
          />
        )
      })}
    </group>
  )
}

// (optionnel) préchargement du GLB
useGLTF.preload('/hoffmannmathias/models/brain_areas.glb')
