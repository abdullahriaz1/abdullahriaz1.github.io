import './App.css';
import React  from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import About from "./components/About/About"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Experience from "./components/Experience/Experience"
import Projects from "./components/Projects/Projects"
import Home from "./components/Home/Home"


//<About, Experience, Projects>

function App() {
  return (
    <Router>
      <div className='App'>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
