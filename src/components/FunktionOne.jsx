import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'





export default function FunktionOne(props) {
  const glb = useGLTF('/hoffmannmathias/models/FunktionOne.glb')
  const ref = useRef()

  // Rotation automatique douce



    const minAngle = 4*Math.PI/3; // 
    const maxAngle = 5*Math.PI/3 ;  // 
    const speed = 0.5; // vitesse d'oscillation
  
    useFrame(({ clock }) => {
      if (ref.current) {
        const t = clock.getElapsedTime();
        const oscillation = (Math.sin(t * speed) + 1) / 2; // de 0 à 1
        const angle = minAngle + (maxAngle - minAngle) * oscillation;
        ref.current.rotation.y = angle;
      }
    });



    return (
      <primitive
        ref={ref}
        object={glb.scene}
        scale={1}
        position={[-0.5, -0.5, -0.1]}
        rotation={[0, 5, 0]}
        {...props}
      />
    )
  }


