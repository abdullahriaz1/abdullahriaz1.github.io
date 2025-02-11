// src/components/Gallery.js
import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';

// Dynamically import all images from your photo-gallery folder
const images = require.context('../photo-gallery', true);
const imageList = images.keys().map((img) => images(img));

// Increased gallery radius for more spread
const radius = 70;

/**
 * ImagePrism
 *
 * Each image is rendered on a rectangular prism whose dimensions are computed
 * from the image’s natural size. The larger side is scaled to 20 units with a constant depth of 3.
 * Only the front face (assumed to be the positive Z face) is textured.
 */
function ImagePrism({ url, position }) {
  const { camera } = useThree();
  const prismRef = useRef();
  const texture = useTexture(url);
  const [dimensions, setDimensions] = useState({ width: 20, height: 20 });

  // Compute dimensions based on the image's natural size, scaling so the larger side becomes 20.
  useEffect(() => {
    if (texture && texture.image) {
      const naturalWidth = texture.image.width;
      const naturalHeight = texture.image.height;
      const scaleFactor = 20 / Math.max(naturalWidth, naturalHeight);
      setDimensions({
        width: naturalWidth * scaleFactor,
        height: naturalHeight * scaleFactor,
      });
    }
  }, [texture]);

  const depth = 3; // constant depth

  // Create materials: only the front face (index 4) gets the texture.
  const materials = [
    new THREE.MeshBasicMaterial({ color: '#777' }), // Right
    new THREE.MeshBasicMaterial({ color: '#777' }), // Left
    new THREE.MeshBasicMaterial({ color: '#777' }), // Top
    new THREE.MeshBasicMaterial({ color: '#777' }), // Bottom
    new THREE.MeshBasicMaterial({ map: texture, transparent: true }), // Front
    new THREE.MeshBasicMaterial({ color: '#777' }), // Back
  ];

  // Rotate the prism so its front always faces the camera.
  useFrame(() => {
    if (prismRef.current) {
      prismRef.current.lookAt(camera.position);
    }
  });

  return (
    <group ref={prismRef} position={position}>
      <mesh
        geometry={new THREE.BoxGeometry(dimensions.width, dimensions.height, depth)}
        material={materials}
      />
    </group>
  );
}

/**
 * GalleryScene
 *
 * Arranges the image prisms on a circle and rotates the entire group.
 */
function GalleryScene({ groupRef }) {
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });
  return (
    <group ref={groupRef}>
      {imageList.map((img, i) => {
        const angle = (i / imageList.length) * Math.PI * 2;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        return <ImagePrism key={i} url={img} position={[x, 0, z]} />;
      })}
    </group>
  );
}

/**
 * FocusedEllipsoid
 *
 * Creates an ellipsoidal (egg‑shaped) sky by using a sphere geometry that is scaled
 * non‑uniformly along the Y‑axis. The texture is set to repeat twice horizontally so that
 * the image appears twice around the sphere. The material’s side is set to THREE.BackSide
 * so that the texture is visible on the inside.
 */
function FocusedEllipsoid({ focusedImage }) {
  const texture = useTexture(focusedImage);

  // Set the texture to repeat twice horizontally.
  useEffect(() => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.set(2, 1); // Repeat the image twice on the horizontal (U) axis.
      texture.needsUpdate = true;
    }
  }, [texture]);

  const [spring, api] = useSpring(() => ({
    scale: 0.8, // starting uniform scale
    config: { mass: 1, tension: 170, friction: 26 },
  }));

  useEffect(() => {
    // Animate to a uniform scale of 1.
    api.start({ scale: 1 });
  }, [focusedImage, api]);

  return (
    // The animated group scales uniformly using the spring value.
    <a.group scale={spring.scale}>
      {/*
        The inner mesh is scaled non‑uniformly:
        - X and Z remain 1 (full size),
        - Y is reduced (0.7) to create an ovular (egg‑shaped) effect.
      */}
      <mesh scale={[1, 0.7, 1]}>
        {/* Sphere geometry with a radius of 300 for a large skybox. */}
        <sphereGeometry args={[300, 64, 64]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
    </a.group>
  );
}

