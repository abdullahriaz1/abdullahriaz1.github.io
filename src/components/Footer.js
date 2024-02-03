import React from 'react'
import {Link} from 'react-router-dom'
function Footer() {
  return (
    <div className="footer">
      <Link to="https://www.linkedin.com/in/abdullah-riaz-ucsc/">
      <button className="button">LinkedIn</button>
      </Link>
      <Link to="https://github.com/abdullahriaz1">
      <button className="button">GitHub</button>
      </Link>
      <Link to="https://leetcode.com/ariaz988/">
      <button className="button">LeetCode</button>
      </Link>
    </div>
  )
}

export default Footer