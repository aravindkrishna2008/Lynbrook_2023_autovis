import logo from "./logo.svg";
import "./App.css";
import React from "react";

function App() {
  const [state, setState] = React.useState([]);

  function handleClick(event) {
    if (event.target == event.currentTarget) {
      const xpos = event.clientX;
      const ypos = event.clientY;
      console.log(xpos, ypos)
      const fieldHeight = (315.5 / 739.68) * (739.68 - ypos);
      const fieldWidth = (651.25 / 1523.52) * xpos;
      setState((prevState) => [
        ...prevState,
        { x: xpos, y: ypos, fieldx: fieldWidth, fieldy: fieldHeight },
      ]);
      console.log([fieldHeight, fieldWidth]);
    }
  }
  function handleClickMark(text) {
    var element = document.getElementById(text);
    console.log(element.style.display)
    if(element.style.display=="none"){
      element.style.display="block";
    }
    else{
      element.style.display="none"
    }
  }

  function handleMarkRemove(text1, text2){
    console.log("remove coords", [text1]);
    var element = document.getElementById(text1);
    element.remove();
    var element2 = document.getElementById(text2);
    if(element2!=undefined){
      element2.remove();
    }
  }

  const pictureDims = {
    height: "138%",
    width: "138%",
  };

  return (
    <div className="container" onContextMenu={(e)=> e.preventDefault()}>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.11.0/umd/react.production.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.11.0/umd/react-dom.production.min.js"></script>
      <img
        style={{ position: "relative" }}
        onClick={handleClick}
        src={require("./Field_Map_2023.png")}
        height={pictureDims.height}
        width={pictureDims.width}
      />
      {state.map((value, index) => {
        return (
          <div
            id={`${Math.floor(value.fieldx / 12)}' ${(value.fieldx % 12).toFixed(2)}", ${Math.floor(value.fieldy / 12)}' ${(value.fieldy % 12).toFixed(2)}"`}
            style={{
              position: "absolute",
              left: value.x,
              top: value.y,
              backgroundColor: "#e8727295",
              padding: "5px",
              display: "flex-row",
              borderRadius: "5px",
            }}
          >
            {Math.floor(value.fieldx / 12)}' {(value.fieldx % 12).toFixed(2)}",{" "}
            {Math.floor(value.fieldy / 12)}' {(value.fieldy % 12).toFixed(2)}"
          </div>
        );
      })}
      {state.map((value, index) => {
        return (
          <div
            id={`${Math.floor(value.fieldx / 12)}' ${(value.fieldx % 12).toFixed(2)}", ${Math.floor(value.fieldy / 12)}' ${(value.fieldy % 12).toFixed(2)}" dot`}
            style={{
              position: "absolute",
              left: value.x-7,
              top: value.y-7,
              height: "18px", 
              width: "18px",
              backgroundColor: "#f5e218",
              display: "flex-row",
              borderRadius: "9px",
            }}
            onClick={() => handleClickMark(`${Math.floor(value.fieldx / 12)}' ${(value.fieldx % 12).toFixed(2)}", ${Math.floor(value.fieldy / 12)}' ${(value.fieldy % 12).toFixed(2)}"`)}
            onContextMenu={() => handleMarkRemove(`${Math.floor(value.fieldx / 12)}' ${(value.fieldx % 12).toFixed(2)}", ${Math.floor(value.fieldy / 12)}' ${(value.fieldy % 12).toFixed(2)}" dot`, `${Math.floor(value.fieldx / 12)}' ${(value.fieldx % 12).toFixed(2)}", ${Math.floor(value.fieldy / 12)}' ${(value.fieldy % 12).toFixed(2)}"`)}
          >
            <div style={{position: "absolute", left:"5px", top: "5px", height:"8px", width:"8px", borderRadius:"4px", backgroundColor: "#FFFFFF"}}></div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
