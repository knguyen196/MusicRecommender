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
                <input type="text" placeholder ="Enter song details"
                value ={input}
                onChange={(e) => setInput(e.target.value)} />
                <button onClick={handleButtonClick}>Submit</button>
                <p>App content will go here in the future</p>
                </div>
        </main>
    )
}

export default Body;