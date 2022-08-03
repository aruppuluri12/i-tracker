import './App.css';
import React from 'react'
import Intern from './Intern';
import Network from './Network';
import Login from './Login'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Login</Link>
        <Link to="/internship">Internship Tracker</Link>
        <Link to="/network">Network Tracker</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/internship" element={<Intern />} />
        <Route path="/network" element={<Network />} />
      </Routes>
    </Router>

  );
}

export default App;


