import React, {useEffect, useState} from 'react'
import "./sim.css"

function Sim(props) {

    const {isPlaying, gridSize, speed} = props
    const [gensElapsed, setGensElapsed] = useState(0)

    const [gameCells, setGameCells] = useState([]);

    const [lastTimeOut, setLastTimeOut] = useState(0)
    const [rowWidth, setRowWidth] = useState(0);
    const [columnHeight, setColumnHeight] = useState(0);

    // get a fresh set of cells
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
        document.getElementById('root').style.setProperty("--row-width",`${rowWidth}`)
        document.getElementById('root').style.setProperty("--column-height",`${columnHeight}`)
        setGameCells(cells)
    }

    const runGeneration = () => {
        if(isPlaying){
            let to = setTimeout(()=>{
                updateGeneration()
            },speed)
            setLastTimeOut(to)
        }else{
            clearTimeout(lastTimeOut)
        }
    }

    useEffect(()=>{
        if(gridSize > 0){
            let {width,height} = document.getElementById('grid-container').getBoundingClientRect();
            width = Math.floor(width)
            height = Math.floor(height)
            while(width % 10 != 0){
                width--;
            }
            while(height % 10 != 0){
                height--;
            }
            let gs = gridSize
            while ((width % gs != 0) && (height % gs != 0)) {
                gs++;
            }
            
            let cols = Math.round(width / gs);
            let rows = Math.round(height / gs);

            setRowWidth(rows)
            setColumnHeight(cols)
        }
    },[gridSize])

    // get our initial array
    useEffect(()=>{
        getGameCells()
    },[rowWidth, columnHeight])

    // this way we can make the speed slider smoother and cancel our to's
    useEffect(()=>{
        clearTimeout(lastTimeOut)
        runGeneration()
    },[speed])

    // we have a means of starting/stopping the sim || cool
    useEffect(()=>{
        runGeneration()
    },[isPlaying, gensElapsed])

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
        setGensElapsed((oldTime) => oldTime + 1)
    }

    // should try implementing a fancier/faster algorithm
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

    

    

    return (
        <>
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
        <div style={{color:'white', textAlign:"center"}}>{gensElapsed}</div>
        </>
)
}

export default Sim
