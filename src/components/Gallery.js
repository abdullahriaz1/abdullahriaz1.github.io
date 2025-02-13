// src/components/Gallery.js
import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo
} from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, Text } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';

// Dynamically import all images from your photo-gallery folder
const images = require.context('../photo-gallery', true);
const imageList = images.keys().map((img) => images(img));

// JSON variable holding our text items
const textsJson = [
  { id: 1, text: "The Gallery" },
  { id: 2, text: "Sample Text 1" },
  { id: 3, text: "Sample Text 2" }
];

// The ring radius for the image prisms
const radius = 105;

/**
 * RainbowEdges
 *
 * Renders a lineSegments EdgesGeometry (of a box) that cycles through rainbow hues.
 */
function RainbowEdges({ width, height, depth }) {
  const linesRef = useRef();
  const edgesGeometry = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(width, height, depth)),
    [width, height, depth]
  );
  useFrame((state) => {
    if (!linesRef.current) return;
    const t = state.clock.getElapsedTime();
    const hue = (t * 0.1) % 1;
    linesRef.current.material.color.setHSL(hue, 1, 0.5);
  });
  return (
    <lineSegments ref={linesRef} geometry={edgesGeometry}>
      <lineBasicMaterial />
    </lineSegments>
  );
}

/**
 * RainbowEdgesSphere
 *
 * Renders a lineSegments EdgesGeometry for a sphere that cycles through rainbow hues.
 * (Not used for the egg anymore.)
 */
function RainbowEdgesSphere({ radius, widthSegments, heightSegments }) {
  const linesRef = useRef();
  const geometry = useMemo(
    () =>
      new THREE.EdgesGeometry(
        new THREE.SphereGeometry(radius, widthSegments, heightSegments)
      ),
    [radius, widthSegments, heightSegments]
  );
  useFrame((state) => {
    if (!linesRef.current) return;
    const t = state.clock.getElapsedTime();
    const hue = (t * 0.1) % 1;
    linesRef.current.material.color.setHSL(hue, 1, 0.5);
  });
  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial />
    </lineSegments>
  );
}

/**
 * ImagePrism
 *
 * Displays an image on a box whose largest side is scaled to 36.
 * All six faces are covered with the same stretched image texture.
 * The prism smoothly rotates toward the camera.
 * It shows a rainbow border glow if hovered, or if it’s the currently focused image,
 * or if it is the candidate image.
 */
function ImagePrism({ url, position, onClickFocus, isFocused, isCandidate }) {
  const { camera } = useThree();
  const prismRef = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(url);

  // Final largest dimension is 36.
  const [dimensions, setDimensions] = useState({ width: 36, height: 36 });
  const depth = 3;
  useEffect(() => {
    if (texture?.image) {
      const { width, height } = texture.image;
      const scaleFactor = 36 / Math.max(width, height);
      setDimensions({
        width: width * scaleFactor,
        height: height * scaleFactor
      });
    }
  }, [texture]);

  // Use one material for all faces so the image stretches to cover every side.
  const imageMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    color: '#eeeeee'
  });
  const materials = [imageMaterial, imageMaterial, imageMaterial, imageMaterial, imageMaterial, imageMaterial];

  // Smoothly rotate toward the camera:
  useFrame(() => {
    if (!prismRef.current) return;
    const oldQ = prismRef.current.quaternion.clone();
    prismRef.current.lookAt(camera.position);
    const targetQ = prismRef.current.quaternion.clone();
    prismRef.current.quaternion.copy(oldQ);
    prismRef.current.quaternion.slerp(targetQ, 0.02);
  });

  return (
    <group ref={prismRef} position={position}>
      <mesh
        geometry={new THREE.BoxGeometry(dimensions.width, dimensions.height, depth)}
        material={materials}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onClickFocus(url);
        }}
      />
      {(hovered || isFocused || isCandidate) && (
        <>
          <RainbowEdges
            width={dimensions.width * 1.01}
            height={dimensions.height * 1.01}
            depth={depth * 1.01}
          />
          <RainbowEdges
            width={dimensions.width * 1.02}
            height={dimensions.height * 1.02}
            depth={depth * 1.02}
          />
          <RainbowEdges
            width={dimensions.width * 1.03}
            height={dimensions.height * 1.03}
            depth={depth * 1.03}
          />
        </>
      )}
    </group>
  );
}

/**
 * TitleTextItem
 *
 * Displays a single text item with a frame behind it.
 * It always faces the camera and its text color cycles through rainbow hues.
 */
