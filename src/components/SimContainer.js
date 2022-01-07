import React,{useState, useEffect} from 'react'
import Menu from './Menu'
import Sim from './Sim'
import "./sim.css"

function SimContainer() {

    const [playing,setPlaying] = useState(false)
    const [gridSize, setGridSize] = useState(-1)
    const [speed, setSpeed] = useState(1000)

    useEffect(()=>{
        console.log("rerendering")
    })
    

    return (
        <div id="sim-container">
            <Menu gridSizeCB={setGridSize} gridSize={gridSize} speed={speed} setSpeedCB={setSpeed}/>
            <div style={{"backgroundColor":`${playing ? "blue" : "red"}`}}className="play-pause" onClick={()=>{setPlaying((old) => !old)}}>{`${playing?"PLAY":"PAUSE"}`}</div>
            <Sim isPlaying={playing} gridSize={gridSize} speed={speed}/>
        </div>
    )
}

export default SimContainer
