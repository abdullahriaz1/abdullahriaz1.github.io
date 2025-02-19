import React, { useState } from 'react';
import Gallery from './Gallery.js';
import Chess from './Chess/ChessGame.js';
import CarRoom from './CarRoom.js';
import MusicPlayer from './MusicPlayer.js';
import { IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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
  
  // State to toggle the visibility of the content
  const [showContent, setShowContent] = useState(false);

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
      style={{  alignItems: 'center', justifyContent: 'center', }}
    >
      <h1 style={{ textAlign: 'center', paddingBottom: '10px' }}>Arcade</h1>
      {/* Button to toggle the rest of the content */}
      <div
        className="button"
        style={{ width: '150px', textAlign: 'center', margin: '20px auto' }}
        onClick={() => setShowContent(!showContent)}
      >
        {showContent ? 'Quit Arcade' : 'Enter Arcade'}
      </div>

      {showContent && (
        <div>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px' }}>
              <IconButton onClick={handlePrev} size="large" style={{color:"white"}}>
                <ArrowBackIosNewIcon />
              </IconButton>
              <p style={{ margin: '0 10px' }}>{subcomponents[activeIndex].name}</p>
              <IconButton onClick={handleNext} size="large" style={{color:"white"}}>
                <ArrowForwardIosIcon />
              </IconButton>
            </div>
          </div>

          {/* Active Component */}
          <div style={{ }}>
            {subcomponents[activeIndex].component}
          </div>
        </div>
      )}
    </div>
  );
}

export default Arcade;
