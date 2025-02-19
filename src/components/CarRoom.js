import React, {
  useState,
  useMemo,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  Suspense,
} from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { useGLTF, Text, Html, useProgress } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import backgroundImage from "../photo-gallery/wp9262282-european-village-4k-wallpapers.jpg";

// -----------------------------------------------------------------------------
// Helper: Compute the center of an object's bounding box.
const computeModelCenter = (object) => {
  const box = new THREE.Box3().setFromObject(object);
  const center = new THREE.Vector3();
  box.getCenter(center);
  return center;
};

// -----------------------------------------------------------------------------
// Loader Component for Suspense fallback
function LoadingOverlay() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={loaderStyles}>
        <img src="/spinner2.gif" style={{ width: 50, height: 50 }} />
        <p style={{ fontSize: "10px", marginTop: 10, color: "white"}}>
          Loading {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
}

const loaderStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center"
};

// -----------------------------------------------------------------------------
// BackgroundSheet Component
function BackgroundSheet({ xOffset = 0, yOffset = -20, zOffset = 29 }) {
  const texture = useLoader(THREE.TextureLoader, backgroundImage);

  useEffect(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(-1, 1);
    texture.needsUpdate = true;
  }, [texture]);

  const parametricFunc = (u, v, target) => {
    const theta = THREE.MathUtils.lerp(-Math.PI / 2, Math.PI / 2, u);
    const phi = THREE.MathUtils.lerp(-Math.PI / 2, Math.PI / 2, v);
    const horizontalRadius = 100;
    const verticalRadius = 100;
    const x = horizontalRadius * Math.sin(theta);
    const z = horizontalRadius * Math.cos(theta) * Math.cos(phi);
    const y = verticalRadius * Math.sin(phi);
    target.set(x, y, z);
  };

  const geometry = useMemo(() => {
    const segments = 32;
    return new ParametricGeometry(parametricFunc, segments, segments);
  }, []);

  return (
    <mesh position={[xOffset, yOffset, zOffset]}>
      <primitive object={geometry} attach="geometry" />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
}

// -----------------------------------------------------------------------------
// CarModel Component
function CarModel({
  url,
  scale,
  position,
  rotation,
  emissiveIntensity,
  emissiveColor,
  onCarClick,
  onLoadCenter,
  rotationSpeed = 0.5,
}) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  const modelRef = useRef();
  const animatedRef = useRef();
  const hasCentered = useRef(false);

  useFrame((state, delta) => {
    if (animatedRef.current) {
      animatedRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  useLayoutEffect(() => {
    if (modelRef.current && !hasCentered.current) {
      const center = computeModelCenter(modelRef.current);
      modelRef.current.position.sub(center);
      hasCentered.current = true;
      onLoadCenter && onLoadCenter([center.x, center.y, center.z]);
    }
  }, [clonedScene, onLoadCenter]);

  useMemo(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.material.emissive = new THREE.Color(
          emissiveColor,
          emissiveColor,
          emissiveColor
        );
        child.material.emissiveIntensity = emissiveIntensity;
        child.material.toneMapped = false;
      }
    });
  }, [clonedScene, emissiveColor, emissiveIntensity]);

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onCarClick && onCarClick();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <group ref={animatedRef}>
        <group ref={modelRef}>
          <primitive object={clonedScene} />
        </group>
      </group>
    </group>
  );
}

// -----------------------------------------------------------------------------
// CarLabels Component
function CarLabels({ cars }) {
  return cars.map((car) => {
    const row = car.row ? -1 : 1;
    return (
      <Text
        key={car.id + "-label"}
        position={[car.position[0], 3, car.position[2]]}
        rotation={[0, Math.PI / 2 * row, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {car.name}
      </Text>
    );
  });
}

// -----------------------------------------------------------------------------
// Showroom Component
function Showroom() {
  const { scene } = useGLTF("/3d-assets/studio_v1_for_car/scene.gltf");

  const clippingPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, -30), 1),
    []
  );

  scene.traverse((child) => {
    if (child.isMesh) {
      if (Array.isArray(child.material)) {
        child.material.forEach((mat) => {
          mat.clippingPlanes = [clippingPlane];
          mat.clipShadows = true;
        });
      } else {
        child.material.clippingPlanes = [clippingPlane];
        child.material.clipShadows = true;
      }
    }
  });

  return <primitive object={scene} scale={2} />;
}

