import React, { useState, useMemo, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Generic CarModel component that loads and clones any model via useGLTF.
function CarModel({ url, scale, position, rotation, emissiveIntensity, emissiveColor, onCarClick }) {
  const { scene } = useGLTF(url);
  // Clone the scene so each instance is independent.
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  clonedScene.traverse((child) => {
    if (child.isMesh) {
      child.material.emissive = new THREE.Color(emissiveColor, emissiveColor, emissiveColor);
      child.material.emissiveIntensity = emissiveIntensity;
      child.material.toneMapped = false;
    }
  });

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        if (onCarClick) onCarClick();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <primitive object={clonedScene} scale={scale} position={position} rotation={rotation} />
    </group>
  );
}

function Showroom() {
  const { scene } = useGLTF("/3d-assets/studio_v1_for_car/scene.gltf");
  return <primitive object={scene} scale={1} />;
}

function CarRoom() {
  // Define row presets for common properties.
  const leftRowPreset = {
    position: [-2.2, 0.15, 0], // common x and y (base z=0)
    rotation: [0.18, 0.92, -0.11],
    scale: 0.5,
    emissiveIntensity: 0.4,
    emissiveColor: 0.01,
  };

  const rightRowPreset = {
    position: [1.2, 0.15, 0], // common x and y (base z=0)
    rotation: [0.18, -0.92, 0.11],
    scale: 0.6,
    emissiveIntensity: 0.1,
    emissiveColor: 0.01,
  };

  // Define the left row cars.
  const leftRowCars = [
    {
      id: "ferrari-f50",
      name: "Ferrari F50",
      url: "/3d-assets/ferrari_f50_1995/scene.gltf",
      preset: { ...leftRowPreset },
      rowSide: "left",
    },
    {
      id: "bmw-m3-gtr",
      name: "BMW M3 GTR",
      url: "/3d-assets/2001__bmw_m3_gtr_e46_special_thanks_for_1.3k/scene.gltf",
      // For the BMW, add a rotationOffset to rotate y by -1.59.
      preset: { ...leftRowPreset, rotationOffset: [-.17, -1.59, 0] },
      rowSide: "left",
    },
    {
      id: "mclaren-f1",
      name: "McLaren F1",
      url: "/3d-assets/mclaren_f1_1993_ruby/scene.gltf",
      preset: { ...leftRowPreset },
      rowSide: "left",
    },
    
  ];

  // Define the right row cars.
  const rightRowCars = [
    {
      id: "ferrari-f40",
      name: "Ferrari F40",
      url: "/3d-assets/ferrari_f40/scene.gltf",
      preset: { ...rightRowPreset },
      rowSide: "right",
    },
    {
      id: "ferrari-f40-2",
      name: "Ferrari F40-2",
      url: "/3d-assets/ferrari_f40/scene.gltf",
      preset: { ...rightRowPreset },
      rowSide: "right",
    },
    {
      id: "porsche-gt3-rs",
      name: "Porsche GT3 RS",
      url: "/3d-assets/porsche_gt3_rs/scene.gltf",
      preset: { ...rightRowPreset },
      rowSide: "right",
    },
  ];

  // Helper: Given a row of cars, compute each car's initial properties using the row preset.
  // Each car gets the same x,y position and rotation (plus any rotationOffset),
  // and its z position is offset by 1.8 * index.
  const initializeRowCars = (rowCars) =>
    rowCars.map((car, index) => {
      const basePos = car.preset.position; // [x, y, baseZ]
      const baseRot = car.preset.rotation;
      const rotationOffset = car.preset.rotationOffset || [0, 0, 0];
      const finalRot = [
        baseRot[0] + rotationOffset[0],
        baseRot[1] + rotationOffset[1],
        baseRot[2] + rotationOffset[2],
      ];
      return {
        ...car,
        scale: car.preset.scale,
        position: [basePos[0], basePos[1], basePos[2] + index * 1.8],
        rotation: finalRot,
        emissiveIntensity: car.preset.emissiveIntensity,
        emissiveColor: car.preset.emissiveColor,
        showControls: false,
      };
    });

  // Combine the rows into one cars array.
  const [cars, setCars] = useState(() => [
    ...initializeRowCars(leftRowCars),
    ...initializeRowCars(rightRowCars),
  ]);

  // Scene effects states (shared among all cars)
  const [brightness, setBrightness] = useState(0.5);
  const [bloomIntensity, setBloomIntensity] = useState(0.3);
  const [luminanceThreshold, setLuminanceThreshold] = useState(1);
  const [luminanceSmoothing, setLuminanceSmoothing] = useState(0.9);

  // New camera state: position and rotation.
  const [cameraPosition, setCameraPosition] = useState([5, 5, 10]);
  const [cameraRotation, setCameraRotation] = useState([0, 0, 0]);

  // Scene preset includes camera settings.
  const scenePreset = {
    brightness: 0.3,
    bloomIntensity: 1.1,
    luminanceThreshold: 2,
    luminanceSmoothing: 1,
    cameraPosition: [-0.775472465176633, 0.992834350577808, 3.9762112120794306],
    cameraRotation: [-0.24469023241542284, -0.18700763852215546, -0.046389607772840555],
  };

  // Ref for OrbitControls (camera)
  const controlsRef = useRef();
  // Ref for the canvas container (fullscreen)
  const containerRef = useRef();

  const applyScenePreset = () => {
    setBrightness(scenePreset.brightness);
    setBloomIntensity(scenePreset.bloomIntensity);
    setLuminanceThreshold(scenePreset.luminanceThreshold);
    setLuminanceSmoothing(scenePreset.luminanceSmoothing);
    setCameraPosition(scenePreset.cameraPosition);
    setCameraRotation(scenePreset.cameraRotation);
    if (controlsRef.current) {
      const cam = controlsRef.current.object;
      cam.position.set(...scenePreset.cameraPosition);
      cam.rotation.set(...scenePreset.cameraRotation);
    }
  };

  // Reset all cars in both rows to their row presets (with appropriate z offsets and rotation offsets).
  const resetAllCars = () => {
    setCars((prevCars) =>
      prevCars.map((car) => {
        const rowPreset = car.rowSide === "left" ? leftRowPreset : rightRowPreset;
        const rotationOffset = car.preset.rotationOffset || [0, 0, 0];
        const finalRot = [
          rowPreset.rotation[0] + rotationOffset[0],
          rowPreset.rotation[1] + rotationOffset[1],
          rowPreset.rotation[2] + rotationOffset[2],
        ];
        const basePos = rowPreset.position;
        // Get the index within the car's row.
        const rowCars = prevCars.filter((c) => c.rowSide === car.rowSide);
        const indexInRow = rowCars.findIndex((c) => c.id === car.id);
        return {
          ...car,
          scale: rowPreset.scale,
          position: [basePos[0], basePos[1], basePos[2] + indexInRow * 1.8],
          rotation: finalRot,
          emissiveIntensity: rowPreset.emissiveIntensity,
          emissiveColor: rowPreset.emissiveColor,
        };
      })
    );
  };

  // Reset a single car to its preset values.
  const resetCar = (id) => {
    setCars((prevCars) =>
      prevCars.map((car) => {
        if (car.id !== id) return car; // Leave other cars unchanged.
        const rowPreset = car.rowSide === "left" ? leftRowPreset : rightRowPreset;
        const rotationOffset = car.preset.rotationOffset || [0, 0, 0];
        const finalRot = [
          rowPreset.rotation[0] + rotationOffset[0],
          rowPreset.rotation[1] + rotationOffset[1],
          rowPreset.rotation[2] + rotationOffset[2],
        ];
        // Compute the car's index in its row.
        const rowCars = prevCars.filter((c) => c.rowSide === car.rowSide);
        const indexInRow = rowCars.findIndex((c) => c.id === car.id);
        return {
          ...car,
          scale: rowPreset.scale,
          position: [
            rowPreset.position[0],
            rowPreset.position[1],
            rowPreset.position[2] + indexInRow * 1.8,
          ],
          rotation: finalRot,
          emissiveIntensity: rowPreset.emissiveIntensity,
          emissiveColor: rowPreset.emissiveColor,
        };
      })
    );
  };

  // Call resetAllCars and applyScenePreset on mount.
  useEffect(() => {
    resetAllCars();
    applyScenePreset();
  }, []);

  // A helper to update a specific car’s state.
  const updateCar = (id, updatedProps) => {
    setCars((prevCars) =>
      prevCars.map((car) => (car.id === id ? { ...car, ...updatedProps } : car))
    );
  };

  // Set the clicked car's controls to visible and hide others.
  const setActiveCar = (id) => {
    setCars((prevCars) =>
      prevCars.map((car) => ({
        ...car,
        showControls: car.id === id,
      }))
    );
  };

  // Fullscreen toggle for the canvas container.
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Canvas Container with Fullscreen Button */}
      <div ref={containerRef} style={{ position: "relative", width: "90vw", height: "50vh" }}>
        <Canvas
          style={{ width: "100%", height: "100%", background: "#202024" }}
          camera={{ position: cameraPosition, fov: 50 }}
          gl={{ toneMapping: THREE.NoToneMapping }}
        >
          <ambientLight intensity={brightness} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Showroom />
          {cars.map((car) => (
            <CarModel
              key={car.id}
              url={car.url}
              scale={car.scale}
              position={car.position}
              rotation={car.rotation}
              emissiveIntensity={car.emissiveIntensity}
              emissiveColor={car.emissiveColor}
              onCarClick={() => setActiveCar(car.id)}
            />
          ))}
          <OrbitControls
            ref={controlsRef}
            onChange={() => {
              const cam = controlsRef.current.object;
              setCameraPosition([cam.position.x, cam.position.y, cam.position.z]);
              setCameraRotation([cam.rotation.x, cam.rotation.y, cam.rotation.z]);
            }}
          />
          <EffectComposer>
            <Bloom luminanceThreshold={luminanceThreshold} luminanceSmoothing={luminanceSmoothing} intensity={bloomIntensity} />
          </EffectComposer>
        </Canvas>
        {/* Fullscreen Button */}
        <button
          onClick={toggleFullScreen}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "8px 12px",
            cursor: "pointer",
            zIndex: 1,
          }}
        >
          Fullscreen
        </button>
      </div>

      {/* Controls Panel */}
      <div style={{ display: "flex", flexDirection: "row", gap: "20px", color: "white", padding: "10px", width: "90vw" }}>
        {/* Render the control panel for the active car */}
        {cars.filter((car) => car.showControls).map((car) => (
          <div key={car.id} style={{ flex: 1, border: "1px solid white", padding: "10px" }}>
            <h3>{car.name} Effects</h3>
            <label>
              Scale:{" "}
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={car.scale}
                onChange={(e) => updateCar(car.id, { scale: parseFloat(e.target.value) })}
              />
            </label>
            <br />
            <label>
              Position X:{" "}
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={car.position[0]}
                onChange={(e) =>
                  updateCar(car.id, { position: [parseFloat(e.target.value), car.position[1], car.position[2]] })
                }
              />
            </label>
            <br />
            <label>
              Position Y:{" "}
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={car.position[1]}
                onChange={(e) =>
                  updateCar(car.id, { position: [car.position[0], parseFloat(e.target.value), car.position[2]] })
                }
              />
            </label>
            <br />
            <label>
              Position Z:{" "}
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={car.position[2]}
                onChange={(e) =>
                  updateCar(car.id, { position: [car.position[0], car.position[1], parseFloat(e.target.value)] })
                }
              />
            </label>
            <br />
            <label>
              Rotation X:{" "}
              <input
                type="range"
                min="-3.14"
                max="3.14"
                step="0.01"
                value={car.rotation[0]}
                onChange={(e) =>
                  updateCar(car.id, { rotation: [parseFloat(e.target.value), car.rotation[1], car.rotation[2]] })
                }
              />
            </label>
            <br />
            <label>
              Rotation Y:{" "}
              <input
                type="range"
                min="-3.14"
                max="3.14"
                step="0.01"
                value={car.rotation[1]}
                onChange={(e) =>
                  updateCar(car.id, { rotation: [car.rotation[0], parseFloat(e.target.value), car.rotation[2]] })
                }
              />
            </label>
            <br />
            <label>
              Rotation Z:{" "}
              <input
                type="range"
                min="-3.14"
                max="3.14"
                step="0.01"
                value={car.rotation[2]}
                onChange={(e) =>
                  updateCar(car.id, { rotation: [car.rotation[0], car.rotation[1], parseFloat(e.target.value)] })
                }
              />
            </label>
            <br />
            <label>
              Emissive Intensity:{" "}
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={car.emissiveIntensity}
                onChange={(e) => updateCar(car.id, { emissiveIntensity: parseFloat(e.target.value) })}
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
                onChange={(e) => updateCar(car.id, { emissiveColor: parseFloat(e.target.value) })}
              />
            </label>
            <pre style={{ color: "white", marginTop: "10px" }}>
              {JSON.stringify(
                {
                  scale: car.scale,
                  position: car.position,
                  rotation: car.rotation,
                  emissiveIntensity: car.emissiveIntensity,
                  emissiveColor: car.emissiveColor,
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
        ))}
        {/* Scene Effects Controls (shared) */}
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
              onChange={(e) => setLuminanceThreshold(parseFloat(e.target.value))}
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
              onChange={(e) => setLuminanceSmoothing(parseFloat(e.target.value))}
            />
          </label>
          <br />
          <pre style={{ color: "white", marginTop: "10px" }}>
            {JSON.stringify(
              { brightness, bloomIntensity, luminanceThreshold, luminanceSmoothing, cameraPosition, cameraRotation },
              null,
              2
            )}
          </pre>
          <button onClick={applyScenePreset} style={{ marginTop: "10px", padding: "10px", cursor: "pointer" }}>
            Apply Scene Preset
          </button>
          <br />
          <button onClick={resetAllCars} style={{ marginTop: "10px", padding: "10px", cursor: "pointer" }}>
            Reset All Cars
          </button>
        </div>
      </div>
    </div>
  );
}

export default CarRoom;
