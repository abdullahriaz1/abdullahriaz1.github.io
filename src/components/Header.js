import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <div className="header">
      <Link to="/">
        <button className="button">Home</button>
      </Link>
      <Link to="/about">
        <button className="button">About</button>
      </Link>
      <Link to="/experience">
        <button className="button">Experience</button>
      </Link>
      <Link to="/projects">
        <button className="button">Projects</button>
      </Link>
    </div>
    
  )
}

export default Header