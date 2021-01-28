var i = 0;
var j = 0;
// game stopper & starter
var gameon = true;
// window width an height
const bigWidth = 1200;
const bigHeight = 800;
// scales how many squares we have (less = more)
var sizeChose = false;
var gridSlider;
var scalar;
var brushSize = 5;
//size os our cell arrays
var arr1 = 0;
var arr2 = 0;
let canvas;
var generation = 0;
var colorSpeedAlive = 14;
var colorSpeedDead = 5;

// starts the sim stage
var going = false;
// changes framerate from create stage to sim stage
var speed = true;
// enables drawing/erasing
var drawOrErase = true;

//Used for centering our canvas on the webpage
var size = {
  width: window.innerWidth || document.body.clientWidth,
  height: window.innerHeight || document.body.clientHeight
}

var sliders = {
  gridSlider: 0,
  speedSlider: 0,
  brushSlider: 0
}

var buttons = {
  button: 0,
  buttonlock: 0,
  gridLock: 0,
  resetButton: 0,
  buttonDrawErase: 0,
}

//cell object, represents a cell in the grid and holds its data
function cell(state, age) {
  // either alive (1) or dead (0);
  this.state = state;
  // age is visually represented
  this.age = age;
};


cells = [];
cells2 = [];


function setup() {
  setSliders();
  setButtons();
  connectButtons();
  setCanvas();
}

function connectButtons() {
  //getting button functions setup
  document.getElementById("button").addEventListener("click", startGame);
  if (sizeChose === false) {
    document.getElementById("buttonlock").addEventListener("click", locksize);
  }
  document.getElementById("gridLock").addEventListener("click", gridOnOff);
  gridLock = true;
  document.getElementById("resetButton").addEventListener("click", resetGrid);
  document.getElementById("buttonDrawErase").addEventListener("click", drawErase);
}

function setCanvas() {
  canvas = createCanvas(bigWidth, bigHeight);
  canvas.parent('sketch-div');
  canvas.position((size.width - bigWidth) / 2);
  background(35, 143, 176);
}

function setSliders() {
  //getting sliders
  sliders.gridSlider = select('#GridSlider');
  sliders.speedSlider = select('#speedSlider');
  sliders.brushSlider = select('#brushSlider')
}

function setButtons() {
  // getting buttons
  buttons.button = select('#button');
  buttons.buttonlock = select('#buttonlock');
  buttons.gridLock = select('#gridLock');
  buttons.resetButton = select('#resetButton');
  buttons.buttonDrawErase = select('#buttonDrawErase');
}

function cellStateIndicator(){
  var Xpos2 = Math.floor(mouseX / scalar);
  var Ypos2 = Math.floor(mouseY / scalar);
  if(Xpos2 >= 0 && Xpos2 < Math.round(bigWidth/scalar) && Ypos2 >= 0 && Ypos2 < Math.round(bigHeight/scalar)){
        var ageTracker = cells[Xpos2][Ypos2].age;
    document.getElementById("x_y").innerHTML = Xpos2 + "," + Ypos2;
    if(cells[Xpos2][Ypos2].state == 1){
      document.getElementById("cellStats").innerHTML = "Cell has been alive for " + ageTracker + " generations";
    }else{
      document.getElementById("cellStats").innerHTML = "Cell has been dead for " + ageTracker + " generations";
    }
  
  }
}

// drawing loop (required for p5)
function draw() {
  cellStateIndicator();

  keepCanvasCentered();
  brushSize = sliders.brushSlider.value();
  //updating our generation counter
  document.getElementById("Generation").innerHTML = generation;
  adjustFrameRate();

  if (gameon === true) {
    // allows our user to select the size of the grid, creates an appropriate sized array as well
    if (sizeChose === false) {
      adjustGridSize();
    } else {
      EnableScroll();
    }
    adjustGridOverlay();
    // if the sim stage is started
    if (going === true) {
      generation += 1;
      createNextGen();
    }
    drawAllGrids();
    copyToNextGen();

  }
}

function adjustGridOverlay() {
  if (gridLock === true) {
    strokeWeight(1);
  } else {
    strokeWeight(0);
  }
}

function adjustFrameRate() {
  if (speed === true) {
    //while drawing live cells fr = fast
    frameRate(30);
  } else {
    //how fast the generations tick
    frameRate(sliders.speedSlider.value());
  }
}

