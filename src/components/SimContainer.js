import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import Sim from "./Sim";
import "./sim.css";

function SimContainer() {
  const navigate = useNavigate();

  // redirect if they somehow went directly thru url
  useEffect(() => {
    let { width } = document
      .getElementById("sim-container")
      .getBoundingClientRect();
    if (width < 1000) {
      navigate("/");
    }
  }, [navigate]);

  const [ageOn, setAge] = useState(true);
  const [gridOn, setGrid] = useState(true);
  const [isPlaying, setPlaying] = useState(false);
  const [gridSize, setGridSize] = useState(-1);
  const [speed, setSpeed] = useState(1000);
  const gensElapsed = useRef(0);

  return (
    <div id="sim-container">
      <Menu
        gridSizeCB={setGridSize}
        gridSize={gridSize}
        speed={speed}
        setSpeedCB={setSpeed}
        isPlaying={isPlaying}
        gensElapsed={gensElapsed}
        setAge={setAge}
        ageOn={ageOn}
        setGrid={setGrid}
        gridOn={gridOn}
      />
      <Sim
        gensElapsed={gensElapsed}
        isPlaying={isPlaying}
        setPlaying={setPlaying}
        gridSize={gridSize}
        speed={speed}
        ageOn={ageOn}
        gridOn={gridOn}
      />
    </div>
  );
}

export default SimContainer;
