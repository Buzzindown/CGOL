import React from 'react';
import Home from './components/Home';
import SimContainer from './components/SimContainer';
import { HashRouter, Routes, Route } from "react-router-dom";
function App() {


  return (
    <HashRouter>
      <Routes>
          <Route  path="/" element={<Home />}/>
          <Route  path="/sim" element={<SimContainer/>}/>
      </Routes>
    </HashRouter>
  );
}

export default App;
