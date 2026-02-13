import React from "react";
import {useState} from "react";

function Browse(){
    const [input, setInput] = useState("");

    const buttonClick = () => {
        if (input.trim() === ""){
            alert("Please enter song details");
            return;
        }
    }

    return (
        <div>
            <h2>Browse & Rate Music</h2>
            <div className = "search-container">
                <input
                type ="text"
                className = "search-input"
                placeholder = "Enter song details"
                value = {input}
                onChange = {(e) => setInput(e.target.value)}
                />
                <button className = "submit-button" onClick = {buttonClick}>
                    Submit
                </button>
            </div>
            <p>Browsing random tracks may go here / search results</p>
        </div>
    );
}

export default Browse;