/**
 * AutoFocus
 *
 * Projects each image's position into screen space and finds the one closest to the center.
 * The focused image only changes if a new image is in focus for more than 0.8 seconds.
 */
function AutoFocus({ groupRef }) {
  const { camera } = useThree();
  const [focusedImage, setFocusedImage] = useState(null);
  // candidateRef holds the candidate image and the time when it first became the candidate.
  const candidateRef = useRef({ candidate: null, start: 0 });
  const holdDuration = 800; // milliseconds

  useFrame(() => {
    if (!groupRef.current) return;
    let bestIndex = -1;
    let bestDistance = Infinity;
    for (let i = 0; i < imageList.length; i++) {
      const localPos = new THREE.Vector3(
        radius * Math.cos((i / imageList.length) * Math.PI * 2),
        0,
        radius * Math.sin((i / imageList.length) * Math.PI * 2)
      );
      groupRef.current.localToWorld(localPos);
      const ndcPos = localPos.clone().project(camera);
      const distance = Math.hypot(ndcPos.x, ndcPos.y);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = i;
      }
    }

    if (bestDistance < 0.3) {
      const candidate = imageList[bestIndex];
      // If the candidate is the same, check if it has been held long enough.
      if (candidateRef.current.candidate === candidate) {
        if (Date.now() - candidateRef.current.start > holdDuration) {
          if (candidate !== focusedImage) {
            setFocusedImage(candidate);
          }
        }
      } else {
        // A new candidate: reset the timer.
        candidateRef.current = { candidate, start: Date.now() };
      }
    } else {
      // Reset if no candidate is in focus.
      candidateRef.current = { candidate: null, start: 0 };
    }
  });

  return focusedImage ? <FocusedEllipsoid focusedImage={focusedImage} /> : null;
}

/**
 * ClampControls
 *
 * Smoothly clamps the OrbitControls target and the camera's position so that they remain
 * within a certain range, ensuring the view stays inside the sky.
 */
function ClampControls({ controlsRef }) {
  const { camera } = useThree();
  useFrame(() => {
    if (!controlsRef.current) return;
    const min = -140,
      max = 140;
    const target = controlsRef.current.target.clone();
    const clampedTarget = new THREE.Vector3(
      THREE.MathUtils.clamp(target.x, min, max),
      THREE.MathUtils.clamp(target.y, min, max),
      THREE.MathUtils.clamp(target.z, min, max)
    );
    controlsRef.current.target.lerp(clampedTarget, 0.1);

    const currentPos = camera.position.clone();
    const clampedPos = new THREE.Vector3(
      THREE.MathUtils.clamp(currentPos.x, min, max),
      THREE.MathUtils.clamp(currentPos.y, min, max),
      THREE.MathUtils.clamp(currentPos.z, min, max)
    );
    camera.position.lerp(clampedPos, 0.1);
    controlsRef.current.update();
  });
  return null;
}

/**
 * Gallery
 *
 * Sets up the 3D scene with the rotating gallery of image prisms,
 * auto‑focus logic, and OrbitControls that simulate a first‑person-like view.
 */
function Gallery() {
  const groupRef = useRef();
  const controlsRef = useRef();

  return (
    <Canvas camera={{ position: [0, 5, 15] }} style={{ height: '100vh', background: '#111' }}>
      <ambientLight intensity={0.3} />
      <pointLight intensity={0.3} position={[10, 10, 10]} />
      <GalleryScene groupRef={groupRef} />
      <AutoFocus groupRef={groupRef} />
      <OrbitControls
        ref={controlsRef}
        target={[0, 5, 14.9]}
        enableZoom={true}
        zoomSpeed={2.5}
        enablePan={true}
        panSpeed={2.5}
        minDistance={10}
        maxDistance={250}
      />
      <ClampControls controlsRef={controlsRef} />
    </Canvas>
  );
}

export default Gallery;
