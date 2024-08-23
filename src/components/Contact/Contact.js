import React from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import { Button } from '@mui/material';

function Contact() {
  const button_size = 70;

  return (
    <div id='contact' className='contact'>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30px',
        textAlign: 'center',
        padding: '20px',
        paddingTop: '100px',
        paddingBottom: '50px'
      }}>
        <h1>Let's Connect!</h1>
      </div>

      <div className='contact-sections' style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '100px',
        textAlign: 'center',
        padding: '10px',
        paddingTop: '20px',
        paddingBottom: '175px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        

        <div className="contact-btn">
          <a href="mailto:abdullahriaz03@outlook.com" target="_blank" rel="noopener noreferrer">
            <Button>
              <EmailIcon className='contact-icon-email'style={{ fontSize: button_size}} />
            </Button>
          </a>
        </div>

        <div className="contact-btn">
          <a href="https://www.linkedin.com/in/abdullah-riaz-ucsc/" target="_blank" rel="noopener noreferrer">
            <Button>
              <LinkedInIcon className='contact-icon-linkedin'style={{ fontSize: button_size}} />
            </Button>
          </a>
        </div>

        <div className="contact-btn">
          <a href="https://github.com/abdullahriaz1" target="_blank" rel="noopener noreferrer">
            <Button>
              <GitHubIcon className='contact-icon'style={{ fontSize: button_size}} />
            </Button>
          </a>
        </div>

      </div>
    </div>
  );
}

export default Contact;
