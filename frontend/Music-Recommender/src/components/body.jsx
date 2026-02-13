import React from "react";
import { useState } from "react";
import "./Body.css";
import Recommendations from "./Recommendations";
import Browse   from "./Browse";
import About from "./About";

function Body({currentView}){

    const renderView = () => {
        if (currentView === 'Recommendations'){
            return <Recommendations/>;
        }

        if (currentView === 'Browse'){
            return <Browse/>;
        }

        if (currentView === 'About'){
            return <About/>;
        }
    };

    return (
        <main className = "body">
            <div className ="content">
                {renderView()}
            </div>
        </main>
    );
}

export default Body;