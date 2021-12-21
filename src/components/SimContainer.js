import React,{useState, useEffect} from 'react'
import Menu from './Menu'
import Sim from './Sim'
import "./sim.css"

function SimContainer() {

    const [playing,setPlaying] = useState(false)
    const [gridSize, setGridSize] = useState(-1)

    return (
        <div id="sim-container">
            <Menu gridSizeCB={setGridSize} gridSize={gridSize} />
            <div className="play-pause" onClick={()=>{setPlaying((old) => !old)}}>{`${playing?"PLAY":"PAUSE"}`}</div>
            <Sim isPlaying={playing} gridSize={gridSize} />
        </div>
    )
}

export default SimContainer
