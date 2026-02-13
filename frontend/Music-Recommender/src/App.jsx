import React from "react";
import {useState} from "react";
import Header from "./components/Header";
import Body from "./components/Body";

function App() {

  const [currentView, setCurrentView] = useState('Browse');

  return (
    <div className="app">
      <Header currentView = {currentView} setCurrentView ={setCurrentView} />
      <Body currentView = {currentView}/>
    </div>
  )
}

export default App;