function adjustGridSize() {
  disableScroll();
  scalar = sliders.gridSlider.value();
  if (scalar < 14) {
    scalar = 14;
  }
  while ((bigWidth % scalar != 0) || (bigHeight % scalar != 0)) {
    scalar++;
  }

  arr1 = Math.round(bigWidth / scalar);
  arr2 = Math.round(bigHeight / scalar);

  for (i = 0; i < arr1; i++) {
    cells[i] = new cell(arr2);
    for (j = 0; j < arr2; j++) {
      cells[i][j] = new cell(0, 0);
    }
  }
}

function copyToNextGen() {
  if (going === true) {
    // checks to make sure the exact same gen cannot repeat itself forever
    var repeat = true;
    for (i = 0; i < arr1; i++) {
      for (j = 0; j < arr2; j++) {
        // if they're not the same, we change repeat to kill the game
        if (cells[i][j].state != cells2[i][j].state) {
          repeat = false;
        }
        // also copies all cells back into the original object array
        cells[i][j].state = cells2[i][j].state;
        cells[i][j].age = cells2[i][j].age;
      }
    }
  }
  if (repeat === true) {
    document.getElementById("stage").innerHTML = "Simulation Ended";
    gameon = false;
  }
}

function keepCanvasCentered() {
  size.width = window.innerWidth || document.body.clientWidth;
  canvas.position((size.width - bigWidth) / 2);
}

function drawAllGrids() {
  var x = 0;
  var y = 0;
  for (i = 0; i < arr1; i++) {
    for (j = 0; j < arr2; j++) {
      colorCells(i, j)
      if (going === false) {
        document.getElementById("stage").innerHTML = "Create Stage";
      } else {
        document.getElementById("stage").innerHTML = "Simulation Stage";
      }
      rect(x, y, scalar, scalar);
      y += scalar;
    }
    y = 0;
    x += scalar;
  }
}

function colorCells(i, j) {
  var tint = 0;
  if (cells[i][j].state === 1) {
    // if a cell is alive draw it white
    tint = cells[i][j].age;

    if (tint * colorSpeedAlive <= 40) {
      tint = tint * colorSpeedAlive;
    } else {
      tint = 50;
    }
    fill(82 + tint, 189 + tint, 255);
  } else {
    // if a cell is dead, match background
    tint = cells[i][j].age;
    if (tint * colorSpeedDead <= 144) {
      tint = tint * colorSpeedDead;
    } else {
      tint = 144;
    }
    fill(144 - tint, 144 - tint, 144 - tint);
  }
}

// function to draw alive or dead cells in create stage
function mouseDragged() {
  //only want to draw in create stage
  brushDraw();
}

function mousePressed() {
  //only want to draw in create stage
  brushDraw();
}

function brushDraw() {
  if (going === false && gameon === true) {
    // finding which square in the grid we're hovering over

    var Xpos = mouseX / scalar;
    var Ypos = mouseY / scalar;
    // rounding so nothing weird happens with decimals
  //  Xpos = Math.round(Xpos);
 //   Ypos = Math.round(Ypos);
 if(Xpos >= 0 && Xpos <= bigWidth && Ypos >= 0 && Ypos <= bigHeight){
     document.getElementById("x_y").innerHTML = Math.floor(Xpos) + "," + Math.floor(Ypos);
 }
    // checking we're in the canvas and then changing the states of the cells
    if ((Xpos - brushSize >= 0) && (Xpos + brushSize < bigWidth / scalar) &&
      (Ypos - brushSize >= 0) && (Ypos + brushSize < bigHeight / scalar)) {
      if (mouseX < bigWidth && mouseX >= 0 && mouseY >= 0 && mouseY < bigHeight) {
        if (drawOrErase == false) {
          drawCheck(Math.floor(Ypos), Math.floor(Xpos));
        } else {
          eraseCheck(Math.floor(Ypos), Math.floor(Xpos));
        }
      }
    }
  }
}

function drawCheck(num1, num2) {
  cellStatusCheck(1, 0, num1, num2);
}

function eraseCheck(num1, num2) {
  cellStatusCheck(0, 1, num1, num2);
}

