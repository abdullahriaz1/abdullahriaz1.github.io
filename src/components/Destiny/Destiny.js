import React, { useEffect, useState, useRef } from 'react';
import { useSprings, animated, config, to } from '@react-spring/web';

// --- Optional: Force re-renders (if needed for other animations) ---
function useIntervalRender() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 16); // roughly 60fps
    return () => clearInterval(interval);
  }, []);
}

// --- Circles Component (unchanged) ---
function Circles() {
  return (
    <>
      <span className="circle circle--1" />
      <span className="circle circle--2" />
      <span className="circle circle--3" />
      <span className="circle circle--4" />
    </>
  );
}

// --- Animated Line Group ---
// Now accepts x, y, and rotation, and applies a combined transform.
function AnimatedLineGroup({ groupClass, springProps }) {
  return (
    <animated.div
      className={`line-group ${groupClass}`}
      style={{
        transform: to(
          [springProps.x, springProps.y, springProps.rotation],
          (x, y, r) => `translate3d(${x}px, ${y}px, 0) rotate(${r}deg)`
        ),
      }}
    >
      <span className="line line--1" />
      <span className="line line--2" />
      <span className="line line--3" />
      <span className="line line--4" />
    </animated.div>
  );
}

// --- Animated Shape Group (unchanged) ---
function AnimatedShapeGroup({ shapes }) {
  return (
    <div className="shape-group">
      {shapes.map((springProps, index) => {
        const transform = to(
          [springProps.x, springProps.y, springProps.r],
          (x, y, r) => `translate3d(${x}rem, ${y}rem, 0) rotate(${r}deg)`
        );
        return (
          <animated.span
            key={index}
            className={`shape shape--${index + 1}`}
            style={{ transform }}
          />
        );
      })}
    </div>
  );
}

// --- Main Destiny Component ---
export default function Destiny() {
  // (Optional) force re-renders if you need them for other animations
  useIntervalRender();

  // The container is 50rem x 50rem (with 1rem = 10px, that’s 500px)
  const containerSize = 500;

  // --- Line Groups: 3 total ---
  // Each group has x, y, and rotation.
  const [lineSprings, lineApi] = useSprings(3, () => ({
    x: Math.random() * containerSize,
    y: Math.random() * containerSize,
    rotation: Math.random() * 360,
    config: { mass: 1, tension: 170, friction: 26 },
  }));

  // Set up velocities (in pixels per frame, and degrees per frame for rotation)
  const velocitiesRef = useRef(
    Array.from({ length: 3 }, () => ({
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      vr: (Math.random() - 0.5) * 2,
    }))
  );

  // Use a requestAnimationFrame loop to update positions and bounce them.
  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      lineApi.start((index, curr) => {
        // Get current values (using .get() from the animated value)
        const { x, y, rotation } = curr;
        let newX = x.get();
        let newY = y.get();
        let newRotation = rotation.get();

        // Retrieve velocities for this group
        const { vx, vy, vr } = velocitiesRef.current[index];

        // Update positions and rotation
        newX += vx;
        newY += vy;
        newRotation += vr;

        // Bounce off the container edges (assume container from 0 to containerSize)
        if (newX < 0 || newX > containerSize) {
          velocitiesRef.current[index].vx *= -1;
          newX = Math.max(0, Math.min(newX, containerSize));
        }
        if (newY < 0 || newY > containerSize) {
          velocitiesRef.current[index].vy *= -1;
          newY = Math.max(0, Math.min(newY, containerSize));
        }

        return { x: newX, y: newY, rotation: newRotation, immediate: true };
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [lineApi, containerSize]);

  // --- Shapes: 4 total (continue to randomize every 2 seconds) ---
  const [shapeSprings, shapeApi] = useSprings(4, () => ({
    x: 0,
    y: 0,
    r: 0,
    config: config.gentle,
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      shapeApi.start(() => ({
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 30,
        r: Math.random() * 360,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [shapeApi]);

  return (
    <>
      <style>{`
        /* Global Styles */
        html, body {
          margin: 0; 
          padding: 0;
        }
        html { font-size: 10px; }
        body {
          font-family: sans-serif;
          background: radial-gradient(#f9f9f9, #989898);
        }
        main {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
        }
        .the-cade-6-unit-dank-af-anmation {
          width: 50rem;
          height: 50rem;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .circle {
          border: 1px solid #666;
          border-radius: 50%;
          position: absolute;
          transition: width 1s ease, height 1s ease, opacity 1s ease;
        }
        .circle--1 {
          width: calc(50rem - 50%);
          height: calc(50rem - 50%);
          opacity: 0.4;
        }
        .circle--2 {
          width: calc(50rem - 56%);
          height: calc(50rem - 56%);
          opacity: 0.6;
        }
        .circle--3 {
          width: calc(50rem - 44%);
          height: calc(50rem - 44%);
          opacity: 0.6;
        }
        .circle--4 {
          width: calc(50rem - 50%);
          height: calc(50rem - 50%);
          opacity: 0.4;
        }
        .line {
          width: 1px;
          height: 100%;
          position: absolute;
          background: linear-gradient(
            transparent 0%, 
            #666 40%, 
            #666 60%, 
            transparent 100%
          );
        }
        .line-group {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          width: calc(50rem / 2.25);
          height: 50rem;
          transform-origin: 50% 50%;
        }
        /* The positioning of each line within a group */
        .line-group--1 .line--1 { left: 0%; }
        .line-group--1 .line--2 { left: 33%; }
        .line-group--1 .line--3 { left: 67%; }
        .line-group--1 .line--4 { left: 100%; }
        .line-group--2 .line--1 { left: 0%; }
        .line-group--2 .line--2 { left: 33%; }
        .line-group--2 .line--3 { left: 67%; }
        .line-group--2 .line--4 { left: 100%; }
        .line-group--3 {
          width: calc(50rem / 2.8);
        }
        .line-group--3 .line--1 { left: 0%; }
        .line-group--3 .line--2 { left: 33%; }
        .line-group--3 .line--3 { left: 67%; }
        .line-group--3 .line--4 { left: 100%; }
        .shape-group {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          width: calc(50rem - 50%);
          height: 50rem;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transform-origin: 50% 50%;
        }
        .shape {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: calc(50rem / 4.51);
          height: calc(50rem / 4.51);
          border: 1px solid #666;
          top: 50%;
          left: 50%;
        }
      `}</style>

      <main>
        <div className="the-cade-6-unit-dank-af-anmation">
          <Circles />
          <AnimatedLineGroup
            groupClass="line-group--1"
            springProps={lineSprings[0]}
          />
          <AnimatedLineGroup
            groupClass="line-group--2"
            springProps={lineSprings[1]}
          />
          <AnimatedLineGroup
            groupClass="line-group--3"
            springProps={lineSprings[2]}
          />
          <AnimatedShapeGroup shapes={shapeSprings} />
        </div>
      </main>
    </>
  );
}
