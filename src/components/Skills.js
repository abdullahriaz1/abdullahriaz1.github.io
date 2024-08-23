import React from 'react'

function Skills() {
  return (
    <div id='skills' style={{display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'left', 
      paddingTop: '80px',
      paddingBottom: '100px'}}>
      <h2>Skills</h2>

      <div className="skills-container">
      <div className="skills">
        <div className="skills-row">
          <div className="skills-col left">Languages</div>
          <div className="skills-col right">Python, C, C++, Java, JavaScript, HTML, CSS, SQL</div>
        </div>
        <div className="skills-row">
          <div className="skills-col left">Frameworks</div>
          <div className="skills-col right">React.js, Node.js, Express.js, Flask, Java Spring, Scrum, Agile</div>
        </div>
        <div className="skills-row">
          <div className="skills-col left">Developer Tools</div>
          <div className="skills-col right">Git, GitHub, Linux, Docker</div>
        </div>
        <div className="skills-row">
          <div className="skills-col left">Libraries</div>
          <div className="skills-col right">PyTorch, Transformers, Pandas, NumPy, Matplotlib, C++ Threads</div>
        </div>
      </div>
      </div>

      
    </div>
  )
}

export default Skills