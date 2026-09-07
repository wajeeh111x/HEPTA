import {
  Canvas,
  useFrame,
  useThree,
} from "@react-three/fiber";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import * as THREE from "three";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   CORE
========================================================= */

function Core() {
  const group = useRef<THREE.Group>(null);

  const { mouse } = useThree();

  const animation = useRef({
    x: 0,
    y: 0,
    z: 0,

    rotationX: 0,
    rotationY: 0,

    scale: 1,
  });


  /*
   * Mouse target values.
   * We don't directly apply the mouse position.
   * Instead, we smoothly interpolate toward it.
   */

  const mouseTarget = useRef({
    x: 0,
    y: 0,
  });


  useFrame((state) => {
    if (!group.current) {
      return;
    }


    const time =
      state.clock.elapsedTime;


    const anim =
      animation.current;


    /*
     * Mouse movement
     */

    mouseTarget.current.x =
      mouse.x * 0.45;

    mouseTarget.current.y =
      mouse.y * 0.35;


    /*
     * Smooth mouse-following rotation
     */

    group.current.rotation.x =
      THREE.MathUtils.lerp(
        group.current.rotation.x,
        time * 0.12 +
          anim.rotationX -
          mouseTarget.current.y,
        0.04
      );


    group.current.rotation.y =
      THREE.MathUtils.lerp(
        group.current.rotation.y,
        time * 0.2 +
          anim.rotationY +
          mouseTarget.current.x,
        0.04
      );


    /*
     * Position
     */

    group.current.position.x =
      THREE.MathUtils.lerp(
        group.current.position.x,
        anim.x,
        0.05
      );


    group.current.position.y =
      THREE.MathUtils.lerp(
        group.current.position.y,
        Math.sin(time * 0.8) * 0.12 +
          anim.y,
        0.05
      );


    group.current.position.z =
      THREE.MathUtils.lerp(
        group.current.position.z,
        anim.z,
        0.05
      );


    /*
     * Scale
     */

    const currentScale =
      group.current.scale.x;


    const targetScale =
      anim.scale;


    const smoothScale =
      THREE.MathUtils.lerp(
        currentScale,
        targetScale,
        0.05
      );


    group.current.scale.setScalar(
      smoothScale
    );
  });


  /*
   * Scroll animation
   */

  useEffect(() => {
    const animationState =
      animation.current;


    const trigger =
      gsap.to(
        animationState,
        {
          x: 2.2,
          y: -0.4,
          z: -1,

          rotationX:
            Math.PI * 0.8,

          rotationY:
            Math.PI * 1.5,

          scale: 0.55,

          ease: "none",

          scrollTrigger: {
            trigger: ".hero",

            start: "top top",

            end: "bottom top",

            scrub: 1.2,
          },
        }
      );


    return () => {
      trigger.scrollTrigger?.kill();
      trigger.kill();
    };
  }, []);


  return (
    <group ref={group}>

      {/* =================================================
          OUTER SHELL
      ================================================= */}

      <mesh>
        <icosahedronGeometry
          args={[1.5, 2]}
        />

        <meshStandardMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>


      {/* =================================================
          MAIN STRUCTURE
      ================================================= */}

      <mesh>
        <icosahedronGeometry
          args={[1.5, 3]}
        />

        <meshStandardMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.8}
          roughness={0.2}
          metalness={1}
        />
      </mesh>


      {/* =================================================
          INNER STRUCTURE
      ================================================= */}

      <mesh scale={0.65}>
        <icosahedronGeometry
          args={[1.5, 2]}
        />

        <meshStandardMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>


      {/* =================================================
          CORE
      ================================================= */}

      <mesh scale={0.2}>
        <sphereGeometry
          args={[1, 32, 32]}
        />

        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={2}
        />
      </mesh>

    </group>
  );
}


/* =========================================================
   PARTICLES
========================================================= */

function Particles() {
  const points =
    useRef<THREE.Points>(null);


  const particleCount = 1500;


  /*
   * Generate particle positions only once.
   */

  const positions =
    useMemo(() => {
      const data =
        new Float32Array(
          particleCount * 3
        );


      for (
        let i = 0;
        i < particleCount;
        i++
      ) {
        const radius =
          4 +
          Math.random() * 6;


        const theta =
          Math.random() *
          Math.PI *
          2;


        const phi =
          Math.acos(
            2 * Math.random() - 1
          );


        data[i * 3] =
          radius *
          Math.sin(phi) *
          Math.cos(theta);


        data[i * 3 + 1] =
          radius *
          Math.sin(phi) *
          Math.sin(theta);


        data[i * 3 + 2] =
          radius *
          Math.cos(phi);
      }


      return data;
    }, []);


  useFrame((state) => {
    if (!points.current) {
      return;
    }


    const time =
      state.clock.elapsedTime;


    points.current.rotation.y =
      time * 0.015;


    points.current.rotation.x =
      time * 0.008;
  });


  return (
    <points ref={points}>

      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[
            positions,
            3,
          ]}
        />
      </bufferGeometry>


      <pointsMaterial
        size={0.025}
        color="#ffffff"
        transparent
        opacity={0.45}
        sizeAttenuation
      />

    </points>
  );
}


/* =========================================================
   CAMERA ANIMATION
========================================================= */

function CameraAnimation() {
  const { camera } =
    useThree();


  const perspectiveCamera =
    camera as THREE.PerspectiveCamera;


  const animation =
    useRef({
      x: 0,
      y: 0,
      z: 5,

      fov: 45,
    });


  useFrame(() => {
    const state =
      animation.current;


    /*
     * Smooth camera movement
     */

    perspectiveCamera.position.x =
      THREE.MathUtils.lerp(
        perspectiveCamera.position.x,
        state.x,
        0.05
      );


    perspectiveCamera.position.y =
      THREE.MathUtils.lerp(
        perspectiveCamera.position.y,
        state.y,
        0.05
      );


    perspectiveCamera.position.z =
      THREE.MathUtils.lerp(
        perspectiveCamera.position.z,
        state.z,
        0.05
      );


    perspectiveCamera.fov =
      THREE.MathUtils.lerp(
        perspectiveCamera.fov,
        state.fov,
        0.05
      );


    perspectiveCamera.updateProjectionMatrix();
  });


  /*
   * Create ScrollTrigger once.
   */

  useEffect(() => {
    const state =
      animation.current;


    const trigger =
      gsap.to(
        state,
        {
          x: -0.5,

          y: 0.2,

          z: 6,

          fov: 55,

          ease: "none",

          scrollTrigger: {
            trigger: ".hero",

            start: "top top",

            end: "bottom top",

            scrub: 1.2,
          },
        }
      );


    return () => {
      trigger.scrollTrigger?.kill();
      trigger.kill();
    };
  }, []);


  return null;
}


/* =========================================================
   HERO SCENE
========================================================= */

export default function HeroScene() {
  return (
    <Canvas
      camera={{
        position: [
          0,
          0,
          5,
        ],

        fov: 45,
      }}

      dpr={[
        1,
        2,
      ]}
    >

      {/* =================================================
          LIGHTING
      ================================================= */}

      <ambientLight
        intensity={0.5}
      />


      <pointLight
        position={[
          3,
          3,
          3,
        ]}
        intensity={8}
      />


      <pointLight
        position={[
          -3,
          -2,
          -3,
        ]}
        intensity={3}
      />


      {/* =================================================
          SCENE
      ================================================= */}

      <Particles />

      <Core />

      <CameraAnimation />

    </Canvas>
  );
}