import React,{useState, useEffect} from 'react'
import Menu from './Menu'
import Sim from './Sim'
import "./sim.css"

function SimContainer() {

    const [playing,setPlaying] = useState(false)
    const [gridSize, setGridSize] = useState(-1)
    const [speed, setSpeed] = useState(1000)
    const [gensElapsed, setGensElapsed] = useState(0)
    

    return (
        <div id="sim-container">
            <Menu gridSizeCB={setGridSize} gridSize={gridSize} speed={speed} setSpeedCB={setSpeed}/>
            <div className="play-pause" onClick={()=>{setPlaying((old) => !old)}}>{`${playing?"PLAY":"PAUSE"}`}</div>
            <Sim isPlaying={playing} gridSize={gridSize} setGensElapsedCB={setGensElapsed} gensElapsed={gensElapsed} speed={speed}/>
            <div style={{color:'white', textAlign:"center"}}>{gensElapsed}</div>
        </div>
    )
}

export default SimContainer
