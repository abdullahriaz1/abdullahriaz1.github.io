import React from 'react';
import picture from './picture.PNG';
import Projects from '../Projects/Projects.js';
import Header from '../Header.js';
import Contact from '../Contact/Contact.js';
import Skills from '../Skills.js';
import Gallery from '../Gallery.js';
import Chess from '../Chess/ChessGame.js';
import Destiny from '../Destiny/Destiny.js';

function Home() {
  return (
    <div className="home" id="home">
      <Header />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '30px',
          textAlign: 'center'
        }}
      >
        <div className="home-intro-text">
          <h1>Hello, I'm Abdullah Riaz!</h1>
          <p>
            Software Engineer Intern @ The Guestbook
            <br />
            Computer Engineering B.S. with Minor in Computer Science - UC Santa Cruz, Dec. 2024
          </p>
        </div>
      </div>

      <hr />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '90%' }}>
          {/* <Gallery /> */}
        </div>
      </div>

      {/* Chess component centered horizontally */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {/* <Chess /> */}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {/* <Destiny /> */}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '90%' }}>
          <Projects />
        </div>
      </div>

      <hr />
      <Skills />
      <hr />
      <Contact />
    </div>
  );
}

export default Home;
