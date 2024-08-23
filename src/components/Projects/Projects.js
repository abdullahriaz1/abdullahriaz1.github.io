import React from 'react';
import { Link } from 'react-router-dom';

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
        padding: '20px'
      }}>
        <h1>Projects</h1>
      </div>
      
      <div className="projects">
        {/* New Projects */}
        <div className="project">
          <Link className="link" to="https://github.com/Samintha-C/CSE144-G9" style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
            DermaAI
          </Link>
          <br />
          Skin ailment classification with 82% accuracy using Vision Transformers and CNN, integrated into a web app for diagnoses.
        </div>
        <div className="project">
          <Link className="link" to="https://github.com/abdullahriaz1/trading-engine" style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
            Trading Engine
          </Link>
          <br />
          Multi-threaded order matching engine for simulated financial markets, built with C++ for parallel processing.
        </div>
        <div className="project">
          <Link className="link" to="https://github.com/dhsieh4/CSE138_Assignment4" style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
            ScaleKVS
          </Link>
          <br />
          Replicated key-value store with sharding for improved fault tolerance and throughput, featuring a robust API.
        </div>
        <div className="project">
          <Link className="link" to="https://github.com/Agora-Pixel" style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
            Flux Analytics
          </Link>
          <br />
          Full-stack analytics platform for e-commerce, with data collection, processing, and visualization using React.js and Java Spring.
        </div>
        
        {/* Existing Projects */}
        
        <div className="project">
          <Link className="link" to="https://bpb-us-e2.wpmucdn.com/faculty.sites.uci.edu/dist/8/913/files/2023/01/symposium22-Jake-Smith-GraphCookieSyncDetection.pdf" style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
            Research @ UC Davis
          </Link>
          <br />
          Researched algorithms for Cookie Syncing Detection to enhance data privacy.
        </div>
        
        <div className="project">
          <Link className="link" to="https://github.com/KamalShamsi/Smart-Budget" style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
            Smart Budget Web App
          </Link>
          <br />
          Budgeting dashboard designed for personal finance management.
        </div>
        <div className="project">
          <Link className="link" to="https://github.com/abdullahriaz1/http-file-server" style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
            Multithreaded HTTP File Server
          </Link>
          <br />
          Efficient C-based HTTP file server supporting concurrent GET/PUT requests.
        </div>
        <div className="project">
          <Link className="link" to="https://github.com/kalinsley/Versify" style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
            Versify
          </Link>
          <br />
          iOS app for connecting music enthusiasts through community playlists.
        </div>
        <div className="project">
          <Link className="link" to="https://github.com/abdullahriaz1/stocks" style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
            Stock Price Manager
          </Link>
          <br />
          CLI tool for tracking and managing stock investments.
        </div>
        <div className="project">
          <Link className="link" to="https://github.com/abdullahriaz1/nqueens" style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
            N-Queens Problem
          </Link>
          <br />
          Algorithm for solving the N-Queens problem without recursion.
        </div>
        <div className="project">
          <Link className="link" to="https://github.com/abdullahriaz1/six-degrees-of-kevin-bacon" style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
            Shortest Path in Social Network
          </Link>
          <br />
          C++ algorithm for finding the shortest path between actors in a movie network.
        </div>
        <div className="project">
          <Link className="link" to="https://github.com/abdullahriaz1/cache-simulator" style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
            Cache Simulator
          </Link>
          <br />
          C-based cache simulator supporting FIFO, LRU, and clock eviction policies.
        </div>
        
      </div>
    </div>
  );
}

export default Projects;
