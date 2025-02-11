import React from 'react';

function Skills() {
  const skillsData = {
    skills: [
      {
        category: "Languages",
        items: ["Python", "C", "C++", "Java", "JavaScript", "HTML", "CSS", "SQL"]
      },
      {
        category: "Frameworks",
        items: ["React.js", "Node.js", "Express.js", "Flask", "Java Spring"]
      },
      {
        category: "Developer Tools",
        items: ["Git", "GitHub", "Linux", "Docker"]
      },
      {
        category: "Libraries",
        items: ["PyTorch", "Pandas", "NumPy"]
      }
    ]
  };

  return (
    <div
      id="skills"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'left',
        paddingTop: '80px',
        paddingBottom: '100px',
      }}
    >
      <h2>Skills</h2>

      <div className="skills-container">
        <div className="skills">
          {skillsData.skills.map((skill, index) => (
            <div className="skills-row" key={index}>
              <div className="skills-col left">{skill.category}</div>
              <div className="skills-col right">{skill.items.join(', ')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Skills;
