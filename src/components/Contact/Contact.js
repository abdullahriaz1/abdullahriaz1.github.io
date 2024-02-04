import React from 'react'
import picture from './picture2.png'
function Contact() {
    
  return (
    <div id='contact' className='contact'>
      
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30px',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1>Contact</h1>
      </div>

      <div className='contact-sections'>

        <div class="contact-img">
          <div class="grow" >
            <div class="border">
              <img src={picture} alt="home" 
                width="90%" height=""/>
            </div>
          </div>
        </div>

        <div className='get-in-touch'>
          <h2>Let's Connect!</h2>
          I am happy to discuss my experiences with you, just send me a message on LinkedIn!
        </div>

      </div>
      
            
    </div>
  )
}

export default Contact