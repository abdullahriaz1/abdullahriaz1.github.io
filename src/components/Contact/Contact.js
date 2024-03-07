import React from 'react';
import picture from './globe.png';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import { Button } from '@mui/material';

function Contact() {
  const button_size = 100;
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
        <h1>Let's Connect!</h1>
      </div>

      <div className='contact-sections' style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '40px',
        textAlign: 'center',
        padding: '10px',
        width:'100%'
      }}>


          <a href="https://www.linkedin.com/in/abdullah-riaz-ucsc/" target='_blank'>
            <Button>
              <LinkedInIcon />
            </Button>
          </a>

          <a href="mailto:abdullahriaz03@outlook.com" target='_blank'>
            <Button>
              <EmailIcon />
            </Button>
          </a>

          <a href="https://github.com/abdullahriaz1" target='_blank'>
            <Button>
              <GitHubIcon />
            </Button>
          </a>
        </div>
      </div>

  )
}

export default Contact;