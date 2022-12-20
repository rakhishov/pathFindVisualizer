import React from 'react';
import './App.css';
import PathFind from "./coding/pathFind/PathFind.jsx"
import { Container } from 'react-dom';
function App() {
  
  return (
    <>
    <div className="App-white">
      <div className=''>Pathfind Visualizer</div>
      <PathFind/>
    </div>
    </>
  );
}

export default App;
