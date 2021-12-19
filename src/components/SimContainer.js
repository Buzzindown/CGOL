import React,{useState, useEffect} from 'react'
import Sim from './Sim'
import "./sim.css"

function SimContainer() {

    const [playing,setPlaying] = useState(false)
    return (
        <div id="sim-container">
            <div className="play-pause" onClick={()=>{setPlaying((old) => !old)}}>{`${playing?"PLAY":"PAUSE"}`}</div>
            <Sim isPlaying={playing} />
        </div>
    )
}

export default SimContainer
