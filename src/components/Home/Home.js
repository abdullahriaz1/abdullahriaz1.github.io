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
              A computer engineering student at UCSC with a passion for the cutting edge. 
          </p>
        </div>

        <div class="home-img">
          <div class="grow" >
            <div class="border">
              <img src={picture} alt="Me at UCSC " 
                width="90%" height=""/>
            </div>
          </div>
        </div>
        
          
      </div>
      <div style={{display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center', paddingTop: '100px'}}>
        <h2>Skills</h2>
        <p>
        Languages: C, C++, Python, Java, JavaScript, HTML, CSS, SQL<br/>
        Tools/Frameworks: React.js, Node.js, Flask, Java Spring, Linux, Git, TCP/IP, HTTP/S, REST
        </p>
      </div>
      <hr></hr>
      <Projects></Projects>
      <hr></hr>
      <Contact></Contact>
    </div>
  )
}

export default Home