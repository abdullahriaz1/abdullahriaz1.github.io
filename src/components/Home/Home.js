import React from 'react'
import picture from './picture.PNG'
function Home() {
  return (
    <div className="home" >
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30px',
        textAlign: 'center'
      }}>
        <h2>Hello, I'm Abdullah Riaz!</h2>
        <img src={picture} alt="Me at UCSC" 
          width="50%" height=""/>
      </div>
      
      <div>
        <div>
          <p>
          
          </p>
          <p>
            I am a third year undergraduate student majoring in
            Computer Engineering at UC Santa Cruz. Beyond 
            school, I have pursued research in online data 
            privacy at the UC Davis CS Department and I am 
            the website manager for daviskidsklub.com. I am
            passionate about web development, 
            machine learning, and computer vision. In my free time 
            I enjoy working out, making music, and  exploring
            the great outdoors!
          </p>
        </div>
      </div>
      <div style={{display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'}}>
        Skills
        <p>
        C, C++, Python, Java, JavaScript, Swift, React.js, Node.js, SQL, 
        Git, Linux
        </p>
      </div>
    </div>
  )
}

export default Home