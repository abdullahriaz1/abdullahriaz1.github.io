import React from 'react'
import {Link} from 'react-router-dom'
function Projects() {
  return (
    <div>
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
      <div>
      <Link to="https://github.com/KamalShamsi/Smart-Budget">
      Smart Budget Web App</Link> 
        <ul>
          <li>
            Created a budget dashboard web app using Node.js 
            and React.js in a Scrum team.
          </li>
          <li>
            Developed the Frontend using React.js, incorporating 
            design principles to enhance UI.
          </li>
          <li>
            Utilized Node.js for the backend, enabling seamless 
            data retrieval and manipulation
          </li>
          <li>
            Features include income and expense tracking, budget
            forecasting, and data visualization
          </li>
        </ul>
      </div>
      <div>
      <Link to="https://github.com/abdullahriaz1/http-file-server">
      Multithreaded HTTP File Server</Link> 
        <ul>
          <li>
          Developed a robust multithreaded HTTP File Server in 
          C, enabling efficient handling of GET/PUT requests.
          </li>
          <li>
          Implemented multithreading using pthreads to process 
          multiple requests concurrently.
          </li>
          <li>
          Ensured reliability through comprehensive error 
          handling and adherence to design principles, clean 
          code, and unit testing.
          </li>
        </ul>
      </div>
      <div>
      <Link to="https://github.com/kalinsley/Versify">
      Versify</Link>
        <ul>
          <li>
            IOS app that connects music-listeners in similar 
            geographic regions, in this case UCSC colleges, 
            through the curation of community playlists. 
          </li>
          <li>
            Authorizes and connects each user to Spotify API in 
            order to create collaborative playlists that 
            correspond to geographical region.
          </li>
          <li>
          Implemented a robust userflow and touched up the UI in Swift
          </li>
        </ul>
      </div>
      <div>
      <Link to="https://github.com/abdullahriaz1/stocks">
      Stock Price Manager</Link>
        <ul>
          <li>
            Created software that tracks stock information, so that 
            users can manage their investments.
          </li>
          <li>
            Built database system using Python and SQL. 
          </li>
          <li>
            Retrieved market data from a public stock API, and 
            organized that data concisely in the terminal.
          </li>
        </ul>
      </div>
      <div>
      <Link to="https://github.com/abdullahriaz1/nqueens">
      N-Queens Problem</Link>
        <ul>
          <li>
            Created C++ algorithm to solve N-Queens Problem with preplaced Queens and no recursion.
            </li>
        </ul>
      </div>
      <div>
      <Link to="https://github.com/abdullahriaz1/six-degrees-of-kevin-bacon">
      Six Degrees of Kevin Bacon Problem</Link>
        <ul>
          <li>
            Created C++ algorithm to find shortest path of connections between Hollywood actors where a connection exists if two actors are in the same movie.
          </li>
        </ul>
      </div>
      <div>
      <Link to="https://github.com/abdullahriaz1/cache-simulator">
      Cache Simulator</Link>
        <ul>
          <li>
            Developed a cache simulator in C that supports FIFO, LRU, and clock eviction policies.
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Projects