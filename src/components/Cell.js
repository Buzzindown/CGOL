import React from 'react'
import './sim.css'

function Cell(props) {

    let {getName, clickCb, cellData} = props

    return (
            <div 
                className={`sim-cell ${getName(cellData)}`} 
                onClick={()=> {clickCb(cellData)}}
            />
    )
}

export default Cell
