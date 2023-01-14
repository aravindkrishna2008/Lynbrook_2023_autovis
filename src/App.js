import logo from "./logo.svg";
import "./App.css";
import React from "react";

var firstX = 0;
var firstY = 0;

function App() {
  const [state, setState] = React.useState([]);
  const list = [];
  function handleClick(event) {
    if (event.target == event.currentTarget) {
      const xpos = event.pageX - event.currentTarget.offsetLeft;
      const ypos = event.pageY - event.currentTarget.offsetTop;
      console.log(xpos, ypos);
      var fieldHeight = (315.5 / 739.68) * (739.68 - ypos) - firstY;
      var fieldWidth = (651.25 / 1523.52) * xpos - firstX;
      // console.log("state", state);
      const newPos = state.length + 1;
      if (newPos == 1) {
        firstX = fieldWidth;
        firstY = fieldHeight;
        console.log(firstX, firstY);
        fieldHeight = 0;
        fieldWidth = 0;
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
    console.log(element.style.display);
    if (element.style.display == "none") {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  }

  function handleMarkRemove(idLabel, idMark, pos) {
    var cur = state.filter(
      (item) => item.fieldx != idLabel && item.fieldy != idMark
    );
    setState(cur);
    state.forEach((item, i) => {
      if (pos < item.pos) {
        item.pos = i;
      }
    });
  }
  function saveFile() {
    var filetxt = "";
    state.forEach(function (e) {
      filetxt =
        filetxt + e.fieldx.toFixed(2) + "," + e.fieldy.toFixed(2) + "\n";
    });
    var a = document.createElement("a");
    a.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(filetxt)
    );
    a.setAttribute("download", "file.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function enterCoords() {
    var xCoords = document.getElementById("coordEnterX").value;
    var yCoords = document.getElementById("coordEnterY").value;
    var fieldWidth = parseFloat(xCoords.substring(0, xCoords.indexOf('"')));
    var fieldHeight = parseFloat(yCoords.substring(0, yCoords.indexOf('"')));
    const totalElem = state.length + 1;
    const xpos = fieldWidth / (651.25 / 1523.52);
    const ypos = 739.68 - fieldHeight / (315.5 / 739.68);
    fieldWidth -= firstX;
    fieldHeight -= firstY;
    console.log(xpos, ypos);
    console.log("state", state);
    const newPos = state.length + 1;
    if (newPos == 1) {
      firstX = fieldWidth;
      firstY = fieldHeight;
      fieldHeight = 0;
      fieldWidth = 0;
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
              <input
                placeholder="speed"
                className="input"
                onChange={(e) => {
                  console.log(e.target.value);
                  const index = state.findIndex((el) => el == value);
                  console.log(index);
                  const newState = [...state];
                  newState[index].speed = e.target.value;
                  setState(newState);
                }}
                value={value.speed}
              ></input>
              <input
                placeholder="angle"
                className="input"
                onChange={(e) => {
                  console.log(e.target.value);
                  const index = state.findIndex((el) => el == value);
                  console.log(index);
                  const newState = [...state];
                  newState[index].angle = e.target.value;
                  setState(newState);
                }}
                value={value.angle}
              ></input>
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
