import './App.css';
import React from 'react'
import { useState } from 'react';
import { Button } from 'antd';
import Intern from './Intern';
import Network from './Network';

function App() {

  const [intern, setIntern] = useState(true);
  const Display = () => {
    return intern ? <Intern /> : <Network />
  }

  return (
    <div>
      <div className="App-header">
        <div className="tabs">
          <Button onClick={() => setIntern(true)} style={{ width: "50%", border: "solid #e0e0e0 0.5px" }}> Internship</Button>
          <Button onClick={() => setIntern(false)} style={{ flexGrow: 1, textAlign: "center", verticalAlign: "center", border: "solid #e0e0e0 0.5px" }}>Network</Button>
        </div>
        <Display />
      </div>
    </div>
  );
}

export default App;


