import React,{useState, useEffect} from 'react'
import './sim.css'

function Menu(props) {
    
    const {gridSizeCB, gridSize, setSpeedCB, speed} = props
    const [low, setLow] = useState(20)
    const [high, setHigh] = useState(100)

    const handleSizing = () => {
        let {width,height} = document.getElementById('grid-container').getBoundingClientRect();
        console.log(Math.floor(width) + " " + Math.floor(height))
        // need to figure out how we want to set these
        if(width >= height){
            // more of a desktop situation
            // here maybe we want the max to be 500 cells
            getLowAndHigh(2000, 20)
        }else{
            /// here maybe we want the max to be like 200 cells
            getLowAndHigh(800, 20)
        }
    }

    const getLowAndHigh = (maxCells, minCells) => {
        let {width,height} = document.getElementById('grid-container').getBoundingClientRect();
        let low = 1;
        let found = false;
        width = Math.floor(width)
        height = Math.floor(height)
        console.log(width + " " + height)
        while(width % 10 != 0){
            width--;
        }
        while(height % 10 != 0){
            height--;
        }
        console.log(width + " " + height)
        // determine our largest grid
        while(!found){
            while ((width % low != 0) && (height % low != 0)) {
                low++;
            }
            // we increase our low until we find the first one that is within our size constraints
            let cols = Math.round(width / low);
            let rows = Math.round(height / low);

            if(cols * rows <= maxCells){
                found = true;
                setLow(low)
                console.log(`found a low of ${cols} * ${rows} using high of ${low} for grid size ${cols * rows}`)
                // if it isnt within our constraints, push it past this set
            }else{
                low++;
            }
        }
        // do the same thing the other way for our smallest grid
        found = false;
        let high = (width >= height ? width : height)
        while(!found){
            while ((width % high != 0) && (height % high != 0)) {
                high--;
            }
            // we increase our low until we find the first one that is within our size constraints
            let cols = Math.round(width / high);
            let rows = Math.round(height / high);

            if(cols * rows >= minCells){
                found = true;
                setHigh(high)
                console.log(`found a high of ${cols} * ${rows} using high of ${high} for grid size ${cols * rows}`)
                // if it isnt within our constraints, push it past this set
            }else{
                high--;
            }
        }

        gridSizeCB(low)
        
    }

    useEffect(() => {
        handleSizing()
    }, [])
    return (
        <div className="menu-div">
            <input type="range" min={low} max={high} value={gridSize} onChange={(e)=>{
            gridSizeCB(e.target.value)}}/>
            <input style={{direction:'rtl'}}type="range" min={100} max={2000} value={speed} onChange={(e)=>{
            setSpeedCB(e.target.value)}}/>
        </div>
    )
}

export default Menu
