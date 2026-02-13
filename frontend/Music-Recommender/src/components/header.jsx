import React from "react"
import './Header.css'

//Header component that handles button clicks
function Header({currentView, setCurrentView}) {

    const getButton = (viewName) => {
        if (currentView === viewName){
            return 'active'
        }
        return '';
    };

    return (
        <header className="header">
            <h1>Music & Podcast Recommender</h1>
            <nav className="nav">

                <button
                className = {getButton('Recommendations')}
                onClick={() => setCurrentView('Recommendations')}
                >Recommendations</button>

                <button
                className = {getButton('Browse')}
                onClick={() => setCurrentView('Browse')}
                >Browse</button>

                <button
                className = {getButton('About')}
                onClick={() =>setCurrentView('About')}
                >About</button>

            </nav>
        </header>
    );
}

export default Header;