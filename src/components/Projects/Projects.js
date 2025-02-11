import React from 'react';
import { Link } from 'react-router-dom';

const projectsData = [
  {
    "name": "DermaAI",
    "description": "Skin ailment classification with 82% accuracy using Vision Transformers and CNN, integrated into a web app for diagnoses.",
    "link": "https://github.com/Samintha-C/CSE144-G9"
  },
  {
    "name": "Trading Engine",
    "description": "Multi-threaded order matching engine for simulated financial markets, built with C++ for parallel processing.",
    "link": "https://github.com/abdullahriaz1/trading-engine"
  },
  {
    "name": "ScaleKVS",
    "description": "Replicated key-value store with sharding for improved fault tolerance and throughput, featuring a robust API.",
    "link": "https://github.com/dhsieh4/CSE138_Assignment4"
  },
  {
    "name": "Flux Analytics",
    "description": "Full-stack analytics platform for e-commerce, with data collection, processing, and visualization using React.js and Java Spring.",
    "link": "https://github.com/Agora-Pixel"
  },
  {
    "name": "Research @ UC Davis",
    "description": "Researched algorithms for Cookie Syncing Detection to enhance data privacy.",
    "link": "https://bpb-us-e2.wpmucdn.com/faculty.sites.uci.edu/dist/8/913/files/2023/01/symposium22-Jake-Smith-GraphCookieSyncDetection.pdf"
  },
  {
    "name": "Smart Budget Web App",
    "description": "Budgeting dashboard designed for personal finance management.",
    "link": "https://github.com/KamalShamsi/Smart-Budget"
  },
  {
    "name": "Versify",
    "description": "iOS app for connecting music enthusiasts through community playlists.",
    "link": "https://github.com/kalinsley/Versify"
  },
  {
    "name": "Stock Price Manager",
    "description": "CLI tool for tracking and managing stock investments.",
    "link": "https://github.com/abdullahriaz1/stocks"
  },
  {
    "name": "Cache Simulator",
    "description": "C-based cache simulator supporting FIFO, LRU, and clock eviction policies.",
    "link": "https://github.com/abdullahriaz1/cache-simulator"
  }
];

function Projects() {
  return (
    <div id="projects">
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30px',
        textAlign: 'center',
        padding: '20px',
      }}>
        <h1>Projects</h1>
      </div>
      
      <div className="projects">
        {projectsData.map((project, index) => (
          <div key={index} className="project">
            <Link className="link" to={project.link} style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
              {project.name}
            </Link>
            <br />
            {project.description}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;