function TitleTextItem({ text, position }) {
  const { camera } = useThree();
  const groupRef = useRef();
  const textRef = useRef();
  const planeSize = [18, 6];
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.lookAt(camera.position);
    if (textRef.current) {
      const t = state.clock.getElapsedTime();
      const hue = (t * 0.1) % 1;
      textRef.current.color = new THREE.Color().setHSL(hue, 1, 0.5);
    }
  });
  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={planeSize} />
        <meshStandardMaterial
          color="#000000"
          metalness={0.2}
          roughness={0.4}
          transparent
          opacity={0.6}
        />
      </mesh>
      <Text ref={textRef} fontSize={3} anchorX="center" anchorY="middle" color="white">
        {text}
      </Text>
    </group>
  );
}

/**
 * TitleTextCircle
 *
 * Arranges multiple TitleTextItem components in a circle.
 * The entire group rotates (orbits) around the center.
 */
function TitleTextCircle({ texts, circleRadius = 30, y = 20 }) {
  const groupRef = useRef();
  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.002;
  });
  return (
    <group ref={groupRef}>
      {texts.map((item, index) => {
        const angle = (index / texts.length) * Math.PI * 2;
        const x = circleRadius * Math.cos(angle);
        const z = circleRadius * Math.sin(angle);
        return <TitleTextItem key={item.id} text={item.text} position={[x, y, z]} />;
      })}
    </group>
  );
}

/**
 * GalleryScene
 *
 * Renders a rotating circle of ImagePrisms.
 * Each prism gets an `isFocused` prop if its URL equals the global focused image,
 * and an `isCandidate` prop if its URL equals the current candidate image.
 */
function GalleryScene({ groupRef, onClickFocus, focusedImage, candidateImage }) {
  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.002;
  });
  return (
    <group ref={groupRef}>
      {imageList.map((img, i) => {
        const angle = (i / imageList.length) * Math.PI * 2;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        return (
          <ImagePrism
            key={i}
            url={img}
            position={[x, 0, z]}
            onClickFocus={onClickFocus}
            isFocused={img === focusedImage}
            isCandidate={img === candidateImage}
          />
        );
      })}
    </group>
  );
}

/**
 * FocusedEllipsoid
 *
 * Displays the focused image on a 2× scaled inside-out sphere ("egg").
 * The egg texture is flipped horizontally (using negative repeat/offset)
 * so it appears correct. (No glowing border is applied to the egg.)
 */
function FocusedEllipsoid({ focusedImage }) {
  const baseTexture = useTexture(focusedImage);
  const [ellipsoidTexture, setEllipsoidTexture] = useState(null);
  useEffect(() => {
    if (!baseTexture) return;
    const cloned = baseTexture.clone();
    cloned.wrapS = THREE.RepeatWrapping;
    // Flip horizontally: negative repeat on x and offset x to 1.
    cloned.repeat.set(-2, 1);
    cloned.offset.set(1, 0);
    cloned.needsUpdate = true;
    setEllipsoidTexture(cloned);
  }, [baseTexture]);
  const [spring, api] = useSpring(() => ({
    scale: 0.8,
    config: { mass: 1, tension: 170, friction: 26 }
  }));
  useEffect(() => {
    api.start({ scale: 1 });
  }, [focusedImage, api]);
  if (!ellipsoidTexture) return null;
  return (
    <a.group scale={spring.scale.to((s) => [2 * s, 2 * s, 2 * s])}>
      <mesh scale={[1, 0.7, 1]}>
        <sphereGeometry args={[300, 64, 64]} />
        <meshBasicMaterial map={ellipsoidTexture} side={THREE.BackSide} />
      </mesh>
    </a.group>
  );
}

/**
 * AutoFocus
 *
 * Determines which image is currently in the center of view.
 * If an image is held in the center for 2 seconds, it becomes the focused image.
 * Additionally, we call onCandidateChange each frame so that the current candidate
 * (the image currently in view) can be used to immediately add the border glow.
 */
const AutoFocus = forwardRef(function AutoFocus(
  { groupRef, focusedImage, setFocusedImage, onCandidateChange },
  ref
) {
  const { camera } = useThree();
  const candidateRef = useRef({ candidate: null, start: 0 });
  const holdDuration = 2000;
  useImperativeHandle(ref, () => ({
    resetCandidate: () => {
      candidateRef.current = { candidate: null, start: 0 };
    }
  }));
  useFrame(() => {
    if (!groupRef.current) return;
    let bestIndex = -1;
    let bestDistance = Infinity;
    for (let i = 0; i < imageList.length; i++) {
      const angle = (i / imageList.length) * Math.PI * 2;
      const localPos = new THREE.Vector3(
        radius * Math.cos(angle),
        0,
        radius * Math.sin(angle)
      );
      groupRef.current.localToWorld(localPos);
      const ndcPos = localPos.clone().project(camera);
      const distance = Math.hypot(ndcPos.x, ndcPos.y);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = i;
      }
    }
    let candidate = null;
    if (bestDistance < 0.3) {
      candidate = imageList[bestIndex];
      if (candidateRef.current.candidate === candidate) {
        const elapsed = Date.now() - candidateRef.current.start;
        if (elapsed > holdDuration && candidate !== focusedImage) {
          setFocusedImage(candidate);
        }
      } else {
        candidateRef.current = { candidate, start: Date.now() };
      }
    } else {
      candidateRef.current = { candidate: null, start: 0 };
    }
    if (onCandidateChange) onCandidateChange(candidateRef.current.candidate);
  });
  return null;
});