// -----------------------------------------------------------------------------
// CarControlPanel Component
const CarControlPanel = React.memo(({ car, updateCar, resetCar }) => {
  return (
    <div style={{ flex: 1, border: "1px solid white", padding: "10px" }}>
      <h3>{car.name} Effects</h3>
      <label>
        Scale:{" "}
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.01"
          value={car.baseScale}
          onChange={(e) =>
            updateCar(car.id, { baseScale: parseFloat(e.target.value) })
          }
        />
      </label>
      <br />
      {["X", "Y", "Z"].map((axis, i) => (
        <div key={`pos-${axis}`}>
          <label>
            Position {axis}:{" "}
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={car.position[i]}
              onChange={(e) => {
                const newPos = [...car.position];
                newPos[i] = parseFloat(e.target.value);
                updateCar(car.id, { position: newPos });
              }}
            />
          </label>
        </div>
      ))}
      {["X", "Y", "Z"].map((axis, i) => (
        <div key={`rot-${axis}`}>
          <label>
            Rotation {axis}:{" "}
            <input
              type="range"
              min="-3.14"
              max="3.14"
              step="0.01"
              value={car.rotation[i]}
              onChange={(e) => {
                const newRot = [...car.rotation];
                newRot[i] = parseFloat(e.target.value);
                updateCar(car.id, { rotation: newRot });
              }}
            />
          </label>
        </div>
      ))}
      <label>
        Emissive Intensity:{" "}
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={car.emissiveIntensity}
          onChange={(e) =>
            updateCar(car.id, { emissiveIntensity: parseFloat(e.target.value) })
          }
        />
      </label>
      <br />
      <label>
        Emissive Color:{" "}
        <input
          type="range"
          min="0"
          max="0.3"
          step="0.01"
          value={car.emissiveColor}
          onChange={(e) =>
            updateCar(car.id, { emissiveColor: parseFloat(e.target.value) })
          }
        />
      </label>
      <pre style={{ color: "white", marginTop: "10px" }}>
        {JSON.stringify(
          {
            baseScale: car.baseScale,
            position: car.position,
            rotation: car.rotation,
            emissiveIntensity: car.emissiveIntensity,
            emissiveColor: car.emissiveColor,
            center: car.center,
          },
          null,
          2
        )}
      </pre>
      <br />
      <button
        onClick={() => resetCar(car.id)}
        style={{ marginTop: "10px", padding: "10px", cursor: "pointer" }}
      >
        Reset {car.name}
      </button>
    </div>
  );
});

// -----------------------------------------------------------------------------
// FirstPersonMovement Component
function FirstPersonMovement({ speed = 12, bounds }) {
  const { camera } = useThree();
  const keys = useRef({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(camera.up, direction).normalize();

    const move = new THREE.Vector3();
    if (keys.current["w"]) move.add(direction);
    if (keys.current["s"]) move.sub(direction);
    if (keys.current["a"]) move.add(right);
    if (keys.current["d"]) move.sub(right);
    if (move.length() > 0) {
      move.normalize().multiplyScalar(speed * delta);
      camera.position.add(move);
      if (bounds) {
        camera.position.clamp(bounds.min, bounds.max);
      }
    }
  });

  return null;
}

// -----------------------------------------------------------------------------
// CameraTracker Component
function CameraTracker({ setCameraPosition }) {
  const { camera } = useThree();
  useFrame(() => {
    setCameraPosition([camera.position.x, camera.position.y, camera.position.z]);
  });
  return null;
}