function cellStatusCheck(a, b, num1, num2) {
  for (i = 0; i <= brushSize; i++) {
    if (cells[num2][num1 + i].state === a) {
      cells[num2][num1 + i].state = b;
      cells[num2][num1 + i].age = 0;
    }
    if (cells[num2][num1].state === a) {
      cells[num2][num1].state = b;
      cells[num2][num1 + i].age = 0;
    }
    if (cells[num2][num1 - i].state === a) {
      cells[num2][num1 - i].state = b;
      cells[num2][num1 + i].age = 0;
    }
    if (cells[num2 + i][num1].state === a) {
      cells[num2 + i][num1].state = b;
      cells[num2][num1 + i].age = 0;
    }
    if (cells[num2 - i][num1].state === a) {
      cells[num2 - i][num1].state = b;
      cells[num2][num1 + i].age = 0;
    }
    if (cells[num2 + i][num1 + i].state === a) {
      cells[num2 + i][num1 + i].state = b;
      cells[num2][num1 + i].age = 0;
    }
    if (cells[num2 - i][num1 + i].state === a) {
      cells[num2 - i][num1 + i].state = b;
      cells[num2][num1 + i].age = 0;
    }
    if (cells[num2 + i][num1 - i].state === a) {
      cells[num2 + i][num1 - i].state = b;
      cells[num2][num1 + i].age = 0;
    }
    if (cells[num2 - i][num1 - i].state === a) {
      cells[num2 - i][num1 - i].state = b;
      cells[num2][num1 + i].age = 0;
    }
  }
}


function createNextGen() {
  for (i = 0; i < arr1; i++) {
    // creating our next generation's objct array
    cells2[i] = new cell(arr2);
    for (j = 0; j < arr2; j++) {
      // counts how many live cells are around to determine
      // if this cell will live or die in next gen
      var around = 0;
      // check right cell
      if (i + 1 < arr1) {
        if (cells[i + 1][j].state === 1) {
          around += 1;
        }
      }
      if (i - 1 >= 0) {
        // check left cell
        if (cells[i - 1][j].state === 1) {
          around += 1;
        }
      }
      if (j + 1 < arr2) {
        // check up cell
        if (cells[i][j + 1].state === 1) {
          around += 1;
        }
      }

      if (j - 1 >= 0) {
        // check down cell
        if (cells[i][j - 1].state === 1) {
          around += 1;
        }
      }
      if (i + 1 < arr1 && j + 1 < arr2) {
        // check up right cell
        if (cells[i + 1][j + 1].state === 1) {
          around += 1;
        }
      }

      if (i + 1 < arr1 && j - 1 >= 0) {
        // check down right cell
        if (cells[i + 1][j - 1].state === 1) {
          around += 1;
        }
      }
      if (i - 1 >= 0 && j + 1 < arr2) {
        // check up left cell
        if (cells[i - 1][j + 1].state === 1) {
          around += 1;
        }
      }
      if (i - 1 >= 0 && j - 1 >= 0) {
        //check down left cell
        if (cells[i - 1][j - 1].state === 1) {
          around += 1;
        }
      }

      if (cells[i][j].state === 1) {
        if (around === 2 || around === 3) {
          // cell lives to next gen
          cells2[i][j] = new cell(1, cells[i][j].age + 1);
        } else {
          // cell dies in next gen
          cells2[i][j] = new cell(0, 0);
        }
      } else if (cells[i][j].state === 0) {
        if (around === 3) {
          // cell comes back to live in next gen
          cells2[i][j] = new cell(1, 0);
        } else {
          // cell stays dead in next gen
          cells2[i][j] = new cell(0, cells[i][j].age + 1);
        }
      }

    }
  }
}

function startGame() {
  if (sizeChose == true) {
    if (going === false && speed === true) {
      document.getElementById('button').style = 'border-color: #3273A8';
      going = true;
      speed = false;
    } else if (gameon === true) {
      document.getElementById('button').style = 'border-color: #E63535';
      going = false;
      speed = true;
    }
  }
  return false;
}

function locksize() {
  sizeChose = true;
  document.getElementById('buttonlock').style = 'background-color:#FFFFFF; color:#000000;';
}

function gridOnOff() {
  if (gridLock === false) {
    document.getElementById('gridLock').style = 'border-color: #3273A8';
    gridLock = true;
  } else {
    document.getElementById('gridLock').style = 'border-color: #E63535';
    gridLock = false;
  }
}

function disableScroll() {
  //touch-action: none;
  document.getElementsByClassName('body').style = 'touch-action: none;';
}

function EnableScroll() {
  //touch-action: none;
  document.getElementsByClassName('body').style = 'touch-action: auto;';
}

function resetGrid() {
  sizeChose = false;
  going = false;
  speed = true;
  gameon = true;
  generation = 0;
  document.getElementById('buttonlock').style = 'background-color:#000000; color:#FFFFFF;';
  document.getElementById('button').style = 'background-color:#000000; color:#FFFFFF;';
}

function drawErase() {
  if (drawOrErase == false) {
    document.getElementById('buttonDrawErase').style = 'border-color: #3273A8';
    drawOrErase = true;
  } else {
    document.getElementById('buttonDrawErase').style = 'border-color: #E63535';
    drawOrErase = false;
  }
}