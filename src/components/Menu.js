import React,{useState, useEffect} from 'react'
import './sim.css'

function Menu(props) {
    
    const {gridSizeCB, gridSize} = props
    const [low, setLow] = useState(20)
    const [high, setHigh] = useState(100)

    const handleResize = () => {
        let {width,height} = document.getElementById('grid-container').getBoundingClientRect();
        console.log(Math.floor(width) + " " + Math.floor(height))
        // need to figure out how we want to set these
        if(width >= height){
            // more of a desktop situation
            setLow(Math.floor(width/60));
            setHigh(Math.floor(width/20));
        }else{
            setLow(Math.floor(height/50));
            setHigh(Math.floor(height/15));
        }
    }

    useEffect(() => {
        handleResize()
    }, [])
    return (
        <div className="menu-div">
            <input type="range" min={low} max={high} value={gridSize} onChange={(e)=>{gridSizeCB(e.target.value)}}/>
        </div>
    )
}

export default Menu