// -----------------------------------------------------------------------------
// CustomMouseLook Component: Uses pointer lock and sums mouse movement deltas.
function CustomMouseLook({ sensitivity = 0.005 }) {
  const { camera, gl } = useThree();
  const yawRef = useRef(0); // left/right rotation
  const pitchRef = useRef(0); // up/down rotation
  const isLocked = useRef(false);

  const onMouseMove = (e) => {
    if (!isLocked.current) return;
    yawRef.current -= e.movementX * sensitivity;
    pitchRef.current -= e.movementY * sensitivity;
    pitchRef.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitchRef.current));
  };

  useEffect(() => {
    const handleClick = () => {
      gl.domElement.requestPointerLock();
    };
    gl.domElement.addEventListener("click", handleClick);

    const handlePointerLockChange = () => {
      isLocked.current = document.pointerLockElement === gl.domElement;
    };
    document.addEventListener("pointerlockchange", handlePointerLockChange);
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      gl.domElement.removeEventListener("click", handleClick);
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [gl.domElement, sensitivity]);

  useFrame(() => {
    camera.rotation.order = "YXZ";
    camera.rotation.y = yawRef.current;
    camera.rotation.x = pitchRef.current;
  });

  return null;
}

// -----------------------------------------------------------------------------
// Main CarRoom Component
function CarRoom() {
  const commonPreset = useMemo(
    () => ({
      position: [0, 0.8, 9],
      rotation: [0, 0, 0],
      scale: 1,
      emissiveIntensity: 0.4,
      emissiveColor: 0.01,
    }),
    []
  );

  const rowXPositions = useMemo(() => [-4.5, 2.5], []);
  const zSpacing = 6;

  const carsConfig = useMemo(
    () => [
      {
        id: "ferrari-f50",
        name: "Ferrari F50",
        url: "/3d-assets/ferrari_f50_1995/scene.gltf",
        scaleMultiplier: 1,
      },
      {
        id: "bmw-m3-gtr",
        name: "BMW M3 GTR",
        url: "/3d-assets/2001__bmw_m3_gtr_e46_special_thanks_for_1.3k/scene.gltf",
        scaleMultiplier: 0.9,
        rotationOffset: [0, -1.37, 0],
      },
      {
        id: "mclaren-f1",
        name: "McLaren F1",
        url: "/3d-assets/mclaren_f1_lm/scene.gltf",
        scaleMultiplier: 0.23,
      },
      {
        id: "porsche-918-spyder-2015",
        name: "Porsche 918 Spyder 2015",
        url: "/3d-assets/porsche_918_spyder_2015__www.vecarz.com/scene.gltf",
        scaleMultiplier: 0.9,
      },
      {
        id: "ferrari-f40",
        name: "Ferrari F40",
        url: "/3d-assets/ferrari_f40/scene.gltf",
        scaleMultiplier: 1.1,
      },
      {
        id: "ferrari-fxx-evo",
        name: "Ferrari FXX Evo",
        url: "/3d-assets/2008_ferrari_fxx_evolution/scene.gltf",
        scaleMultiplier: 100,
      },
      {
        id: "1998-porsche-911-gt1-straenversion",
        name: "1998 Porsche 911 GT1 Straßenversion",
        url: "/3d-assets/1998_porsche_911_gt1_straenversion/scene.gltf",
        scaleMultiplier: 108,
      },
      {
        id: "2007-koenigsegg-ccgt-gt1",
        name: "2007 Koenigsegg CCGT GT1",
        url: "/3d-assets/2007_koenigsegg_ccgt_gt1/scene.gltf",
        scaleMultiplier: 108,
      },
      {
        id: "2022-bmw-m4-gt3",
        name: "2022 BMW M4 GT3",
        url: "/3d-assets/2022_bmw_m4_gt3/scene.gltf",
        scaleMultiplier: 108,
      },
      {
        id: "honda-nsx-r",
        name: "Honda NSX-R",
        url: "/3d-assets/honda_nsx-r/scene.gltf",
        scaleMultiplier: 2,
        rotationOffset: [0, -1.56, 0],
      },
    ],
    []
  );

  const computeCarProps = useCallback(
    (car, row, col, rowCount) => {
      const finalX = rowXPositions[row];
      const baseZ = commonPreset.position[2];
      const finalZ = baseZ + (col - (rowCount - 1) / 2) * zSpacing;
      const finalY = commonPreset.position[1];

      const finalPos = [
        finalX + (car.positionOffset ? car.positionOffset[0] : 0),
        finalY + (car.positionOffset ? car.positionOffset[1] : 0),
        finalZ + (car.positionOffset ? car.positionOffset[2] : 0),
      ];

      const finalRot = commonPreset.rotation.map((r, i) => {
        const offset = car.rotationOffset ? car.rotationOffset[i] || 0 : 0;
        return r + offset;
      });

      return {
        ...car,
        row,
        baseScale: car.baseScale !== undefined ? car.baseScale : commonPreset.scale,
        position: finalPos,
        rotation: finalRot,
        emissiveIntensity: commonPreset.emissiveIntensity,
        emissiveColor: commonPreset.emissiveColor,
        showControls: false,
        center: null,
      };
    },
    [commonPreset, rowXPositions, zSpacing]
  );

  const initializeRowCars = useCallback(
    (carsArray) => {
      const total = carsArray.length;
      const row0Count = Math.ceil(total / 2);
      return carsArray.map((car, index) => {
        let row, col, rowCount;
        if (index < row0Count) {
          row = 0;
          col = index;
          rowCount = row0Count;
        } else {
          row = 1;
          col = index - row0Count;
          rowCount = total - row0Count;
        }
        return computeCarProps(car, row, col, rowCount);
      });
    },
    [computeCarProps]
  );

  const [cars, setCars] = useState(() => initializeRowCars(carsConfig));
  const [brightness, setBrightness] = useState(0.5);
  const [bloomIntensity, setBloomIntensity] = useState(0);
  const [luminanceThreshold, setLuminanceThreshold] = useState(0);
  const [luminanceSmoothing, setLuminanceSmoothing] = useState(0);
  const [cameraPosition, setCameraPosition] = useState([0, 0, 0]);
  const [showControlPanel, setShowControlPanel] = useState(false);

  const resetAllCars = useCallback(() => {
    setCars((prevCars) => {
      const total = prevCars.length;
      const row0Count = Math.ceil(total / 2);
      return prevCars.map((car, index) => {
        let row, col, rowCount;
        if (index < row0Count) {
          row = 0;
          col = index;
          rowCount = row0Count;
        } else {
          row = 1;
          col = index - row0Count;
          rowCount = total - row0Count;
        }
        return computeCarProps(car, row, col, rowCount);
      });
    });
  }, [computeCarProps]);

  const resetCar = useCallback(
    (id) => {
      setCars((prevCars) => {
        const total = prevCars.length;
        const row0Count = Math.ceil(total / 2);
        return prevCars.map((car, index) => {
          if (car.id !== id) return car;
          let row, col, rowCount;
          if (index < row0Count) {
            row = 0;
            col = index;
            rowCount = row0Count;
          } else {
            row = 1;
            col = index - row0Count;
            rowCount = total - row0Count;
          }
          return computeCarProps(car, row, col, rowCount);
        });
      });
    },
    [computeCarProps]
  );

  const updateCar = useCallback((id, updatedProps) => {
    setCars((prevCars) =>
      prevCars.map((car) => (car.id === id ? { ...car, ...updatedProps } : car))
    );
  }, []);

  const setActiveCar = useCallback((id) => {
    setCars((prevCars) =>
      prevCars.map((car) => ({ ...car, showControls: car.id === id }))
    );
  }, []);

  const studioBounds = useMemo(
    () =>
      new THREE.Box3(
        new THREE.Vector3(-7, -10, -19),
        new THREE.Vector3(5, 10, 30)
      ),
    []
  );

  const fullscreenContainerRef = useRef();

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement && fullscreenContainerRef.current) {
      fullscreenContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Fullscreen and control panel toggle buttons placed above the canvas */}
      <div
        style={{
          width: "60vw",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <button
          onClick={toggleFullScreen}
          style={{
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          Fullscreen
        </button>
        <button
          onClick={() => setShowControlPanel((prev) => !prev)}
          style={{
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          {showControlPanel ? "Hide" : "Show"} Control Panel
        </button>
      </div>

      <div
        ref={fullscreenContainerRef}
        style={{ position: "relative", width: "60vw", height: "70vh" }}
      >
        <Canvas
          style={{ width: "100%", height: "100%", background: "black" }}
          camera={{ position: [0, 1.5, 28], fov: 70 }}
          gl={{ toneMapping: THREE.NoToneMapping, localClippingEnabled: true }}
        >
          {/* Wrap Canvas children with Suspense and use our LoadingOverlay as fallback */}
          <Suspense fallback={<LoadingOverlay />}>
            <CustomMouseLook />
            <BackgroundSheet />
            <ambientLight intensity={brightness} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Showroom />
            {cars.map((car) => (
              <CarModel
                key={car.id}
                url={car.url}
                scale={car.baseScale * (car.scaleMultiplier || 1)}
                position={car.position}
                rotation={car.rotation}
                emissiveIntensity={car.emissiveIntensity}
                emissiveColor={car.emissiveColor}
                onCarClick={() => setActiveCar(car.id)}
                onLoadCenter={(center) => updateCar(car.id, { center })}
                rotationSpeed={car.row === 0 ? 0.5 : -0.5}
              />
            ))}
            <CarLabels cars={cars} />
            <FirstPersonMovement speed={5} bounds={studioBounds} />
            <CameraTracker setCameraPosition={setCameraPosition} />
            <EffectComposer>
              <Bloom
                luminanceThreshold={luminanceThreshold}
                luminanceSmoothing={luminanceSmoothing}
                intensity={bloomIntensity}
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      {/* Control Panel Section */}
      {showControlPanel && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            color: "white",
            padding: "10px",
            width: "90vw",
          }}
        >
          {cars
            .filter((car) => car.showControls)
            .map((car) => (
              <CarControlPanel
                key={car.id}
                car={car}
                updateCar={updateCar}
                resetCar={resetCar}
              />
            ))}
          <div style={{ flex: 1, border: "1px solid white", padding: "10px" }}>
            <h3>Scene Effects</h3>
            <label>
              Brightness:{" "}
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={brightness}
                onChange={(e) => setBrightness(parseFloat(e.target.value))}
              />
            </label>
            <br />
            <label>
              Bloom Intensity:{" "}
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={bloomIntensity}
                onChange={(e) => setBloomIntensity(parseFloat(e.target.value))}
              />
            </label>
            <br />
            <label>
              Luminance Threshold:{" "}
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={luminanceThreshold}
                onChange={(e) =>
                  setLuminanceThreshold(parseFloat(e.target.value))
                }
              />
            </label>
            <br />
            <label>
              Luminance Smoothing:{" "}
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={luminanceSmoothing}
                onChange={(e) =>
                  setLuminanceSmoothing(parseFloat(e.target.value))
                }
              />
            </label>
            <br />
            <pre style={{ color: "white", marginTop: "10px" }}>
              {JSON.stringify(
                {
                  brightness,
                  bloomIntensity,
                  luminanceThreshold,
                  luminanceSmoothing,
                },
                null,
                2
              )}
            </pre>
            <button
              onClick={resetAllCars}
              style={{ marginTop: "10px", padding: "10px", cursor: "pointer" }}
            >
              Reset All Cars
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarRoom;
