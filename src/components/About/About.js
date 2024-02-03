import React from 'react'
import liphoto from './linkedinphoto.jpeg'
function About() {
  return (
    <div className='about'>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30px',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h2>About Me</h2>
        <img src={liphoto} alt="Me on LinkedIn" 
          width="25%" height=""/>
      </div>
      <div> 
        <p>
        Throughout my academic journey, I have developed a robust foundation in computer science and engineering principles, programming languages, and mathematics. My coursework has encompassed comprehensive topics such as software engineering, computer networking, data structures and algorithms, and system design. This rigorous technical training, combined with my keen analytical and logical thinking abilities, empowers me to dissect complex problems into manageable components and craft innovative and effective solutions. Furthermore, my mathematical sharpness allows me to efficiently research quantitative phenomena in the classroom and in my spare time.
        </p>
        <p>
          Moreover, my exceptional communication and interpersonal skills have been honed through active participation in team projects and active participation in student organizations. I recognize the importance of clear and concise communication in the engineering realm. I am adept at facilitating effective knowledge transfer, fostering client engagement, and collaborating harmoniously with diverse stakeholders.
        </p>
        <p>
          Furthermore, I have engaged in impactful research at UC Davis, specifically focusing on the intricate domain of data privacy. My endeavors have delved into the architecture of data sharing, as well as the legal and ethical implications of data privacy regulations, enabling me to cultivate an in-depth understanding of data privacy and industry best practices. Consequently, I possess a discerning eye for identifying potential risks and an aptitude for developing comprehensive strategies to ensure regulatory compliance and safeguard sensitive information.
        </p>
        <p>
          Additionally, I am actively involved in enhancing the digital presence of a local business called Davis Kids Klub. As the lead developer responsible for the organization's WordPress website, I collaborate closely with the stakeholders to discern their objectives and translate them into an aesthetically appealing and user-friendly online platform. This hands-on experience has not only augmented my technical prowess in website development and content management but has also further sharpened my ability to empathize with clients, identify their unique needs, and deliver tailored solutions that align with their goals.
        </p>
      </div>
      <div>

      </div>
    </div>
  )
}

export default About