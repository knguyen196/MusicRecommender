import React from "react";
import { useState } from "react";
import './Body.css';

function Body() {

    const [input, setInput] = useState("");

    const handleButtonClick = () => {
        if (input.trim() === ""){
            alert("Please enter song details before submitting.");
            return;
        }
    }

    return (
        <main className="body">
            <div className="content">
                <h2>Placeholder for now</h2>
                <div className="search-container">
                    <input type="text" className = "search-input" placeholder ="Enter song details"
                        value ={input}
                        onChange={(e) => setInput(e.target.value)} />
                        <button className = "submit-button" onClick={handleButtonClick}>Submit</button>
                </div>
                
                <p>App content will go here in the future</p>
                </div>
        </main>
    )
}

export default Body;