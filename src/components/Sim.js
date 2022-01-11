import React, {useEffect, useState, useRef} from 'react'
import Cell from './Cell';
import "./sim.css"

function Sim(props) {

    const {isPlaying, gridSize, speed} = props

    const [gameCells, setGameCells] = useState([]);

    const lastInterval = useRef(0)
    const gensElapsed = useRef(0)

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
            // if we start playing, we kick up an interval
            clearInterval(lastInterval.current)
            lastInterval.current = setInterval(()=>{
                updateGeneration()
            },speed)
        }else{
            // no playing, we stop the interval
            clearInterval(lastInterval.current)
        }
    }

    useEffect(()=>{
        if(gridSize > 0){
            let {width,height} = document.getElementById('grid-container').getBoundingClientRect();
            width = Math.floor(width)
            height = Math.floor(height)
            while(width % 10 !== 0){
                width--;
            }
            while(height % 10 !== 0){
                height--;
            }
            let gs = gridSize
            while ((width % gs !== 0) && (height % gs !== 0)) {
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
        // when speed changes, we want to clear the interval and start up a new one
        console.log(lastInterval.current)
        // clearInterval(lastInterval.current)
        // if(isPlaying){ 
        //     // if we're playing we boot out the interval from runGeneration() !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //     // and startup a new one With the new speed setting
        //     lastInterval.current = setInterval(()=>{
        //         updateGeneration()
        //     },speed)
        // }
    },[speed])

    // we have a means of starting/stopping the sim || cool !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // useEffect(()=>{
    //     runGeneration()
    // },[isPlaying])

    useEffect(()=>{
        setTimeout(()=>{
            setInterval(()=>{
                updateGeneration()
            },speed)
        },10000)
    },[])

    // useEffect(()=>{
    //     console.log("rerendering sim running = " + isPlaying)
    // })
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
        // we set our timeout for the next round
        gensElapsed.current += 1
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

        if(newCell.age < -5){
            newCell.age = -5
        }else if(newCell.age > 5){
            newCell.age = 5
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

    

    // <div className={`sim-cell ${getCellClassName(cell)}`} key={`cell-${cell.x}-${cell.y}`} onClick={()=> {cellOnClick(cell)}}/>)

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
                                        <Cell  key={`cell-${cell.x}-${cell.y}-${cell.age}`}
                                        getName={getCellClassName} 
                                        cellData={cell} 
                                        clickCb={cellOnClick}/>)
                                    })
                                }
                            </div>
                        )
                    })
                )
            }
            
        </div>
        <div style={{color:'white', textAlign:"center"}}>{gensElapsed.current}</div>
        </>
)
}

export default Sim
