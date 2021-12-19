import React, {useEffect, useState} from 'react'
import "./sim.css"

function Sim(props) {

    const {isPlaying} = props

    const [timeElapsed, setTimeElapsed] = useState(0);
    const [gameCells, setGameCells] = useState([]);

    const rowWidth = 50;
    const columnHeight = 50;

    const getGameCells = () => {
        let cells = []
        for(let i = 0; i < rowWidth; i++){
            let row = []
            for(let j = 0; j < columnHeight; j++){
                row.push({
                    x: i,
                    y: j,
                    age: -1,
                })
            }
            cells.push(row)
        }
        setGameCells(cells)
    }

    useEffect(()=>{
         document.getElementById('root').style.setProperty("--row-width",`${rowWidth}`)
         document.getElementById('root').style.setProperty("--column-height",`${columnHeight}`)
    },[])

    // we have a means of starting/stopping the sim || cool
    useEffect(()=>{
        if(isPlaying){
            setTimeout(()=>{
                updateGeneration()
            },10)
        }
    },[isPlaying, timeElapsed])

    // will update to our next generation + update time elapsed
    const updateGeneration = () => {
        setGameCells((oldGameCells) => {
            let newGameCells = [...oldGameCells]
            oldGameCells.forEach((row,i)=>{
                newGameCells[i] = [...row]
            })
            newGameCells.forEach((row) => {
                row.forEach((cell) => {
                    newGameCells[cell.x][cell.y] = updateCell(cell, oldGameCells)
                })
            })
            return newGameCells
        })
        setTimeElapsed((oldTime) => oldTime + 1)
    }

    const updateCell = (cell, oldGameCells) => {
        
        let newCell = {...cell}
        let {x,y} = cell;
        let aliveNeighbors = 0
        if(checkIfValid(oldGameCells,x,y+1)){
            aliveNeighbors += 1;
        }
        if(checkIfValid(oldGameCells,x+1,y+1)){
            aliveNeighbors += 1;
        }
        if(checkIfValid(oldGameCells,x+1,y)){
            aliveNeighbors += 1;
        }
        if(checkIfValid(oldGameCells,x+1,y-1)){
            aliveNeighbors += 1;
        }
        if(checkIfValid(oldGameCells,x,y-1)){
            aliveNeighbors += 1;
        }
        if(checkIfValid(oldGameCells,x-1,y-1)){
            aliveNeighbors += 1;
        }
        if(checkIfValid(oldGameCells,x-1,y)){
            aliveNeighbors += 1;
        }
        if(checkIfValid(oldGameCells,x-1,y+1)){
            aliveNeighbors += 1;
        }
        if(newCell.age > -1){
            if(aliveNeighbors === 2 || aliveNeighbors === 3){
                newCell.age += 1;
            }else{
                newCell.age = -1;
            }
        }else{
            if(aliveNeighbors === 3){
                newCell.age = 0;
            }else{
                newCell.age += -1;
            }
        }
        
        return newCell

       
    }

    const checkIfValid = (oldGameCells, x, y) => {
        if(oldGameCells[x]){
            if(oldGameCells[x][y]?.age > -1){
                return true;
            }
        }
        return false;
    }

    const cellOnClick = (cell) => {
        if(!isPlaying){
            setGameCells((oldCells) =>{
                let newCells = [...oldCells]
                
                if(newCells[cell.x][cell.y].age < 0){
                    newCells[cell.x][cell.y].age = 0
                }else{
                    newCells[cell.x][cell.y].age = -1
                }
                return newCells
            })
        }
    }

    const getCellClassName = (cell) => {
        if(cell.age >= 5){
            return "age-5"
        }else if(cell.age <= -5){
            return "age--5"
        }else{
            return `age-${cell.age}`
        }
    }

    

    useEffect(()=>{
        getGameCells()
    },[])

    return (

        <div id="grid-container">
            {
                gameCells.length > 0 && (
                    gameCells.map((row, index) => {
                        return (
                            <div className="sim-row" key={index}>
                                {
                                    row.map((cell) => {
                                        return (
                                        <div className={`sim-cell ${getCellClassName(cell)}`} key={`cell-${cell.x}-${cell.y}-${cell.age}`} onClick={()=> {cellOnClick(cell)}}/>)
                                    })
                                }
                            </div>
                        )
                    })
                )
            }
            
        </div>
    )
}

export default Sim
