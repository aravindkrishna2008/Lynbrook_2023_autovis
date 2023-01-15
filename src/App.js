import logo from "./logo.svg";
import "./App.css";
import React, {useState} from "react";
import { toBeInTheDOM } from "@testing-library/jest-dom/dist/matchers";

const allowedExtensions = ["csv"];

var firstX=0;
var firstY=0;

var isDown =false;

var offsetX=0;
var offsetY=0;

var initialXReal =0;
var initialYReal =0;

function App() {
  const [state, setState] = useState([]);
     
  // // It state will contain the error when
  // // correct file extension is not used
  // const [error, setError] = useState("");
   
  // It will store the file uploaded by the user
  const [file, setFile] = useState("");

  const [array, setArray] = useState([]);

  // This function will be called when
  // the file input changes
  const handleFileChange = (e) => {
      setFile(e.target.files[0]);
  };
  const csvFileToArray = string => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map(i => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setArray(array);
    console.log(array);
    for(var i=0; i<array.length-1; i++){
      var fieldHeight = parseInt(array[i]["height"]);
      var fieldWidth = parseInt(array[i]["width"]);
      console.log(array[i], fieldHeight, fieldWidth);
      const ypos = 739.68-fieldHeight/(315.5/739.68);
      const xpos = fieldWidth/(651.25/1523.52);
      console.log(xpos, ypos)
      const newPos = state.length + 1;
      if (newPos==1){
        firstX = fieldWidth;
        firstY = fieldHeight;
        console.log(firstX, firstY)
        fieldHeight=0;
        fieldWidth=0;
      }
      state.push({
          x: xpos,
          y: ypos,
          fieldx: fieldWidth,
          fieldy: fieldHeight,
          pos: newPos,
        });
    }
    console.log(state)

  };

  const handleParse = (e) => {
      
      e.preventDefault();
      const reader = new FileReader();
       
      if(file){
        reader.onload = function(event) {
          const text = event.target.result;
          csvFileToArray(text);
        }
        reader.readAsText(file);
      }
  };

  function handleClick(event) {
    if (event.target == event.currentTarget) {
      const xpos = event.pageX - event.currentTarget.offsetLeft;
      const ypos = event.pageY - event.currentTarget.offsetTop;
      console.log(xpos, ypos);
      var fieldHeight = (315.5 / 739.68) * (739.68 - ypos)-firstY;
      var fieldWidth = (651.25 / 1523.52) * xpos-firstX;
      // console.log("state", state);
      const newPos = state.length + 1;
      if (newPos==1){
        firstX = fieldWidth;
        firstY = fieldHeight;
        console.log(firstX, firstY)
        fieldHeight=0;
        fieldWidth=0;
      }
      setState((prevState) => [
        ...prevState,
        {
          x: xpos,
          y: ypos,
          fieldx: fieldWidth,
          fieldy: fieldHeight,
          pos: newPos,
        },
      ]);
      console.log([fieldHeight, fieldWidth]);
    }
    state.forEach((item, i) => {
      item.pos = i + 1;
    });

    console.log(state);
  }
  function handleClickMark(text) {
    var element = document.getElementById(text);
    console.log(element);
    if (element.style.display == "none") {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  }

  function handleMarkRemove(fieldx, fieldy, pos) {
    var cur = state.filter(
      (item) => item.fieldx != fieldx && item.fieldy != fieldy
    );
    setState(cur);
    state.forEach((item, i) => {
      if (pos < item.pos) {
        item.pos = i;
      }
    });
    console.log(state)
  }
  function saveFile() {
    var filetxtRel = "";
    var filetxtAbs = "";
    filetxtRel+="width,height\n"
    filetxtAbs+="width,height\n"
    state.forEach(function (e) {
      filetxtRel =
        filetxtRel + e.fieldx.toFixed(2) + "," + e.fieldy.toFixed(2) + "\n";
      filetxtAbs+=((e.fieldx+firstX).toFixed(2) + "," + (e.fieldy+firstY).toFixed(2) + "\n")
    });
    var a = document.createElement("a");
    a.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(filetxtAbs)
    );
    a.setAttribute("download", "fileAbs.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);    
    // var a = document.createElement("a");
    // a.setAttribute(
    //   "href",
    //   "data:text/csv;charset=utf-8," + encodeURIComponent(filetxtRel)
    // );
    // a.setAttribute("download", "fileRel.csv");
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
  }

  function enterCoords() {
    var xCoords = document.getElementById("coordEnterX").value;
    var yCoords = document.getElementById("coordEnterY").value;
    var fieldWidth =
      parseFloat(
        xCoords.substring(0, xCoords.indexOf('"'))
      );
    var fieldHeight =
      parseFloat(
        yCoords.substring(0, yCoords.indexOf('"'))
      );
    const totalElem = state.length + 1;
    var xpos = fieldWidth / (651.25 / 1523.52);
    var ypos = 739.68 - fieldHeight / (315.5 / 739.68);
    fieldWidth-=firstX;
    fieldHeight-=firstY;
    console.log(xpos, ypos);
    console.log("state", state);
    const newPos = state.length + 1;
    if (newPos==1){
      firstX = fieldWidth;
      firstY = fieldHeight;
      fieldHeight=0;
      fieldWidth=0;
    }

    setState((prevState) => [
      ...prevState,
      {
        x: xpos,
        y: ypos,
        fieldx: fieldWidth,
        fieldy: fieldHeight,
        pos: newPos,
      },
    ]);
    console.log([fieldHeight, fieldWidth]);
  }
  
  function HandleDown(event, initialX, initialY){
    isDown=true;
    const xpos = event.pageX - event.currentTarget.offsetLeft;
    const ypos = event.pageY - event.currentTarget.offsetTop;
    offsetX = -1*xpos;
    offsetY = -1*ypos;
    initialXReal=initialX;
    initialYReal=initialY;
  }

  function HandleDrag(event, pos){
    if(isDown){
      state.forEach((item, i) => {
        console.log(item.pos, pos)
        if (item.pos==pos){
          console.log(item)
          console.log("handled");
          const xpos = event.pageX - event.currentTarget.offsetLeft+offsetX;
          const ypos = event.pageY - event.currentTarget.offsetTop+offsetY;
          console.log(xpos, ypos, item.x, item.y);
          item.x = initialXReal+xpos;
          item.y = initialYReal+ypos;
          item.fieldy = (315.5 / 739.68) * (739.68 - item.y)-firstY;
          item.fieldx = (651.25 / 1523.52) * item.x-firstX;
        }
      })
    }
  }

  function HandleUp(fieldX, fieldY, X, Y, Pos){
    isDown=false;
    var cur = state.filter((item) => {
      return item.fieldx!=fieldX&&item.fieldy!=fieldY;
    })
    setState(cur);
    setState((prevState) => [
      ...prevState,
      {
        x: X,
        y: Y,
        fieldx: fieldX,
        fieldy: fieldY,
        pos: Pos,
      },
    ]);
  }

  const pictureDims = {
    height: "138%",
    width: "138%",
  };

  return (
    <div className="container" onContextMenu={(e) => e.preventDefault()}>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.11.0/umd/react.production.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.11.0/umd/react-dom.production.min.js"></script>
      <img
        style={{ position: "relative" }}
        onClick={handleClick}
        src={require("./Field_Map_2023.png")}
        height={pictureDims.height}
        width={pictureDims.width}
      />
      <input id="coordEnterX" placeholder="Enter Coords Here for X"></input>
      <input id="coordEnterY" placeholder="Enter Coords Here for Y"></input>
      <button onClick={() => enterCoords()}>Submit!</button>
      <br />
      <br />
      <button onClick={() => saveFile()}>Save</button>
      <form>
        <input
            onChange={handleFileChange}
            id="csvInput"
            name="file"
            type="File"
        />
        <button onClick={(event) => {handleParse(event)}}>Parse</button>
      </form>

      {state.map((value, index) => {
        return (
          <>
            <div
              id={`${Math.floor(value.fieldx / 12)}' ${(
                value.fieldx % 12
              ).toFixed(2)}", ${Math.floor(value.fieldy / 12)}' ${(
                value.fieldy % 12
              ).toFixed(2)}"`}
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
              {value.pos}: {value.fieldx.toFixed(2)}", 
              {value.fieldy.toFixed(2)}"
            </div>
            <div
              id={`${Math.floor(value.fieldx / 12)}' ${(
                value.fieldx % 12
              ).toFixed(2)}", ${Math.floor(value.fieldy / 12)}' ${(
                value.fieldy % 12
              ).toFixed(2)}" dot`}
              style={{
                position: "absolute",
                left: value.x - 7,
                top: value.y - 7,
                height: "18px",
                width: "18px",
                backgroundColor: "#f5e218",
                display: "flex-row",
                borderRadius: "9px",
              }}
              onClick={() =>
                handleClickMark(
                  `${Math.floor(value.fieldx / 12)}' ${(
                    value.fieldx % 12
                  ).toFixed(2)}", ${Math.floor(value.fieldy / 12)}' ${(
                    value.fieldy % 12
                  ).toFixed(2)}"`
                )
              }
              onContextMenu={() =>
                handleMarkRemove(value.fieldx, value.fieldy, value.pos)
              }
              onMouseDown={(event) => HandleDown(event, value.x, value.y)}
              onMouseUp={() => HandleUp(value.fieldx, value.fieldy, value.x, value.y, value.pos)}
              onMouseMove = {(event) => HandleDrag(event, value.pos)}
            >
              <div
                style={{
                  position: "absolute",
                  left: "5px",
                  top: "5px",
                  height: "8px",
                  width: "8px",
                  borderRadius: "4px",
                  backgroundColor: "#FFFFFF",
                }}
              ></div>
            </div>
          </>
        );
      })}
    </div>
  );
}

export default App;
