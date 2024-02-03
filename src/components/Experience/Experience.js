import React from 'react'
import {Link} from 'react-router-dom'
function Experience() {
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
        <h1>Experience</h1>
        
      </div>
      <div>
        UC Davis
        <br></br>
        Undergraduate Researcher, Department of Computer Science<br></br>
        June 2022 - September 2022<br></br>
        <ul>
          <li>
          Conducted <Link to="https://bpb-us-e2.wpmucdn.com/faculty.sites.uci.edu/dist/8/913/files/2023/01/symposium22-Jake-Smith-GraphCookieSyncDetection.pdf">
            research</Link> in team on data-sharing through 
          Python data analysis by performing web crawls on the 
          top 100K websites and cataloging request chains.
          </li>
          <li>
          Constructed graph representations of request chains 
          to identify data-sharing between web endpoints and 
          utilized graph analysis algorithms to gain insights.
          </li>
          <li>
          The results categorized behaviors associated with 
          Cookie Syncing which was used by Machine Learning 
          team to develop an algorithm for Cookie Sync 
          Detection.
          </li>
        </ul>
      </div>
      <div>
        Davis Kids Klub<br></br>
        Website Manager<br></br>
        July 2021 - Present<br></br>
        <ul>
          <li>Improved the UI and content of <Link to="https://daviskidsklub.com/">
            daviskidsklub.com</Link> using WordPress which improved customer experience 
            and met the needs of the business owners.</li>
        </ul>
      </div>
      <div>
        UC Santa Cruz<br></br>
        Residential Assistant, <Link to="https://sip.ucsc.edu/">
        Science Internship Program</Link><br></br>
        June 2023 - August 2023<br></br>
        <ul>
          <li>
          Managed a dormitory building with 150 student 
          researchers and coordinated events
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Experience