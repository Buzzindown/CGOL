import React from 'react';
import Home from './components/Home';
import SimContainer from './components/SimContainer';
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {


  return (
    <BrowserRouter>
      <Routes>
          <Route path="/CGOL" element={<Home />}/>
          <Route path="/CGOL/sim" element={<SimContainer/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
