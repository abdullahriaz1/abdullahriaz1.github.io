import React from 'react';
import Header from '../Header.js';
import Projects from '../Projects/Projects.js';
import Skills from '../Skills.js';
import Contact from '../Contact/Contact.js';
import Arcade from '../Arcade.js'; // Import the new Arcade component

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
        <div className="home-intro-text" style={{paddingBottom: "40px"}}>
          <h1>Hello, I'm Abdullah Riaz!</h1>
          <p>
            Software Engineer Intern @ The Guestbook
            <br />
            UC Santa Cruz, Computer Engineering C/O 2025
          </p>
        </div>
      </div>

      <hr />

      {/* Render the Arcade component */}
      <Arcade />

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
