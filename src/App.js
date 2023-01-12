import logo from './logo.svg';
import './App.css';
import React from 'react'

function App() {

  const [state, setState] = React.useState([])

  function handleClick(event) {
    const xpos = event.clientX
    const ypos = event.clientY
    const fieldHeight = (315.5/739.68)*(739.68-ypos)
    const fieldWidth = (651.25/1523.52)*xpos
    setState(prevState => [...prevState, {"x": xpos, "y": ypos, "fieldx": fieldWidth, "fieldy": fieldHeight}])
    console.log([fieldHeight, fieldWidth])
  }

  function handleRemove(xpos, ypos) {
    console.log("remove coords", [xpos, ypos])
    var cur = state
    cur = cur.filter( vals => {
      return vals.x != xpos ||  vals.y != ypos
    })
    setState(cur)
  }

  const pictureDims = {
    "height": "138%",
    "width": "138%"
  }

  return (
    <div className="container" onClick={handleClick}>
      <img style={{"position": "relative"}} src={require("./Field_Map_2023.png")} height={pictureDims.height} width={pictureDims.width}/>
      {state.map((value, index) => {
        return (
          <div style={{"position": "absolute", "left": value.x, "top": value.y, "backgroundColor": "yellow"}}>
            {value.fieldx}, {value.fieldy}
            <button onClick={() => handleRemove(value.x, value.y)}>
              remove
            </button>
          </div>
        )
      })}
    </div>
  );
}

export default App;
