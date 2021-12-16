import './styles.css';
import React,{useEffect, useState} from 'react';

function App() {

  let [rowsArr, setRowsArr] = useState([]);
  let [animationDone, setAnimationDone] = useState(false);
  let [animationAdjustment, setAnimationAdjustment] = useState(0)

  useEffect(()=>{
    if(animationAdjustment > 0){
      startTransition();
    }
  },[rowsArr, animationAdjustment])

  useEffect(() => {
    let rowLength = getRowLength();
    let columnLength = getColumnLength(rowLength);
    setTableJSX(columnLength, rowLength)
  }, [])

  const getColumnLength = (rowLength) => {
    let {height, width} = document.getElementById('root').getBoundingClientRect();
    let length = Math.round(height/Math.floor(width/rowLength));
    return length;
  }

  // for column length we need the row length
  const getRowLength = () => {
    let {width,height} = document.getElementById('root').getBoundingClientRect();
    // if we have a larger tablet or something we want more squares
    let length = 0 
    let cellAnimation = 0
    if(width > height){
      length = 15;
      cellAnimation = 0.8;
    }else{
      length = 7;
      cellAnimation = 1;
    }

    setAnimationAdjustment(cellAnimation == 0.8 ? 10 : 20)
    document.getElementById('root').style.setProperty("--row-length",length)
    document.getElementById('root').style.setProperty("--cell-animation",`${cellAnimation}s`)
    return length;
  }

  const setTableJSX = (columnLength, rowLength) => {
    let newRowsArr = [];
    for(let i = 0; i < columnLength; i++){
      let row = [];
      for(let j = 0; j < rowLength; j++){
        row.push(
        <div className="cell-wrapper" id={`cell-wrapper-${i}-${j}`} key={`cell-wrapper-${i}-${j}`}>
          <div className="cell" id={`cell-${i}-${j}`} key={`cell-${i}-${j}`}/>
        </div>)
      }
      newRowsArr.push(<div className="row" id={`row-${i}`}key={`row-${i}`}>{row}</div>)
    }
    setRowsArr(newRowsArr);
  }

  const startTransition = () => {
    let timer = 0;
    rowsArr.forEach((row, rowIndex) => {
      row.props.children.forEach((cell, cellIndex) => {
        setTimeout(()=>{
          document.getElementById(`cell-${rowIndex}-${cellIndex}`).style.backgroundColor = "black"
          if(cellIndex == row.props.children.length-1 && rowIndex == rowsArr.length-1){
            setTimeout(() => {
              document.getElementById('white-slider').setAttribute("class", "slide-up-util")
              setTimeout(()=>{
                setAnimationDone(true)
              }, 1000)
            }, animationAdjustment);
          }
        }, timer)
        timer += animationAdjustment;
      })
    })
  }

  return (
    <div id="cgol-app-grid">
     {animationDone &&(
       <div id="heading-wrapper" className="fade-in-util">
        <h1>Conway's Game of Life</h1>
        <p>Let's Get Started</p>
       </div>
      )
      }
     {
       rowsArr.length > 0 && (
        rowsArr
       )
     }
     <div id="white-slider"/>
    </div>
  );
}

export default App;
