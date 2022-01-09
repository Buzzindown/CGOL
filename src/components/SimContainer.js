import React,{useState, useEffect} from 'react'
import Menu from './Menu'
import Sim from './Sim'
import "./sim.css"

function SimContainer() {

    const [gridSize, setGridSize] = useState(-1)
    const [speed, setSpeed] = useState(1000)

    useEffect(()=>{
        console.log("rerendering sim container with button")
    })
    

    return (
        <div id="sim-container">
            <Menu gridSizeCB={setGridSize} gridSize={gridSize} speed={speed} setSpeedCB={setSpeed}/>
            <Sim gridSize={gridSize} speed={speed}/>
        </div>
    )
}

export default SimContainer
