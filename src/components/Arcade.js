import React, { useState } from 'react';
import Gallery from './Gallery.js';
import Chess from './Chess/ChessGame.js';
import CarRoom from './CarRoom.js';
import MusicPlayer from './MusicPlayer.js';

function Arcade() {
  // Array of subcomponents with a display name for each
  const subcomponents = [
    { name: 'Car Room', component: <CarRoom /> },
    { name: 'Gallery', component: <Gallery /> },
    { name: 'Chess', component: <Chess /> },
    { name: 'Music Player', component: <MusicPlayer /> },
  ];

  // Track the active subcomponent index
  const [activeIndex, setActiveIndex] = useState(0);

  // Function to slide to the previous component (wrap around to the end)
  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? subcomponents.length - 1 : prevIndex - 1
    );
  };

  // Function to slide to the next component (wrap around to the beginning)
  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === subcomponents.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div
      className="arcade"
      style={{paddingTop:'30px', 
      }}
    >
      {/* Frame that holds the active component */}
      <div
        style={{
        }}
      >
        <h1 style={{textAlign: 'center', paddingBottom: '30px'}}>Arcade</h1>
        {/* Row with sliders and title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            gap: '30px'
          }}
        >
          <button onClick={handlePrev} style={{ fontSize: '1.5rem', marginRight: '10px' }}>
            ◀
          </button>
          <p style={{ margin: '0 10px' }}>{subcomponents[activeIndex].name}</p>
          <button onClick={handleNext} style={{ fontSize: '1.5rem', marginLeft: '10px' }}>
            ▶
          </button>
        </div>

        {/* Active Component */}
        <div style={{ textAlign: 'center' }}>
          {subcomponents[activeIndex].component}
        </div>
      </div>
    </div>
  );
}

export default Arcade;