/**
 * ClampControls
 *
 * Radially clamps the camera and orbit target so they remain inside a sphere of radius 600.
 */
function ClampControls({ controlsRef }) {
  const { camera } = useThree();
  useFrame(() => {
    if (!controlsRef.current) return;
    const maxR = 600;
    const t = controlsRef.current.target.clone();
    const distT = t.length();
    if (distT > maxR) {
      t.normalize().multiplyScalar(maxR);
      controlsRef.current.target.lerp(t, 0.2);
    }
    const p = camera.position.clone();
    const distP = p.length();
    if (distP > maxR) {
      p.normalize().multiplyScalar(maxR);
      camera.position.lerp(p, 0.2);
    }
    controlsRef.current.update();
  });
  return null;
}

/**
 * CaptureCamera
 *
 * Grabs the camera reference and passes it up.
 */
function CaptureCamera({ onCameraReady }) {
  const { camera } = useThree();
  useEffect(() => {
    onCameraReady(camera);
  }, [camera, onCameraReady]);
  return null;
}

/**
 * Gallery
 *
 * Main scene:
 * - On mount, a random image is chosen for initial focus.
 * - TitleTextCircle arranges text items (from textsJson) in a circle (radius 30, y=20) that orbit.
 * - GalleryScene displays a rotating circle of ImagePrisms.
 * - FocusedEllipsoid displays the focused image on a 2× scaled inside-out sphere ("egg") (no border glow on the egg).
 * - AutoFocus determines the candidate image and sets the focused image after 2 seconds.
 *   It also calls onCandidateChange so that each ImagePrism knows if it is the candidate.
 * - OrbitControls and ClampControls are integrated.
 */
function Gallery() {
  const groupRef = useRef();
  const controlsRef = useRef();
  const containerRef = useRef(null);
  const [focusedImage, setFocusedImage] = useState(null);
  const [candidateImage, setCandidateImage] = useState(null);
  const autoFocusRef = useRef(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!focusedImage) {
      const randomIndex = Math.floor(Math.random() * imageList.length);
      setFocusedImage(imageList[randomIndex]);
    }
  }, [focusedImage]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleResetView = () => {
    if (cameraRef && controlsRef.current) {
      cameraRef.position.set(0, 5, 15);
      controlsRef.current.target.set(0, 5, 14.9);
      controlsRef.current.update();
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleClickFocus = (url) => {
    setFocusedImage(url);
    if (autoFocusRef.current) {
      autoFocusRef.current.resetCandidate();
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 5, 15] }} style={{ background: '#111', width: '100%', height: '100%' }}>
        <ambientLight intensity={0.8} />
        <pointLight intensity={0.8} position={[10, 10, 10]} />
        <CaptureCamera onCameraReady={setCameraRef} />
        {/* Arrange text items in a circle */}
        <TitleTextCircle texts={textsJson} circleRadius={30} y={20} />
        <GalleryScene groupRef={groupRef} onClickFocus={handleClickFocus} focusedImage={focusedImage} candidateImage={candidateImage} />
        <AutoFocus ref={autoFocusRef} groupRef={groupRef} focusedImage={focusedImage} setFocusedImage={setFocusedImage} onCandidateChange={setCandidateImage} />
        {focusedImage && <FocusedEllipsoid focusedImage={focusedImage} />}
        <OrbitControls
          ref={controlsRef}
          minDistance={1}
          maxDistance={250}
          target={[0, 5, 14.9]}
          enableZoom
          zoomSpeed={2.5}
          enablePan
          panSpeed={2.5}
        />
        <ClampControls controlsRef={controlsRef} />
      </Canvas>
      <div
        style={{
          position: 'absolute',
          right: '20px',
          top: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 9999
        }}
      >
        <button
          onClick={handleResetView}
          style={{
            padding: '8px 12px',
            background: '#222',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset View
        </button>
        <button
          onClick={handleToggleFullscreen}
          style={{
            padding: '8px 12px',
            background: '#222',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>
    </div>
  );
}

export default Gallery;
