import React from "react";
import Timescale from "./components/Timescale";
import TimeTrackList from "./components/TimeTrackList";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className={"Container"}>
        <Timescale />
        <TimeTrackList />
      </div>
    </div>
  );
}

export default App;
