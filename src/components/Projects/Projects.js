import React from 'react'
import {Link} from 'react-router-dom'
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
        <div className="project">
        <Link className="link" to="https://bpb-us-e2.wpmucdn.com/faculty.sites.uci.edu/dist/8/913/files/2023/01/symposium22-Jake-Smith-GraphCookieSyncDetection.pdf" style={{ textDecoration: 'none' }}>
        Research @ UC Davis</Link> 
        <br/>
        <br/>
          Researched data-sharing and data privacy through 
          analysis of web crawls on the 
          top 100K websites and cataloging request chains.
          Results categorized behaviors associated with 
          Cookie Syncing which was used to develop an algorithm for Cookie Sync 
          Detection.
        </div>
        <div className="project">
        <Link className="link" to="https://github.com/Agora-Pixel" style={{ textDecoration: 'none' }}>
        Flux Analytics</Link> 
        <br/>
        <br/>
              Suite of website data analytics tools for website owners.
        </div>
        <div className="project">
        <Link className="link" to="https://github.com/KamalShamsi/Smart-Budget" style={{ textDecoration: 'none' }}>
        Smart Budget Web App</Link> 
        <br/>
        <br/>
              A budgeting dashboard for the savers.
        </div>
        <div className="project">
        <Link className="link" to="https://github.com/abdullahriaz1/http-file-server" style={{ textDecoration: 'none' }}>
        Multithreaded HTTP File Server</Link> 
        <br/>
        <br/>
            An HTTP File Server in 
            C, enabling efficient handling of GET/PUT requests.
        </div>
        <div className="project">
        <Link className="link" to="https://github.com/kalinsley/Versify" style={{ textDecoration: 'none' }}>
        Versify</Link>
        <br/>
        <br/>
              IOS app that connects music-listeners in similar 
              geographic regions, in this case UCSC colleges, 
              through the curation of community playlists. 
        </div>
        <div className="project">
        <Link className="link" to="https://github.com/abdullahriaz1/stocks" style={{ textDecoration: 'none' }}>
        Stock Price Manager</Link>
        <br/>
        <br/>
              CLI for tracking stock information so that 
              users can manage their investments.
        </div>
        <div className="project">
        <Link className="link" to="https://github.com/abdullahriaz1/nqueens" style={{ textDecoration: 'none' }}>
        N-Queens Problem</Link>
        <br/>
        <br/>
              Implementation of algorithm to solve N-Queens Problem with preplaced queens and no recursion.
        </div>
        <div className="project">
        <Link className="link" to="https://github.com/abdullahriaz1/six-degrees-of-kevin-bacon" style={{ textDecoration: 'none' }}>
        Six Degrees of Kevin Bacon Problem</Link>
        <br/>
        <br/>
              Created C++ algorithm to find shortest path of connections between Hollywood actors where a connection exists if two actors are in the same movie.
        </div>
        <div className="project">
        <Link className="link" to="https://github.com/abdullahriaz1/cache-simulator" style={{ textDecoration: 'none' }}>
        Cache Simulator</Link>
        <br/>
        <br/>
              Developed a cache simulator in C that supports FIFO, LRU, and clock eviction policies.
        </div>
      </div>
      
    </div>
  )
}

export default Projects