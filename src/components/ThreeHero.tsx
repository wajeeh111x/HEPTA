import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Core() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) {
      return;
    }

    const time = state.clock.getElapsedTime();

    meshRef.current.rotation.x = time * 0.15;
    meshRef.current.rotation.y = time * 0.25;

    meshRef.current.rotation.z =
      Math.sin(time * 0.3) * 0.15;
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={1}
    >
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.8, 64]} />

        <MeshDistortMaterial
          distort={0.35}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />

      <directionalLight
        position={[4, 4, 5]}
        intensity={2}
      />

      <pointLight
        position={[-4, -2, 3]}
        intensity={3}
      />

      <Core />

      <Environment preset="studio" />
    </>
  );
}

export default function ThreeHero() {
  return (
    <div className="three-hero">
      <Canvas
        camera={{
          position: [0, 0, 7],
          fov: 45,
        }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}