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
        
        <Home />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
