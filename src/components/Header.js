import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (

    <div className="header">
      <a href="/#home">
        <button className="button">Home</button>
      </a>
      <a href="/#projects">
        <button className="button">Projects</button>
      </a>
      <a href='/#skills'>
        <button className='button'>Skills</button>
      </a>
      <a href="/#contact">
        <button className="button">Contact</button>
      </a>
      
    </div>
    
  )
}

export default Header