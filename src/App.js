import './styles.css';
import React,{useEffect, useState} from 'react';

function App() {

  let [columnLength, setColumnLength ] = useState(0);
  let [rowsArr, setRowsArr] = useState([]);
  let [animationDone, setAnimationDone] = useState(false);

  const calculateGrid = () => {
    let {height, width} = document.getElementById('root').getBoundingClientRect();
    let cellDimension = Math.floor(0.1 * width);
    console.log(cellDimension)
    let cellsTall = Math.round(height/cellDimension);
    setColumnLength(cellsTall)
    console.log(cellsTall)
    console.log(`height: ${height} || width: ${width}`)
  }

  const setTableJSX = () => {
    let newRowsArr = [];
    for(let i = 0; i < columnLength; i++){
      let row = [];
      for(let j = 0; j < 10; j++){
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
              document.getElementById('cgol-app-grid').style.backgroundColor = "white";
              setTimeout(()=>{
                setAnimationDone(true)
              }, 2000)
            }, 10);
          }
        }, timer)
        timer += 25;
      })
    })
   
    // rowsArr.forEach((row,rowIndex) => {
    //   setTimeout(()=>{
    //     document.getElementById(`row-${rowsArr.length-rowIndex-1}`).style.backgroundColor = "white"
    //   }, timer)
    //   timer += 100;
    // })

  }

  // const startTransition = () => {
  //   for()
  // }

  useEffect(()=>{
    startTransition();
  },[rowsArr])

  useEffect(()=>{
    setTableJSX()
  },[columnLength])

  useEffect(() => {
    // we'll have 10 cells across
   calculateGrid();
  }, [])
  return (
    <div id="cgol-app-grid">
     {/* we'll have some sort of intro page then bounce to the game page 
     we could have some sort of neat background animation go on, we could probably
     do this with css but might need to do something with js to calculate the grid
     we could just run the grid off of the width and then make it however long it needs to be*/}
     {animationDone &&(
       <div id="heading-wrapper">
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
