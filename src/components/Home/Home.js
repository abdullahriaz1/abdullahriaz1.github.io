import React from 'react'
import picture from './picture.PNG'
import Projects from '../Projects/Projects.js'
import Header from '../Header.js'
import Contact from '../Contact/Contact.js'
import Skills from '../Skills.js'
function Home() {
  return (
    <div className="home"id="home" >
      <Header />
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30px',
        textAlign: 'center'
      }}>
        <div class="home-intro-text">
          <h1>Hello, I'm Abdullah Riaz!</h1>
          <p>
          Software Engineer
          <br/>
          Computer Engineering B.S. - UC Santa Cruz, Dec. 2024
          </p>
        </div>

        
          
      </div>
      <hr></hr>
      <Projects></Projects>
      <hr></hr>
      
      <Skills/>
      
      <hr></hr>
      <Contact></Contact>
    </div>
  )
}

export default Home