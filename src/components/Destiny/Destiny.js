import React, { useEffect } from 'react';
import { useSprings, animated } from '@react-spring/web';

//
// 1) Animated Line Group Component
//
function AnimatedLineGroup({ groupClass, rotation }) {
  return (
    <animated.div
      className={`line-group ${groupClass}`}
      style={{
        transform: rotation.to(r => `rotate(${r}deg)`),
      }}
    >
      <span className="line line--1" />
      <span className="line line--2" />
      <span className="line line--3" />
      <span className="line line--4" />
    </animated.div>
  );
}

//
// 2) Animated Shape Group Component
//
function AnimatedShapeGroup({ shapes }) {
  return (
    <div className="shape-group">
      {shapes.map((props, index) => (
        <animated.span
          key={index}
          className={`shape shape--${index + 1}`}
          style={{
            transform: props.x.to(
              (x, y, r) =>
                `translate3d(${x}rem, ${y}rem, 0) rotate(${r}deg)`
            ),
          }}
        />
      ))}
    </div>
  );
}

//
// 3) Main Destiny Component
//
export default function Destiny() {
  // --- Line Rotation Animations (3 groups) ---
  const [lineSprings, lineApi] = useSprings(3, () => ({
    rotation: Math.random() * 360, // Start at random angle
    config: { tension: 80, friction: 10 },
  }));

  // --- Shape Transform Animations (4 shapes) ---
  const [shapeSprings, shapeApi] = useSprings(4, () => ({
    x: (Math.random() - 0.5) * 30, // Start at random positions
    y: (Math.random() - 0.5) * 30,
    r: Math.random() * 360,
    config: { tension: 50, friction: 20 },
  }));

  // --- Update Animations Every 1s ---
  useEffect(() => {
    const interval = setInterval(() => {
      lineApi.start(index => ({
        rotation: Math.random() * 360, // New random angle
      }));

      shapeApi.start(index => ({
        x: (Math.random() - 0.5) * 30, // Random positions
        y: (Math.random() - 0.5) * 30,
        r: Math.random() * 360, // Random rotation
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [lineApi, shapeApi]);

  return (
    <>
      <style>{`
        /* ----- Global Page Style ----- */
        html, body {
          margin: 0; 
          padding: 0;
        }
        html {
          font-size: 10px;
        }
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

        /* ----- Container ----- */
        .the-cade-6-unit-dank-af-anmation {
          width: 50rem;
          height: 50rem;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ----- Line Groups ----- */
        .line {
          width: 1px;
          height: 100%;
          position: absolute;
          background: linear-gradient(transparent 0%, #666 40%, #666 60%, transparent 100%);
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

        /* ----- Shape Group ----- */
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
          width: calc(50rem / 4.51);
          height: calc(50rem / 4.51);
          border: 1px solid #666;
        }
      `}</style>

      <main>
        <div className="the-cade-6-unit-dank-af-anmation">
          {/* 3 animated line groups */}
          <AnimatedLineGroup
            groupClass="line-group--1"
            rotation={lineSprings[0].rotation}
          />
          <AnimatedLineGroup
            groupClass="line-group--2"
            rotation={lineSprings[1].rotation}
          />
          <AnimatedLineGroup
            groupClass="line-group--3"
            rotation={lineSprings[2].rotation}
          />

          {/* 4 animated shapes */}
          <AnimatedShapeGroup shapes={shapeSprings} />
        </div>
      </main>
    </>
  );
}
