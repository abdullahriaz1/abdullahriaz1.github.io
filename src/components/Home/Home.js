import React from 'react'
import picture from './picture.PNG'
import Projects from '../Projects/Projects.js'
import Header from '../Header.js'
import Contact from '../Contact/Contact.js'
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
        textAlign: 'left'
      }}>
        <div class="home-intro-text">
          <h1>Hello, I'm Abdullah Riaz!</h1>
          <p>
          I'm a third year Computer Engineering student at the University of California, Santa Cruz.
          </p>
        </div>

        
          
      </div>
      <hr></hr>
      <Projects></Projects>
      <hr></hr>
      <div style={{display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'left', 
        paddingTop: '100px',
        paddingBottom: '100px'}}>
        <h2>Skills</h2>
        <p>
        Languages: Python, C, C++, Java, JavaScript, HTML/CSS, SQL<br/>
        Frameworks: React, Node.js, Flask, Java Spring, WordPress, Linux, Scrum, Agile<br/>
        Developer Tools: Git, Docker, VS Code, Visual Studio Code, IntelliJ IDEA<br/>
        Libraries: Pandas, NumPy, Matplotlib, NetworkX<br/>
        </p>
      </div>
      <hr></hr>
      <Contact></Contact>
    </div>
  )
}

export default Home