import React,{useState, useEffect} from 'react'
import Menu from './Menu'
import Sim from './Sim'
import "./sim.css"

function SimContainer() {

    const [playing,setPlaying] = useState(false)
    const [gridSize, setGridSize] = useState(-1)
    const [test, setTest] = useState(1)
    const [speed, setSpeed] = useState(1000)

    return (
        <div id="sim-container">
            <Menu gridSizeCB={setGridSize} gridSize={gridSize} speed={speed} setSpeedCB={setSpeed}/>
            <div id="button-wrapper">
                <button style={{"backgroundColor":`${playing ? "blue" : "red"}`}}className="play-pause" onClick={(e)=>{
                    setPlaying((old) => !old)}
                    }>{`${playing?"PLAY":"PAUSE"}`}</button>
                <button className="play-pause" onClick={(e)=>{
                setTest((old) => old +1)}
                }>{test}</button>
            </div>
          
            <Sim isPlaying={playing} gridSize={gridSize} speed={speed}/>
        </div>
    )
}

export default SimContainer
